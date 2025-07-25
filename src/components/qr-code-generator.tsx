// src/components/qr-code-generator.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { Download, Copy, Check } from 'lucide-react'

interface QRCodeGeneratorProps {
    url: string
    title?: string
    size?: number
}

export function QRCodeGenerator({ url, title = 'QR Code', size = 256 }: QRCodeGeneratorProps) {
    const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        generateQRCode()
    }, [url, size])

    const generateQRCode = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/qr-code/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url, size }),
            })

            if (response.ok) {
                const blob = await response.blob()
                const dataUrl = URL.createObjectURL(blob)
                setQrCodeDataUrl(dataUrl)
            }
        } catch (error) {
            console.error('Error generating QR code:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = () => {
        if (qrCodeDataUrl) {
            const link = document.createElement('a')
            link.href = qrCodeDataUrl
            link.download = `qr-code-${Date.now()}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error('Error copying URL:', error)
        }
    }

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-64 h-64 bg-muted rounded-lg animate-pulse" />
                        <p className="text-sm text-muted-foreground">Generating QR code...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                    {/* QR Code Image */}
                    {qrCodeDataUrl && (
                        <div className="p-4 bg-white rounded-lg border">
                            <img
                                src={qrCodeDataUrl}
                                alt={title}
                                className="w-64 h-64"
                            />
                        </div>
                    )}

                    {/* URL Display */}
                    <div className="w-full p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">URL:</p>
                        <p className="text-sm font-mono break-all">{url}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 w-full">
                        <Button
                            onClick={handleDownload}
                            disabled={!qrCodeDataUrl}
                            className="flex-1"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                        </Button>
                        <Button
                            onClick={handleCopyUrl}
                            variant="outline"
                            className="flex-1"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy URL
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        Scan this QR code to visit your flyer page
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}