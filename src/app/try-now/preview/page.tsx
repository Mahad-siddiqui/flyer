'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    CheckCircle,
    Edit3,
    Eye,
    Share2,
    QrCode,
    Lock,
    Sparkles,
    User,
    Mail,
    CreditCard,
    Shield
} from 'lucide-react'
import Link from 'next/link'

interface TrialData {
    fileName: string
    extractedData: any
    preview: string
}

interface EditableFields {
    title: string
    description: string
    date: string
    time: string
    location: string
    address: string
    phone: string
    email: string
    website: string
    buttonText: string
}

export default function PreviewPage() {
    const [trialData, setTrialData] = useState<TrialData | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [fields, setFields] = useState<EditableFields>({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        buttonText: 'Learn More'
    })
    const [showSignUpPrompt, setShowSignUpPrompt] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Get trial data from sessionStorage
        const storedData = sessionStorage.getItem('trialFileData')
        const storedTemplate = sessionStorage.getItem('selectedTemplate')
        
        if (storedData && storedTemplate) {
            const data = JSON.parse(storedData)
            setTrialData(data)
            setSelectedTemplate(storedTemplate)
            
            // Initialize fields with extracted data
            if (data.extractedData) {
                setFields({
                    title: data.extractedData.title || '',
                    description: data.extractedData.description || '',
                    date: data.extractedData.date || '',
                    time: data.extractedData.time || '',
                    location: data.extractedData.location || '',
                    address: data.extractedData.address || '',
                    phone: data.extractedData.phone || '',
                    email: data.extractedData.email || '',
                    website: data.extractedData.website || '',
                    buttonText: 'Learn More'
                })
            }
        } else {
            // Redirect back if no trial data
            router.push('/try-now')
        }
    }, [router])

    const handleFieldChange = (field: keyof EditableFields, value: string) => {
        setFields(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePublish = () => {
        setShowSignUpPrompt(true)
    }

    const handleSignUp = () => {
        // Store current state for after signup
        sessionStorage.setItem('preSignupFields', JSON.stringify(fields))
        router.push('/auth/signin?callbackUrl=/try-now/publish')
    }

    if (!trialData || !selectedTemplate) {
        return (
            <div className="container py-8 px-4 max-w-4xl">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Loading your preview...</p>
                    <Link href="/try-now/templates">
                        <Button variant="outline">Back to Templates</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link href="/try-now/templates">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Templates
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Preview & Edit</h1>
                        <p className="text-muted-foreground">
                            Customize your interactive document - {trialData.fileName}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Upload</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-primary" />
                    <div className="flex items-center gap-2 text-primary">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            <CheckCircle className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Templates</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-primary" />
                    <div className="flex items-center gap-2 text-primary">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                            3
                        </div>
                        <span className="font-medium">Preview</span>
                    </div>
                </div>
            </div>

            {/* Trial Benefits Alert */}
            <Alert className="mb-6 border-green-200 bg-green-50">
                <Sparkles className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                    <strong>Free Preview:</strong> Edit and customize everything! 
                    Sign up only when you're ready to publish and get your QR code & shareable link.
                </AlertDescription>
            </Alert>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Editor Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit3 className="h-5 w-5" />
                                Edit Your Content
                            </CardTitle>
                            <CardDescription>
                                Customize the fields below to personalize your interactive document
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={fields.title}
                                    onChange={(e) => handleFieldChange('title', e.target.value)}
                                    placeholder="Enter title"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={fields.description}
                                    onChange={(e) => handleFieldChange('description', e.target.value)}
                                    placeholder="Enter description"
                                    rows={3}
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input
                                        id="date"
                                        value={fields.date}
                                        onChange={(e) => handleFieldChange('date', e.target.value)}
                                        placeholder="Enter date"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="time">Time</Label>
                                    <Input
                                        id="time"
                                        value={fields.time}
                                        onChange={(e) => handleFieldChange('time', e.target.value)}
                                        placeholder="Enter time"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={fields.location}
                                    onChange={(e) => handleFieldChange('location', e.target.value)}
                                    placeholder="Enter location"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={fields.address}
                                    onChange={(e) => handleFieldChange('address', e.target.value)}
                                    placeholder="Enter address"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={fields.phone}
                                        onChange={(e) => handleFieldChange('phone', e.target.value)}
                                        placeholder="Enter phone"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={fields.email}
                                        onChange={(e) => handleFieldChange('email', e.target.value)}
                                        placeholder="Enter email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={fields.website}
                                    onChange={(e) => handleFieldChange('website', e.target.value)}
                                    placeholder="Enter website"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="buttonText">Button Text</Label>
                                <Input
                                    id="buttonText"
                                    value={fields.buttonText}
                                    onChange={(e) => handleFieldChange('buttonText', e.target.value)}
                                    placeholder="Enter button text"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Live Preview
                            </CardTitle>
                            <CardDescription>
                                See how your interactive document will look
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Mock Preview */}
                            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 p-6 flex flex-col justify-center text-center">
                                    <h2 className="text-2xl font-bold mb-4 text-primary">
                                        {fields.title || 'Your Title Here'}
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        {fields.description || 'Your description will appear here...'}
                                    </p>
                                    
                                    {(fields.date || fields.time) && (
                                        <div className="mb-4 p-3 bg-white/80 rounded-lg">
                                            {fields.date && <div className="font-medium">{fields.date}</div>}
                                            {fields.time && <div className="text-sm text-muted-foreground">{fields.time}</div>}
                                        </div>
                                    )}
                                    
                                    {fields.location && (
                                        <div className="mb-4 p-3 bg-white/80 rounded-lg">
                                            <div className="font-medium">{fields.location}</div>
                                            {fields.address && <div className="text-sm text-muted-foreground">{fields.address}</div>}
                                        </div>
                                    )}
                                    
                                    <Button className="mb-4">
                                        {fields.buttonText || 'Learn More'}
                                    </Button>
                                    
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        {fields.phone && <div>{fields.phone}</div>}
                                        {fields.email && <div>{fields.email}</div>}
                                        {fields.website && <div>{fields.website}</div>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Publish Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Share2 className="h-5 w-5" />
                                Ready to Publish?
                            </CardTitle>
                            <CardDescription>
                                Get your QR code and shareable link to make your document live
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg border-2 border-dashed">
                                <div className="flex items-center justify-center gap-3 text-muted-foreground">
                                    <QrCode className="h-8 w-8" />
                                    <div className="text-center">
                                        <div className="font-medium">QR Code & Link</div>
                                        <div className="text-sm">Available after publishing</div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handlePublish} size="lg" className="w-full">
                                <Lock className="mr-2 h-4 w-4" />
                                Publish & Get QR Code
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Sign up required to publish and get your shareable link
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Sign Up Prompt Modal */}
            {showSignUpPrompt && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <CardTitle className="flex items-center justify-center gap-2">
                                <Sparkles className="h-5 w-5 text-primary" />
                                Ready to Publish?
                            </CardTitle>
                            <CardDescription>
                                Create your free account to get your QR code and shareable link
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div className="text-sm">
                                        <div className="font-medium text-green-800">Your work is saved</div>
                                        <div className="text-green-600">All your edits will be preserved</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                    <QrCode className="h-5 w-5 text-blue-600" />
                                    <div className="text-sm">
                                        <div className="font-medium text-blue-800">Instant QR code</div>
                                        <div className="text-blue-600">Get your shareable link immediately</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                    <Shield className="h-5 w-5 text-purple-600" />
                                    <div className="text-sm">
                                        <div className="font-medium text-purple-800">Free forever</div>
                                        <div className="text-purple-600">No credit card required</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button onClick={handleSignUp} className="flex-1">
                                    <User className="mr-2 h-4 w-4" />
                                    Sign Up Free
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setShowSignUpPrompt(false)}
                                    className="flex-1"
                                >
                                    Keep Editing
                                </Button>
                            </div>

                            <p className="text-xs text-center text-muted-foreground">
                                By signing up, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}