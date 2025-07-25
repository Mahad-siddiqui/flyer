"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Smartphone,
  Monitor,
  Tablet,
  Download,
  Share2,
  QrCode,
  ExternalLink,
  Crown,
} from "lucide-react";
import { QRCodeGenerator } from "@/components/qr-code-generator";
import { toast } from "sonner";

interface TemplatePreviewProps {
  template: {
    id: string;
    name: string;
    description: string;
    category: string;
    htmlContent: string;
    cssContent: string;
    jsContent?: string;
    isPremium: boolean;
  };
  flyerData?: {
    id: string;
    extractedData: any;
    editableFields?: any;
  } | null;
  templateId: string;
}

export function TemplatePreview({ template, flyerData, templateId }: TemplatePreviewProps) {
  const [selectedDevice, setSelectedDevice] = useState<
    "mobile" | "tablet" | "desktop"
  >("mobile");
  const [previewHtml, setPreviewHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);

  useEffect(() => {
    generatePreviewHtml();
  }, [template, flyerData]);

  const generatePreviewHtml = () => {
    let html = template.htmlContent;
    const css = template.cssContent;
    const js = template.jsContent || "";

    // If we have flyer data, replace placeholders
    if (flyerData?.extractedData) {
      const data = flyerData.extractedData;
      const editableFields = flyerData.editableFields || {};

      // Common placeholders
      const placeholders = {
        "{{title}}": editableFields.title || data.title || "Event Title",
        "{{description}}":
          editableFields.description ||
          data.description ||
          "Event description goes here...",
        "{{date}}": editableFields.date || data.date || "Date TBA",
        "{{time}}": editableFields.time || data.time || "Time TBA",
        "{{location}}":
          editableFields.location || data.location || "Location TBA",
        "{{address}}": editableFields.address || data.address || "",
        "{{phone}}": editableFields.phone || data.phone || "",
        "{{email}}": editableFields.email || data.email || "",
        "{{website}}": editableFields.website || data.website || "",
        "{{buttonText}}": editableFields.buttonText || "Learn More",
        "{{buttonUrl}}": editableFields.buttonUrl || "#",
      };

      // Replace placeholders
      Object.entries(placeholders).forEach(([placeholder, value]) => {
        html = html.replace(new RegExp(placeholder, "g"), value as string);
      });
    } else {
      // Use default sample data
      const sampleData = {
        "{{title}}": "Sample Event Title",
        "{{description}}":
          "This is a sample description of your event or promotion. Replace this with your actual content.",
        "{{date}}": "December 25, 2024",
        "{{time}}": "7:00 PM",
        "{{location}}": "Community Center",
        "{{address}}": "123 Main Street, City, State",
        "{{phone}}": "(555) 123-4567",
        "{{email}}": "info@example.com",
        "{{website}}": "www.example.com",
        "{{buttonText}}": "Get Tickets",
        "{{buttonUrl}}": "#",
      };

      Object.entries(sampleData).forEach(([placeholder, value]) => {
        html = html.replace(new RegExp(placeholder, "g"), value);
      });
    }

    // Combine HTML, CSS, and JS
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.name}</title>
        <style>
          ${css}
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f5f5;
          }
          .flyer-container {
            width: 100%;
            max-width: 500px;
            margin: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="flyer-container">
          ${html}
        </div>
        ${js ? `<script>${js}</script>` : ""}
      </body>
      </html>
    `;

    setPreviewHtml(fullHtml);
  };

  const getDeviceStyles = () => {
    switch (selectedDevice) {
      case "mobile":
        return "w-full max-w-sm mx-auto";
      case "tablet":
        return "w-full max-w-2xl mx-auto";
      case "desktop":
        return "w-full";
      default:
        return "w-full max-w-sm mx-auto";
    }
  };

  const getAspectRatio = () => {
    switch (selectedDevice) {
      case "mobile":
        return "aspect-[9/16]";
      case "tablet":
        return "aspect-[4/3]";
      case "desktop":
        return "aspect-[16/9]";
      default:
        return "aspect-[9/16]";
    }
  };

  const handleGenerateUrl = async () => {
    if (!flyerData) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/flyers/generate-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flyerId: flyerData.id,
          templateId: template.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedUrl(data.url);
        toast.success("Public URL generated successfully!");
      } else {
        throw new Error("Failed to generate URL");
      }
    } catch (error) {
      console.error("Error generating URL:", error);
      toast.error("Failed to generate URL");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadHtml = () => {
    try {
      const blob = new Blob([previewHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("HTML file downloaded successfully!");
    } catch (error) {
      console.error("Error downloading HTML:", error);
      toast.error("Failed to download HTML file");
    }
  };

  const handleShare = async () => {
    if (generatedUrl) {
      try {
        await navigator.clipboard.writeText(generatedUrl);
        toast.success("URL copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy URL");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {template.name}
              {template.isPremium && (
                <Badge
                  variant="secondary"
                  className="bg-yellow-500/10 text-yellow-700 border-yellow-200"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </CardTitle>
            <Badge variant="outline">{template.category}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Device Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedDevice}
            onValueChange={(value) => setSelectedDevice(value as any)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mobile" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-2">
                <Tablet className="h-4 w-4" />
                Tablet
              </TabsTrigger>
              <TabsTrigger value="desktop" className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Desktop
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedDevice} className="mt-6">
              <div
                className={`${getDeviceStyles()} border rounded-lg overflow-hidden bg-white shadow-lg`}
              >
                <div className={`${getAspectRatio()} relative`}>
                  <iframe
                    key={`${selectedDevice}-${Date.now()}`}
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Template Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {flyerData ? (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleGenerateUrl}
                  disabled={isGenerating}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate URL"}
                </Button>
                <Button
                  onClick={handleDownloadHtml}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML
                </Button>
              </div>

              {generatedUrl && (
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-1">
                      Your flyer is live at:
                    </p>
                    <a
                      href={generatedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {generatedUrl}
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1" asChild>
                      <a href={generatedUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Open
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Upload a flyer to use this template with your content
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button asChild>
                  <a href={`/dashboard/upload?templateId=${templateId}`}>Upload Flyer</a>
                </Button>
                <Button
                  onClick={handleDownloadHtml}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download HTML
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code */}
      {generatedUrl && (
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <QRCodeGenerator
              url={generatedUrl}
              title={`QR Code for ${template.name}`}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}