'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
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
    Play,
    ArrowRight,
    Shield
} from 'lucide-react'
import Link from 'next/link'
import { formatBytes } from '@/lib/utils'

interface UploadedFile {
    file: File
    preview: string
    status: 'uploading' | 'processing' | 'completed' | 'error'
    progress: number
    error?: string
    extractedData?: any
    uploadId?: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_FILE_TYPES = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'application/pdf': ['.pdf'],
}

export default function TryNowPage() {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const router = useRouter()

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        // Handle rejected files
        if (rejectedFiles.length > 0) {
            rejectedFiles.forEach(({ file, errors }) => {
                errors.forEach((error: any) => {
                    if (error.code === 'file-too-large') {
                        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`)
                    } else if (error.code === 'file-invalid-type') {
                        toast.error(`File ${file.name} is not supported. Please use JPG, PNG, GIF, or PDF.`)
                    } else {
                        toast.error(`Error with file ${file.name}: ${error.message}`)
                    }
                })
            })
        }

        // Handle accepted files
        if (acceptedFiles.length > 0) {
            const newFiles = acceptedFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file),
                status: 'uploading' as const,
                progress: 0,
                uploadId: `${Date.now()}-${Math.random()}`,
            }))

            setUploadedFiles(prev => [...prev, ...newFiles])
            processFiles(newFiles)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: ACCEPTED_FILE_TYPES,
        maxSize: MAX_FILE_SIZE,
        maxFiles: 1, // Only allow one file for the trial
        disabled: isUploading,
    })

    const processFiles = async (files: UploadedFile[]) => {
        setIsUploading(true)
        setCurrentStep(1)

        for (const uploadedFile of files) {
            try {
                // Simulate processing steps
                updateFileStatus(uploadedFile, 'uploading', 25)
                await new Promise(resolve => setTimeout(resolve, 1000))

                updateFileStatus(uploadedFile, 'processing', 50)
                await new Promise(resolve => setTimeout(resolve, 1500))

                updateFileStatus(uploadedFile, 'processing', 75)
                await new Promise(resolve => setTimeout(resolve, 1000))

                // Mock extracted data
                const mockExtractedData = {
                    title: "Sample Event Title",
                    description: "This is a sample description extracted from your document.",
                    date: "December 25, 2024",
                    time: "7:00 PM",
                    location: "Community Center",
                    address: "123 Main Street, City, State",
                    phone: "(555) 123-4567",
                    email: "info@example.com",
                    category: "Event"
                }

                updateFileStatus(uploadedFile, 'completed', 100, undefined, mockExtractedData)
                setCurrentStep(2)
                toast.success(`Successfully processed ${uploadedFile.file.name}`)

            } catch (error) {
                console.error(`File processing error for ${uploadedFile.file.name}:`, error)
                updateFileStatus(uploadedFile, 'error', 0, 'Processing failed')
                toast.error(`Failed to process ${uploadedFile.file.name}`)
            }
        }

        setIsUploading(false)
    }

    const updateFileStatus = (
        targetFile: UploadedFile,
        status: UploadedFile['status'],
        progress: number,
        error?: string,
        extractedData?: any
    ) => {
        setUploadedFiles(prev =>
            prev.map(file =>
                file.uploadId === targetFile.uploadId
                    ? { ...file, status, progress, error, extractedData }
                    : file
            )
        )
    }

    const removeFile = (fileToRemove: UploadedFile) => {
        setUploadedFiles(prev => prev.filter(file => file.uploadId !== fileToRemove.uploadId))
        URL.revokeObjectURL(fileToRemove.preview)
        setCurrentStep(1)
    }

    const handleContinueToTemplates = () => {
        const completedFile = uploadedFiles.find(f => f.status === 'completed')
        if (completedFile) {
            // Store the file data in sessionStorage for the trial
            sessionStorage.setItem('trialFileData', JSON.stringify({
                fileName: completedFile.file.name,
                extractedData: completedFile.extractedData,
                preview: completedFile.preview
            }))
            router.push('/try-now/templates')
        }
    }

    const getStatusIcon = (status: UploadedFile['status']) => {
        switch (status) {
            case 'uploading':
            case 'processing':
                return <Loader2 className="h-4 w-4 animate-spin" />
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    const getStatusText = (status: UploadedFile['status']) => {
        switch (status) {
            case 'uploading':
                return 'Uploading...'
            case 'processing':
                return 'Processing with AI...'
            case 'completed':
                return 'Ready!'
            case 'error':
                return 'Error'
            default:
                return 'Unknown'
        }
    }

    const completedFiles = uploadedFiles.filter(file => file.status === 'completed')

    return (
        <div className="container py-8 px-4 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Try InteractMe FREE</h1>
                        <p className="text-muted-foreground">
                            Experience the full process - no signup required until you publish
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            {currentStep > 1 ? <CheckCircle className="h-4 w-4" /> : '1'}
                        </div>
                        <span className="font-medium">Upload</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            2
                        </div>
                        <span className="font-medium">Templates</span>
                    </div>
                    <div className={`flex-1 h-1 mx-4 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                    <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            3
                        </div>
                        <span className="font-medium">Preview</span>
                    </div>
                </div>
            </div>

            {/* Trial Benefits Alert */}
            <Alert className="mb-6 border-green-200 bg-green-50">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                    <strong>Free Trial:</strong> Upload, customize, and preview your document completely free. 
                    No credit card or email required until you're ready to publish and get your QR code!
                </AlertDescription>
            </Alert>

            <div className="grid gap-8">
                {/* Upload Area */}
                {uploadedFiles.length === 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload Your Document
                            </CardTitle>
                            <CardDescription>
                                Drop your file here to get started. We support PDF, Word documents, and images up to 10MB.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
                                    ${isDragActive
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted-foreground/25 hover:border-primary/50'
                                    }
                                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                <input {...getInputProps()} />
                                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                {isDragActive ? (
                                    <p className="text-lg text-primary">Drop your file here...</p>
                                ) : (
                                    <div>
                                        <p className="text-lg mb-2">
                                            Drag & drop your document here
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            or click to browse files
                                        </p>
                                        <Button variant="outline" disabled={isUploading}>
                                            <Play className="mr-2 h-4 w-4" />
                                            Choose File
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-center text-sm text-muted-foreground">
                                Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (max 10MB)
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Processing Files */}
                {uploadedFiles.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Processing Your Document</CardTitle>
                            <CardDescription>
                                Our AI is analyzing your document and extracting information
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {uploadedFiles.map((uploadedFile, index) => (
                                <div key={uploadedFile.uploadId} className="flex items-center gap-4 p-4 border rounded-lg">
                                    <div className="flex-shrink-0">
                                        {uploadedFile.file.type.startsWith('image/') ? (
                                            // eslint-disable-next-line @next/next/no-img-element
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
                                                <Badge variant={uploadedFile.status === 'completed' ? 'default' : uploadedFile.status === 'error' ? 'destructive' : 'secondary'}>
                                                    {getStatusIcon(uploadedFile.status)}
                                                    <span className="ml-1">{getStatusText(uploadedFile.status)}</span>
                                                </Badge>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeFile(uploadedFile)}
                                                    disabled={uploadedFile.status === 'processing' || uploadedFile.status === 'uploading'}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span>{formatBytes(uploadedFile.file.size)}</span>
                                            <span>{uploadedFile.file.type}</span>
                                        </div>

                                        {(uploadedFile.status === 'uploading' || uploadedFile.status === 'processing') && (
                                            <Progress value={uploadedFile.progress} className="mt-2" />
                                        )}

                                        {uploadedFile.error && (
                                            <div className="mt-2">
                                                <p className="text-sm text-red-500">{uploadedFile.error}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Success State */}
                {completedFiles.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Document Processed Successfully!
                            </CardTitle>
                            <CardDescription>
                                Your document has been analyzed and is ready for template selection
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {completedFiles.map((uploadedFile) => (
                                <div key={uploadedFile.uploadId} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-green-800">
                                            {uploadedFile.extractedData?.title || uploadedFile.file.name}
                                        </h3>
                                        <Badge variant="outline" className="text-green-700 border-green-300">
                                            {uploadedFile.extractedData?.category || 'Document'}
                                        </Badge>
                                    </div>
                                    
                                    {uploadedFile.extractedData && (
                                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                                            {uploadedFile.extractedData.date && (
                                                <div>
                                                    <span className="font-medium text-green-700">Date: </span>
                                                    <span className="text-green-600">{uploadedFile.extractedData.date}</span>
                                                </div>
                                            )}
                                            {uploadedFile.extractedData.location && (
                                                <div>
                                                    <span className="font-medium text-green-700">Location: </span>
                                                    <span className="text-green-600">{uploadedFile.extractedData.location}</span>
                                                </div>
                                            )}
                                            {uploadedFile.extractedData.phone && (
                                                <div>
                                                    <span className="font-medium text-green-700">Phone: </span>
                                                    <span className="text-green-600">{uploadedFile.extractedData.phone}</span>
                                                </div>
                                            )}
                                            {uploadedFile.extractedData.email && (
                                                <div>
                                                    <span className="font-medium text-green-700">Email: </span>
                                                    <span className="text-green-600">{uploadedFile.extractedData.email}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-center pt-4">
                                <Button onClick={handleContinueToTemplates} size="lg" className="px-8">
                                    Continue to Templates
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}