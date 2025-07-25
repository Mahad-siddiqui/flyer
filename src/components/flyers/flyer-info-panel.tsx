// src/components/flyers/flyer-info-panel.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    FileText,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Globe,
    Edit3,
    Eye,
    Download,
    Share2
} from 'lucide-react'
import { formatFileSize } from '@/lib/utils'

interface FlyerInfoPanelProps {
    flyer: {
        id: string
        title: string
        originalFileName: string
        fileType: string
        fileSize: number
        extractedData: any
        category?: string
        viewCount: number
        createdAt: string
        updatedAt: string
        generatedUrl?: string
        qrCodePath?: string
    }
    onEdit?: () => void
    onPreview?: () => void
    onShare?: () => void
}

export function FlyerInfoPanel({ flyer, onEdit, onPreview, onShare }: FlyerInfoPanelProps) {
    const extractedData = flyer.extractedData || {}

    const infoItems = [
        {
            label: 'Title',
            value: extractedData.title || 'Not detected',
            icon: FileText,
            show: true
        },
        {
            label: 'Date',
            value: extractedData.date || 'Not detected',
            icon: Calendar,
            show: !!extractedData.date
        },
        {
            label: 'Location',
            value: extractedData.location || 'Not detected',
            icon: MapPin,
            show: !!extractedData.location
        },
        {
            label: 'Address',
            value: extractedData.address || 'Not detected',
            icon: MapPin,
            show: !!extractedData.address
        },
        {
            label: 'Phone',
            value: extractedData.phone || 'Not detected',
            icon: Phone,
            show: !!extractedData.phone
        },
        {
            label: 'Email',
            value: extractedData.email || 'Not detected',
            icon: Mail,
            show: !!extractedData.email
        },
        {
            label: 'Website',
            value: extractedData.website || 'Not detected',
            icon: Globe,
            show: !!extractedData.website
        }
    ]

    return (
        <div className="space-y-6">
            {/* Flyer Details */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Flyer Information
                        </CardTitle>
                        {flyer.category && (
                            <Badge variant="outline">{flyer.category}</Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* File Info */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">File Name</div>
                            <div className="text-sm truncate">{flyer.originalFileName}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">File Size</div>
                            <div className="text-sm">{formatFileSize(flyer.fileSize)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">File Type</div>
                            <div className="text-sm">{flyer.fileType.toUpperCase()}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Views</div>
                            <div className="text-sm">{flyer.viewCount}</div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        {onEdit && (
                            <Button onClick={onEdit} size="sm" className="flex-1">
                                <Edit3 className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        )}
                        {onPreview && (
                            <Button onClick={onPreview} variant="outline" size="sm" className="flex-1">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                            </Button>
                        )}
                        {onShare && (
                            <Button onClick={onShare} variant="outline" size="sm">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Extracted Data */}
            <Card>
                <CardHeader>
                    <CardTitle>Extracted Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {infoItems.filter(item => item.show).map((item) => {
                        const Icon = item.icon
                        return (
                            <div key={item.label} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                <Icon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-muted-foreground">
                                        {item.label}
                                    </div>
                                    <div className="text-sm break-words">
                                        {item.value}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    {infoItems.filter(item => item.show).length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No content extracted from this flyer</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Status & Links */}
            {flyer.generatedUrl && (
                <Card>
                    <CardHeader>
                        <CardTitle>Public Access</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-sm font-medium text-green-800 mb-1">
                                Your flyer is live!
                            </div>
                            <div className="text-xs text-green-700 break-all">
                                {flyer.generatedUrl}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => window.open(flyer.generatedUrl, '_blank')}
                            >
                                <Eye className="h-4 w-4 mr-2" />
                                View Live
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigator.clipboard.writeText(flyer.generatedUrl || '')}
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}