"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Image,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { formatBytes } from "@/lib/utils";
import QRCode from "qrcode";

interface UploadedFile {
  file: File;
  preview: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  error?: string;
  flyer?: any;
  uploadId?: string; // Add unique ID for tracking
  templateid?: string;
  qrCodePath?: string;
}

async function generateQRCodeDataUrl(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/gif": [".gif"],
  "application/pdf": [".pdf"],
};

// Add timeout for requests
const UPLOAD_TIMEOUT = 60000; // 60 seconds
const PROCESSING_TIMEOUT = 120000; // 2 minutes

export default function UploadPage() {
  const searchParams = useSearchParams();

  const router = useRouter();
  //fetch from ?templateId=templateId
  const templateId = searchParams.get("templateId");
  console.log("templateId", templateId);

  const { data: session } = useSession();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === "file-too-large") {
            toast.error(
              `File ${file.name} is too large. Maximum size is 10MB.`
            );
          } else if (error.code === "file-invalid-type") {
            toast.error(
              `File ${file.name} is not supported. Please use JPG, PNG, GIF, or PDF.`
            );
          } else {
            toast.error(`Error with file ${file.name}: ${error.message}`);
          }
        });
      });
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        status: "uploading" as const,
        progress: 0,
        uploadId: `${Date.now()}-${Math.random()}`, // Unique ID
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      processFiles(newFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 5,
    disabled: isUploading,
  });

  // Create a timeout promise
  const createTimeoutPromise = (timeout: number) => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout")), timeout);
    });
  };

  // Enhanced fetch with timeout and better error handling
  const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout: number
  ) => {
    try {
      const response = (await Promise.race([
        fetch(url, options),
        createTimeoutPromise(timeout),
      ])) as Response;

      return response;
    } catch (error) {
      if (error instanceof Error && error.message === "Request timeout") {
        throw new Error(`Request timed out after ${timeout / 1000} seconds`);
      }
      throw error;
    }
  };

  const processFiles = async (files: UploadedFile[]) => {
    setIsUploading(true);

    for (const uploadedFile of files) {
      try {
        console.log(`Starting processing for file: ${uploadedFile.file.name}`);

        // Update status to processing
        updateFileStatus(uploadedFile, "uploading", 25);

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", uploadedFile.file);

        console.log(`Uploading file: ${uploadedFile.file.name}`);

        // Upload file and extract data with timeout
        const uploadResponse = await fetchWithTimeout(
          "/api/upload",
          {
            method: "POST",
            body: formData,
          },
          UPLOAD_TIMEOUT
        );

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("Upload response error:", errorText);
          throw new Error(
            `Upload failed (${uploadResponse.status}): ${errorText}`
          );
        }

        const uploadResult = await uploadResponse.json();
        console.log("Upload result:", uploadResult);

        // Update progress
        updateFileStatus(uploadedFile, "processing", 50);

        // Validate the upload result
        if (!uploadResult.filePath) {
          throw new Error("Upload succeeded but no file path returned");
        }

        console.log(`Creating flyer record for: ${uploadedFile.file.name}`);

        // Prepare flyer data with fallbacks
        const flyerData = {
          title:
            uploadResult.extractedData?.title ||
            uploadedFile.file.name.replace(/\.[^/.]+$/, ""),
          originalFileName: uploadedFile.file.name,
          filePath: uploadResult.filePath,
          fileType: uploadedFile.file.type,
          fileSize: uploadedFile.file.size,
          extractedData: uploadResult.extractedData || {},
          category: uploadResult.extractedData?.category || "General",
          templateId,
        };

        console.log("Flyer data:", flyerData);

        // Update progress
        updateFileStatus(uploadedFile, "processing", 75);

        // Create flyer record with timeout
        const flyerResponse = await fetchWithTimeout(
          "/api/flyers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(flyerData),
          },

          PROCESSING_TIMEOUT
        );

        if (!flyerResponse.ok) {
          const errorData = await flyerResponse.text();
          console.error("Flyer creation error:", errorData);

          let errorMessage = "Failed to create flyer";
          try {
            const parsedError = JSON.parse(errorData);
            errorMessage = parsedError.error || errorMessage;
          } catch {
            errorMessage = errorData || errorMessage;
          }

          throw new Error(`${errorMessage} (${flyerResponse.status})`);
        }
        const flyer = await flyerResponse.json();
        console.log("Flyer created:", flyer);

        if (!flyer.qrCodePath && flyer.generatedUrl) {
          console.log("Generating QR code for:", flyer.generatedUrl);
          const qrCodeDataUrl = await generateQRCodeDataUrl(flyer.generatedUrl);

          if (qrCodeDataUrl) {
            console.log("Generated QR code, saving to database...");
            const qrResponse = await fetch(`/api/flyers/${flyer.id}/update-qrcode`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ qrCodePath: qrCodeDataUrl }),
            });
            
            if (qrResponse.ok) {
              const updatedFlyer = await qrResponse.json();
              // Update the flyer object with the QR code
              Object.assign(flyer, updatedFlyer);
            }
          }
        }

        // Validate flyer creation
        if (!flyer.id) {
          throw new Error("Flyer created but no ID returned");
        }

        // Update status to completed
        updateFileStatus(uploadedFile, "completed", 100, undefined, flyer);

        toast.success(`Successfully processed ${uploadedFile.file.name}`);
      } catch (error) {
        console.error(
          `File processing error for ${uploadedFile.file.name}:`,
          error
        );

        let errorMessage = "Unknown error occurred";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        updateFileStatus(uploadedFile, "error", 0, errorMessage);
        toast.error(
          `Failed to process ${uploadedFile.file.name}: ${errorMessage}`
        );
      }
    }

    setIsUploading(false);
  };

  const updateFileStatus = (
    targetFile: UploadedFile,
    status: UploadedFile["status"],
    progress: number,
    error?: string,
    flyer?: any
  ) => {
    setUploadedFiles((prev) =>
      prev.map((file) =>
        file.uploadId === targetFile.uploadId
          ? { ...file, status, progress, error, flyer }
          : file
      )
    );
  };

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles((prev) =>
      prev.filter((file) => file.uploadId !== fileToRemove.uploadId)
    );
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const retryFile = async (fileToRetry: UploadedFile) => {
    // Reset file status and retry
    updateFileStatus(fileToRetry, "uploading", 0);
    await processFiles([fileToRetry]);
  };

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading...";
      case "processing":
        return "Processing with AI...";
      case "completed":
        return "Completed";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  const completedFiles = uploadedFiles.filter(
    (file) => file.status === "completed"
  );

  return (
    <div className="container py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Upload Flyer</h1>
            <p className="text-muted-foreground">
              Upload your flyer and let AI transform it into a web page
            </p>
          </div>
        </div>
      </div>

      {/* Usage Alert */}
      {session?.user?.plan?.flyerLimit !== -1 && (
        <Alert className="mb-6">
          <Sparkles className="h-4 w-4" />
          <AlertDescription>
            You have{" "}
            {(session?.user?.plan?.flyerLimit || 5) -
              (session?.user?.flyersUsed || 0)}{" "}
            flyers remaining in your {session?.user?.plan?.name || "Free"} plan.
            {(session?.user?.flyersUsed || 0) /
              (session?.user?.plan?.flyerLimit || 5) >
              0.8 && (
              <span className="ml-2">
                <Link href="/pricing" className="underline">
                  Upgrade for unlimited flyers
                </Link>
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8">
        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Your Flyer
            </CardTitle>
            <CardDescription>
              Drag and drop your flyer files here, or click to browse. Supports
              JPG, PNG, GIF, and PDF files up to 10MB.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
                ${
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }
                ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg text-primary">Drop your files here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">
                    Drag & drop your flyer files here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    or click to browse files
                  </p>
                  <Button variant="outline" disabled={isUploading}>
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Processing Files</CardTitle>
              <CardDescription>
                AI is analyzing your flyers and extracting information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadedFiles.map((uploadedFile, index) => (
                <div
                  key={uploadedFile.uploadId}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {uploadedFile.file.type.startsWith("image/") ? (
                      <img
                        src={uploadedFile.preview}
                        alt={uploadedFile.file.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-muted rounded flex items-center justify-center">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {uploadedFile.file.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            uploadedFile.status === "completed"
                              ? "default"
                              : uploadedFile.status === "error"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {getStatusIcon(uploadedFile.status)}
                          <span className="ml-1">
                            {getStatusText(uploadedFile.status)}
                          </span>
                        </Badge>
                        {uploadedFile.status === "error" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => retryFile(uploadedFile)}
                          >
                            Retry
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(uploadedFile)}
                          disabled={
                            uploadedFile.status === "processing" ||
                            uploadedFile.status === "uploading"
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatBytes(uploadedFile.file.size)}</span>
                      <span>{uploadedFile.file.type}</span>
                    </div>

                    {(uploadedFile.status === "uploading" ||
                      uploadedFile.status === "processing") && (
                      <Progress
                        value={uploadedFile.progress}
                        className="mt-2"
                      />
                    )}

                    {uploadedFile.error && (
                      <div className="mt-2">
                        <p className="text-sm text-red-500">
                          {uploadedFile.error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Completed Files */}
        {completedFiles.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Completed Flyers</CardTitle>
              <CardDescription>
                Your flyers have been processed and are ready to view
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedFiles.map((uploadedFile) => (
                <div
                  key={uploadedFile.uploadId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium">{uploadedFile.flyer?.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {uploadedFile.flyer?.category} • Ready to share
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" asChild>
                      <Link
                        href={uploadedFile.flyer?.generatedUrl}
                        target="_blank"
                      >
                        View Page
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href={`/dashboard/flyers/${uploadedFile.flyer?.id}`}
                      >
                        Customize
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
