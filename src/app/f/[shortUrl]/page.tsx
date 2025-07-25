// // src/app/f/[shortUrl]/page.tsx
// import { notFound } from 'next/navigation'
// import { prisma } from '@/lib/prisma'
// import { Metadata } from 'next'

// interface PageProps {
//     params: {
//         shortUrl: string
//     }
// }

// async function getFlyerByShortUrl(shortUrl: string) {
//     try {
//         const flyer = await prisma.flyer.findFirst({
//             where: {
//                 shortUrl,
//                 isPublic: true
//             },
//             include: {
//                 template: true,
//                 user: {
//                     select: {
//                         name: true
//                     }
//                 }
//             }
//         })

//         if (flyer) {
//             // Increment view count
//             await prisma.flyer.update({
//                 where: { id: flyer.id },
//                 data: { viewCount: { increment: 1 } }
//             })
//         }

//         return flyer
//     } catch (error) {
//         console.error('Error fetching flyer:', error)
//         return null
//     }
// }

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//     const flyer = await getFlyerByShortUrl(params.shortUrl)

//     if (!flyer) {
//         return {
//             title: 'Flyer Not Found',
//             description: 'The requested flyer could not be found.'
//         }
//     }

//     const extractedData = flyer.extractedData as any
//     const editableFields = flyer.editableFields as any

//     const title = editableFields?.title || extractedData?.title || flyer.title || 'Flyer'
//     const description = editableFields?.description || extractedData?.description || 'View this flyer'

//     return {
//         title,
//         description,
//         openGraph: {
//             title,
//             description,
//             type: 'website',
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title,
//             description,
//         }
//     }
// }

// export default async function PublicFlyerPage({ params }: PageProps) {
//     const flyer = await getFlyerByShortUrl(params.shortUrl)

//     if (!flyer || !flyer.template) {
//         notFound()
//     }

//     // Prepare the data for rendering
//     const extractedData = flyer.extractedData as any
//     const editableFields = flyer.editableFields as any || {}

//     // Replace placeholders in template
//     let html = flyer.template.htmlContent
//     const css = flyer.template.cssContent
//     const js = flyer.template.jsContent || ''

//     const placeholders = {
//         '{{title}}': editableFields.title || extractedData.title || 'Event Title',
//         '{{description}}': editableFields.description || extractedData.description || 'Event description goes here...',
//         '{{date}}': editableFields.date || extractedData.date || 'Date TBA',
//         '{{time}}': editableFields.time || extractedData.time || 'Time TBA',
//         '{{location}}': editableFields.location || extractedData.location || 'Location TBA',
//         '{{address}}': editableFields.address || extractedData.address || '',
//         '{{phone}}': editableFields.phone || extractedData.phone || '',
//         '{{email}}': editableFields.email || extractedData.email || '',
//         '{{website}}': editableFields.website || extractedData.website || '',
//         '{{buttonText}}': editableFields.buttonText || 'Learn More',
//         '{{buttonUrl}}': editableFields.buttonUrl || '#',
//     }

//     // Replace placeholders
//     Object.entries(placeholders).forEach(([placeholder, value]) => {
//         html = html.replace(new RegExp(placeholder, 'g'), value as string)
//     })

//     return (
//         <html lang="en">
//             <head>
//                 <meta charSet="UTF-8" />
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//                 <style dangerouslySetInnerHTML={{
//                     __html: `
//             ${css}
//             body { 
//               margin: 0; 
//               padding: 0; 
//               font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//               min-height: 100vh;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               background: #f5f5f5;
//             }
//             .flyer-container {
//               width: 100%;
//               max-width: 500px;
//               margin: 1rem;
//             }
//             .powered-by {
//               text-align: center;
//               margin-top: 1rem;
//               padding: 0.5rem;
//               font-size: 0.75rem;
//               color: #666;
//               background: rgba(255,255,255,0.8);
//               border-radius: 4px;
//             }
//             .powered-by a {
//               color: #3b82f6;
//               text-decoration: none;
//             }
//             .powered-by a:hover {
//               text-decoration: underline;
//             }
//           `
//                 }} />
//             </head>
//             <body>
//                 <div className="flyer-container">
//                     <div dangerouslySetInnerHTML={{ __html: html }} />
//                     <div className="powered-by">
//                         Powered by <a href={process.env.NEXTAUTH_URL} target="_blank" rel="noopener noreferrer">FlyerWeb</a>
//                     </div>
//                 </div>
//                 {js && (
//                     <script dangerouslySetInnerHTML={{ __html: js }} />
//                 )}
//             </body>
//         </html>
//     )
// }

// src/app/f/[shortUrl]/page.tsx
import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QRCode from 'qrcode'

