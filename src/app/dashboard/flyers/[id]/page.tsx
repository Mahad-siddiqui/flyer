'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import {
    ArrowLeft,
    Save,
    Eye,
    Share2,
    QrCode,
    Download,
    Edit3,
    FileText,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Globe,
    Loader2,
    CheckCircle,
    ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { QRCodeGenerator } from '@/components/qr-code-generator'

interface Flyer {
    id: string
    title: string
    originalFileName: string
    fileType: string
    fileSize: number
    extractedData: any
    editableFields?: any
    category?: string
    viewCount: number
    createdAt: string
    updatedAt: string
    generatedUrl?: string
    qrCodePath?: string
    isPublic: boolean
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
    buttonUrl: string
}

export default function FlyerEditPage() {
    const params = useParams()
    const router = useRouter()
    const { data: session } = useSession()
    const [flyer, setFlyer] = useState<Flyer | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
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
        buttonText: 'Learn More',
        buttonUrl: '#'
    })
    const [hasChanges, setHasChanges] = useState(false)
    const [originalFields, setOriginalFields] = useState<EditableFields>(fields)

    useEffect(() => {
        if (params.id && session) {
            fetchFlyer()
        }
    }, [params.id, session])

    useEffect(() => {
        const hasChanged = JSON.stringify(fields) !== JSON.stringify(originalFields)
        setHasChanges(hasChanged)
    }, [fields, originalFields])

    const fetchFlyer = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/flyers/${params.id}`)
            
            if (!response.ok) {
                throw new Error('Failed to fetch flyer')
            }

            const flyerData = await response.json()
            setFlyer(flyerData)

            // Initialize fields
            const extractedData = flyerData.extractedData || {}
            const editableFields = flyerData.editableFields || {}

            const initialFields: EditableFields = {
                title: editableFields.title || extractedData.title || flyerData.title || '',
                description: editableFields.description || extractedData.description || '',
                date: editableFields.date || extractedData.date || '',
                time: editableFields.time || extractedData.time || '',
                location: editableFields.location || extractedData.location || '',
                address: editableFields.address || extractedData.address || '',
                phone: editableFields.phone || extractedData.phone || '',
                email: editableFields.email || extractedData.email || '',
                website: editableFields.website || extractedData.website || '',
                buttonText: editableFields.buttonText || 'Learn More',
                buttonUrl: editableFields.buttonUrl || extractedData.website || '#'
            }

            setFields(initialFields)
            setOriginalFields(initialFields)
        } catch (error) {
            console.error('Error fetching flyer:', error)
            toast.error('Failed to load flyer')
            router.push('/dashboard')
        } finally {
            setLoading(false)
        }
    }

    const handleFieldChange = (field: keyof EditableFields, value: string) => {
        setFields(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleSave = async () => {
        if (!flyer) return

        try {
            setSaving(true)
            const response = await fetch(`/api/flyers/${flyer.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    editableFields: fields
                })
            })

            if (!response.ok) {
                throw new Error('Failed to save changes')
            }

            const updatedFlyer = await response.json()
            setFlyer(updatedFlyer)
            setOriginalFields(fields)
            setHasChanges(false)
            toast.success('Changes saved successfully!')
            
            // Force a re-render of the preview
            window.location.reload()
        } catch (error) {
            console.error('Error saving flyer:', error)
            toast.error('Failed to save changes')
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        setFields(originalFields)
        setHasChanges(false)
    }

    const handlePreview = () => {
        if (flyer?.generatedUrl) {
            window.open(flyer.generatedUrl, '_blank')
        }
    }

    const handleShare = async () => {
        if (flyer?.generatedUrl) {
            try {
                await navigator.clipboard.writeText(flyer.generatedUrl)
                toast.success('Link copied to clipboard!')
            } catch (error) {
                toast.error('Failed to copy link')
            }
        }
    }

    if (loading) {
        return (
            <div className="container py-8 px-4 max-w-6xl">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        )
    }

    if (!flyer) {
        return (
            <div className="container py-8 px-4 max-w-6xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Flyer Not Found</h1>
                    <p className="text-muted-foreground mb-4">The flyer you're looking for doesn't exist or you don't have permission to view it.</p>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
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
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{flyer.title}</h1>
                        <p className="text-muted-foreground">
                            Edit your interactive document
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {flyer.category && (
                        <Badge variant="outline">{flyer.category}</Badge>
                    )}
                    <Badge variant={flyer.isPublic ? 'default' : 'secondary'}>
                        {flyer.isPublic ? 'Public' : 'Private'}
                    </Badge>
                </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        <FileText className="h-4 w-4 inline mr-1" />
                        {flyer.originalFileName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        <Eye className="h-4 w-4 inline mr-1" />
                        {flyer.viewCount} views
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        disabled={!hasChanges}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreview}
                        disabled={!flyer.generatedUrl}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        disabled={!flyer.generatedUrl}
                    >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={!hasChanges || saving}
                        size="sm"
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Unsaved Changes Alert */}
            {hasChanges && (
                <Alert className="mb-6">
                    <Edit3 className="h-4 w-4" />
                    <AlertDescription>
                        You have unsaved changes. Don't forget to save your work!
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Editor Panel */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Edit3 className="h-5 w-5" />
                                Edit Content
                            </CardTitle>
                            <CardDescription>
                                Customize your flyer content and information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="content" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="content">Content</TabsTrigger>
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="contact">Contact</TabsTrigger>
                                </TabsList>

                                <TabsContent value="content" className="space-y-4 mt-6">
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
                                            rows={4}
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

                                    <div className="space-y-2">
                                        <Label htmlFor="buttonUrl">Button URL</Label>
                                        <Input
                                            id="buttonUrl"
                                            value={fields.buttonUrl}
                                            onChange={(e) => handleFieldChange('buttonUrl', e.target.value)}
                                            placeholder="Enter button URL"
                                            type="url"
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="details" className="space-y-4 mt-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date" className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Date
                                            </Label>
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
                                        <Label htmlFor="location" className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            value={fields.location}
                                            onChange={(e) => handleFieldChange('location', e.target.value)}
                                            placeholder="Enter location"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Textarea
                                            id="address"
                                            value={fields.address}
                                            onChange={(e) => handleFieldChange('address', e.target.value)}
                                            placeholder="Enter full address"
                                            rows={2}
                                        />
                                    </div>
                                </TabsContent>

                                <TabsContent value="contact" className="space-y-4 mt-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Phone
                                        </Label>
                                        <Input
                                            id="phone"
                                            value={fields.phone}
                                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                                            placeholder="Enter phone number"
                                            type="tel"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            value={fields.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            placeholder="Enter email address"
                                            type="email"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website" className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            Website
                                        </Label>
                                        <Input
                                            id="website"
                                            value={fields.website}
                                            onChange={(e) => handleFieldChange('website', e.target.value)}
                                            placeholder="Enter website URL"
                                            type="url"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview & Actions Panel */}
                <div className="space-y-6">
                    {/* Live Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Live Preview
                            </CardTitle>
                            <CardDescription>
                                See how your flyer will look to visitors
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded-lg overflow-hidden shadow-sm">
                                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 p-6 flex flex-col justify-center text-center">
                                    <h2 className="text-2xl font-bold mb-4 text-primary">
                                        {fields.title || 'Your Title Here'}
                                    </h2>
                                    <p className="text-muted-foreground mb-6">
                                        {fields.description || 'Your description will appear here...'}
                                    </p>
                                    
                                    {(fields.date || fields.time) && (
                                        <div className="mb-4 p-3 bg-white/1 0 rounded-lg">
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

                    {/* QR Code & Sharing */}
                    {flyer.generatedUrl && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <QrCode className="h-5 w-5" />
                                    QR Code & Sharing
                                </CardTitle>
                                <CardDescription>
                                    Share your interactive flyer
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <QRCodeGenerator
                                    url={flyer.generatedUrl}
                                    title={`QR Code for ${flyer.title}`}
                                />
                                
                                <div className="mt-4 p-3 bg-muted rounded-lg">
                                    <div className="text-sm font-medium mb-1">Public URL:</div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-xs bg-background px-2 py-1 rounded flex-1 truncate">
                                            {flyer.generatedUrl}
                                        </code>
                                        <Button size="sm" variant="outline" onClick={handleShare}>
                                            <Share2 className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={handlePreview}>
                                            <ExternalLink className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Flyer Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">{flyer.viewCount}</div>
                                    <div className="text-sm text-muted-foreground">Total Views</div>
                                </div>
                                <div className="text-center p-3 bg-muted/50 rounded-lg">
                                    <div className="text-2xl font-bold text-primary">0</div>
                                    <div className="text-sm text-muted-foreground">QR Scans</div>
                                </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground space-y-1">
                                <div>Created: {new Date(flyer.createdAt).toLocaleDateString()}</div>
                                <div>Last updated: {new Date(flyer.updatedAt).toLocaleDateString()}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}