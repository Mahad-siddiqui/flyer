'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Eye,
    Sparkles,
    Calendar,
    Megaphone,
    Briefcase,
    Mail,
    Shield
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface TrialData {
    fileName: string
    extractedData: any
    preview: string
}

const mockTemplates = [
    {
        id: 'modern-event',
        name: 'Modern Event Card',
        description: 'Clean and modern design perfect for events and conferences',
        category: 'Event',
        previewImage: '/templates/modern-event-card.jpg',
        isPremium: false,
    },
    {
        id: 'vibrant-promo',
        name: 'Vibrant Promotion',
        description: 'Eye-catching design for sales and promotional content',
        category: 'Promo',
        previewImage: '/templates/vibrant-promotion.jpg',
        isPremium: false,
    },
    {
        id: 'professional-job',
        name: 'Professional Job Listing',
        description: 'Clean and professional template for job postings',
        category: 'Job',
        previewImage: '/templates/professional-job.jpg',
        isPremium: false,
    },
    {
        id: 'newsletter-digest',
        name: 'Newsletter Digest',
        description: 'Clean layout perfect for newsletters and announcements',
        category: 'Newsletter',
        previewImage: '/templates/newsletter-digest.jpg',
        isPremium: false,
    },
    {
        id: 'luxury-event',
        name: 'Luxury Event',
        description: 'Premium template with elegant design for upscale events',
        category: 'Event',
        previewImage: '/templates/luxury-event.jpg',
        isPremium: true,
    },
]

const categoryIcons = {
    Event: Calendar,
    Promo: Megaphone,
    Job: Briefcase,
    Newsletter: Mail,
}

export default function TemplatesPage() {
    const [trialData, setTrialData] = useState<TrialData | null>(null)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string>('all')
    const router = useRouter()

    useEffect(() => {
        // Get trial data from sessionStorage
        const storedData = sessionStorage.getItem('trialFileData')
        if (storedData) {
            const data = JSON.parse(storedData)
            setTrialData(data)
            // Auto-select category based on extracted data
            if (data.extractedData?.category) {
                setActiveCategory(data.extractedData.category)
            }
        } else {
            // Redirect back if no trial data
            router.push('/try-now')
        }
    }, [router])

    const handleTemplateSelect = (templateId: string) => {
        setSelectedTemplate(templateId)
    }

    const handleContinueToPreview = () => {
        if (selectedTemplate && trialData) {
            // Store template selection
            sessionStorage.setItem('selectedTemplate', selectedTemplate)
            router.push('/try-now/preview')
        }
    }

    const categories = ['all', 'Event', 'Promo', 'Job', 'Newsletter']
    
    const filteredTemplates = activeCategory === 'all' 
        ? mockTemplates 
        : mockTemplates.filter(t => t.category === activeCategory)

    const suggestedTemplates = trialData?.extractedData?.category
        ? mockTemplates.filter(t => t.category === trialData.extractedData.category).slice(0, 3)
        : []

    if (!trialData) {
        return (
            <div className="container py-8 px-4 max-w-4xl">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Loading your document data...</p>
                    <Link href="/try-now">
                        <Button variant="outline">Back to Upload</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link href="/try-now">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Upload
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Choose Your Template</h1>
                        <p className="text-muted-foreground">
                            Select a template that matches your document: {trialData.fileName}
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
                            2
                        </div>
                        <span className="font-medium">Templates</span>
                    </div>
                    <div className="flex-1 h-1 mx-4 bg-muted" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                            3
                        </div>
                        <span className="font-medium">Preview</span>
                    </div>
                </div>
            </div>

            {/* Trial Benefits Alert */}
            <Alert className="mb-6 border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                    <strong>Free Trial:</strong> Try all templates including premium ones! 
                    No restrictions during your trial experience.
                </AlertDescription>
            </Alert>

            {/* Suggested Templates */}
            {suggestedTemplates.length > 0 && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                            Recommended for Your Document
                        </CardTitle>
                        <CardDescription>
                            Based on your {trialData.extractedData?.category || 'document'} content, 
                            these templates will work best
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            {suggestedTemplates.map((template) => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    isSelected={selectedTemplate === template.id}
                                    onSelect={handleTemplateSelect}
                                    isRecommended={true}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Category Filter */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>All Templates</CardTitle>
                    <CardDescription>
                        Browse all available templates or filter by category
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((category) => {
                            const Icon = category !== 'all' ? categoryIcons[category as keyof typeof categoryIcons] : null
                            const isActive = activeCategory === category
                            
                            return (
                                <Button
                                    key={category}
                                    variant={isActive ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setActiveCategory(category)}
                                    className="flex items-center gap-2"
                                >
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {category === 'all' ? 'All Templates' : category}
                                </Button>
                            )
                        })}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                isSelected={selectedTemplate === template.id}
                                onSelect={handleTemplateSelect}
                            />
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No templates available in this category
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Continue Button */}
            {selectedTemplate && (
                <div className="text-center">
                    <Button onClick={handleContinueToPreview} size="lg" className="px-8">
                        Continue to Preview
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}

interface TemplateCardProps {
    template: {
        id: string
        name: string
        description: string
        category: string
        previewImage: string
        isPremium: boolean
    }
    isSelected: boolean
    onSelect: (templateId: string) => void
    isRecommended?: boolean
}

function TemplateCard({ template, isSelected, onSelect, isRecommended }: TemplateCardProps) {
    return (
        <div
            className={`group relative ${
                isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
        >
            <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                {/* Preview Image */}
                <div className="aspect-[3/4] bg-muted overflow-hidden relative">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary/40" />
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                        {template.isPremium && (
                            <Badge variant="secondary" className="bg-yellow-500/90 text-yellow-900 border-0">
                                Premium
                            </Badge>
                        )}
                        {isRecommended && (
                            <Badge variant="secondary" className="bg-green-500/90 text-green-900 border-0">
                                Recommended
                            </Badge>
                        )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                        <Badge variant="outline" className="bg-white/90 border-white/20">
                            {template.category}
                        </Badge>
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                        <div className="absolute bottom-2 left-2">
                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                                <CheckCircle className="h-4 w-4" />
                            </div>
                        </div>
                    )}

                    {/* Hover Preview Button */}
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4" onClick={() => onSelect(template.id)}>
                    <h4 className="font-semibold text-sm mb-1 truncate">
                        {template.name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                        {template.description}
                    </p>

                    <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className="w-full"
                        onClick={(e) => {
                            e.stopPropagation()
                            onSelect(template.id)
                        }}
                    >
                        {isSelected ? (
                            <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Selected
                            </>
                        ) : (
                            'Select Template'
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    )
}