async function generateQRCodeDataUrl(url: string): Promise<string> {
    try {
        return await QRCode.toDataURL(url, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        })
    } catch (error) {
        console.error('Error generating QR code:', error)
        return ''
    }
}

async function getFlyerByShortUrl(shortUrl: string) {
    try {
        const flyer = await prisma.flyer.findFirst({
            where: {
                shortUrl,
                isPublic: true
            },
            include: {
                template: true,
                user: {
                    select: {
                        name: true
                    }
                }
            }
        })

        if (flyer) {
            // Generate and save QR code if it doesn't exist and we have a generatedUrl
            if (!flyer.qrCodePath && flyer.generatedUrl) {
                console.log('Generating QR code for:', flyer.generatedUrl)
                const qrCodeDataUrl = await generateQRCodeDataUrl(flyer.generatedUrl)

                if (qrCodeDataUrl) {
                    console.log('Generated QR code, saving to database...')
                    await prisma.flyer.update({
                        where: { id: flyer.id },
                        data: {
                            qrCodePath: qrCodeDataUrl,
                            viewCount: { increment: 1 }
                        }
                    })

                    // Return updated flyer with QR code
                    return await prisma.flyer.findFirst({
                        where: { id: flyer.id },
                        include: {
                            template: true,
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    })
                }
            } else {
                // Just increment view count if QR code already exists
                await prisma.flyer.update({
                    where: { id: flyer.id },
                    data: { viewCount: { increment: 1 } }
                })
            }
        }

        return flyer
    } catch (error) {
        console.error('Error fetching flyer:', error)
        return null
    }
}

interface PageProps {
    params: {
        shortUrl: string
    }
}

// Rest of your code remains the same...
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const flyer = await getFlyerByShortUrl(params.shortUrl)

    if (!flyer) {
        return {
            title: 'Flyer Not Found',
            description: 'The requested flyer could not be found.'
        }
    }

    const extractedData = flyer.extractedData as any
    const editableFields = flyer.editableFields as any

    const title = editableFields?.title || extractedData?.title || flyer.title || 'Flyer'
    const description = editableFields?.description || extractedData?.description || 'View this flyer'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    }
}

export default async function PublicFlyerPage({ params }: PageProps) {

    const flyer = await getFlyerByShortUrl(params.shortUrl)
    console.log("flyer", flyer)
    if (!flyer || !flyer.template) {
        notFound()
    }




    // Prepare the data for rendering
    const extractedData = flyer.extractedData as any
    const editableFields = flyer.editableFields as any || {}

    // Replace placeholders in template
    let html = flyer.template.htmlContent
    const css = flyer.template.cssContent
    const js = flyer.template.jsContent || ''

    const placeholders = {
        '{{title}}': editableFields.title || extractedData.title || 'Event Title',
        '{{description}}': editableFields.description || extractedData.description || 'Event description goes here...',
        '{{date}}': editableFields.date || extractedData.date || 'Date TBA',
        '{{time}}': editableFields.time || extractedData.time || 'Time TBA',
        '{{location}}': editableFields.location || extractedData.location || 'Location TBA',
        '{{address}}': editableFields.address || extractedData.address || '',
        '{{phone}}': editableFields.phone || extractedData.phone || '',
        '{{email}}': editableFields.email || extractedData.email || '',
        '{{website}}': editableFields.website || extractedData.website || '',
        '{{buttonText}}': editableFields.buttonText || 'Learn More',
        '{{buttonUrl}}': editableFields.buttonUrl || '#',
        '{{qrCode}}': flyer.qrCodePath || ''
    }

    // Replace placeholders
    Object.entries(placeholders).forEach(([placeholder, value]) => {
        html = html.replace(new RegExp(placeholder, 'g'), value as string)
    })

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style dangerouslySetInnerHTML={{
                    __html: `
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
                        .powered-by {
                            text-align: center;
                            margin-top: 1rem;
                            padding: 0.5rem;
                            font-size: 0.75rem;
                            color: #666;
                            background: rgba(255,255,255,0.8);
                            border-radius: 4px;
                        }
                        .powered-by a {
                            color: #3b82f6;
                            text-decoration: none;
                        }
                        .powered-by a:hover {
                            text-decoration: underline;
                        }
                        .qr-code {
                            display: block;
                            margin: 1rem auto;
                            max-width: 150px;
                            height: auto;
                        }
                    `
                }} />
            </head>
            <body>
                <div className="flyer-container">
                    <div dangerouslySetInnerHTML={{ __html: html }} />
                    <div className="powered-by">
                        Powered by <a href={process.env.NEXTAUTH_URL} target="_blank" rel="noopener noreferrer">InteractMe</a>
                    </div>
                </div>
                {js && (
                    <script dangerouslySetInnerHTML={{ __html: js }} />
                )}
            </body>
        </html>
    )
} 