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

// import { prisma } from '@/lib/prisma'
// import { Metadata } from 'next'
// import { notFound } from 'next/navigation'
// import QRCode from 'qrcode'

// async function generateQRCodeDataUrl(url: string): Promise<string> {
//     try {
//         return await QRCode.toDataURL(url, {
//             width: 200,
//             margin: 2,
//             color: {
//                 dark: '#000000',
//                 light: '#ffffff'
//             }
//         })
//     } catch (error) {
//         console.error('Error generating QR code:', error)
//         return ''
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
//             // Generate and save QR code if it doesn't exist and we have a generatedUrl
//             if (!flyer.qrCodePath && flyer.generatedUrl) {
//                 console.log('Generating QR code for:', flyer.generatedUrl)
//                 const qrCodeDataUrl = await generateQRCodeDataUrl(flyer.generatedUrl)

//                 if (qrCodeDataUrl) {
//                     console.log('Generated QR code, saving to database...')
//                     await prisma.flyer.update({
//                         where: { id: flyer.id },
//                         data: {
//                             qrCodePath: qrCodeDataUrl,
//                             viewCount: { increment: 1 }
//                         }
//                     })

//                     // Return updated flyer with QR code
//                     return await prisma.flyer.findFirst({
//                         where: { id: flyer.id },
//                         include: {
//                             template: true,
//                             user: {
//                                 select: {
//                                     name: true
//                                 }
//                             }
//                         }
//                     })
//                 }
//             } else {
//                 // Just increment view count if QR code already exists
//                 await prisma.flyer.update({
//                     where: { id: flyer.id },
//                     data: { viewCount: { increment: 1 } }
//                 })
//             }
//         }

//         return flyer
//     } catch (error) {
//         console.error('Error fetching flyer:', error)
//         return null
//     }
// }

// interface PageProps {
//     params: {
//         shortUrl: string
//     }
// }

// // Rest of your code remains the same...
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
//     console.log("flyer", flyer)
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
//         '{{qrCode}}': flyer.qrCodePath || ''
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
//                         ${css}
//                         body { 
//                             margin: 0; 
//                             padding: 0; 
//                             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
//                             min-height: 100vh;
//                             display: flex;
//                             align-items: center;
//                             justify-content: center;
//                             background: #f5f5f5;
//                         }
//                         .flyer-container {
//                             width: 100%;
//                             max-width: 500px;
//                             margin: 1rem;
//                         }
//                         .powered-by {
//                             text-align: center;
//                             margin-top: 1rem;
//                             padding: 0.5rem;
//                             font-size: 0.75rem;
//                             color: #666;
//                             background: rgba(255,255,255,0.8);
//                             border-radius: 4px;
//                         }
//                         .powered-by a {
//                             color: #3b82f6;
//                             text-decoration: none;
//                         }
//                         .powered-by a:hover {
//                             text-decoration: underline;
//                         }
//                         .qr-code {
//                             display: block;
//                             margin: 1rem auto;
//                             max-width: 150px;
//                             height: auto;
//                         }
//                     `
//                 }} />
//             </head>
//             <body>
//                 <div className="flyer-container">
//                     <div dangerouslySetInnerHTML={{ __html: html }} />
//                     <div className="powered-by">
//                         Powered by <a href={process.env.NEXTAUTH_URL} target="_blank" rel="noopener noreferrer">InteractMe</a>
//                     </div>
//                 </div>
//                 {js && (
//                     <script dangerouslySetInnerHTML={{ __html: js }} />
//                 )}
//             </body>
//         </html>
//     )
// } 

// import { prisma } from '@/lib/prisma'
// import { Metadata } from 'next'
// import { notFound } from 'next/navigation'
// import QRCode from 'qrcode'

// // Force dynamic rendering to ensure fresh data
// export const dynamic = 'force-dynamic'

// async function generateQRCodeDataUrl(url: string): Promise<string> {
//     try {
//         return await QRCode.toDataURL(url, {
//             width: 200,
//             margin: 2,
//             color: {
//                 dark: '#000000',
//                 light: '#ffffff'
//             }
//         })
//     } catch (error) {
//         console.error('Error generating QR code:', error)
//         return ''
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

//         if (!flyer) return null;

//         // Generate and save QR code if it doesn't exist
//         if (!flyer.qrCodePath && flyer.generatedUrl) {
//             const qrCodeDataUrl = await generateQRCodeDataUrl(flyer.generatedUrl);
//             if (qrCodeDataUrl) {
//                 await prisma.flyer.update({
//                     where: { id: flyer.id },
//                     data: {
//                         qrCodePath: qrCodeDataUrl,
//                         viewCount: { increment: 1 }
//                     }
//                 });
//                 return {
//                     ...flyer,
//                     qrCodePath: qrCodeDataUrl,
//                     viewCount: flyer.viewCount + 1
//                 };
//             }
//         } else {
//             // Increment view count
//             await prisma.flyer.update({
//                 where: { id: flyer.id },
//                 data: { viewCount: { increment: 1 } }
//             });
//         }

//         return {
//             ...flyer,
//             viewCount: flyer.viewCount + 1
//         };
//     } catch (error) {
//         console.error('Error fetching flyer:', error);
//         return null;
//     }
// }

// interface PageProps {
//     params: {
//         shortUrl: string
//     }
// }

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//     const { shortUrl } = params;
//     const flyer = await getFlyerByShortUrl(shortUrl);

//     if (!flyer) {
//         return {
//             title: 'Flyer Not Found',
//             description: 'The requested flyer could not be found.'
//         }
//     }

//     // Safely extract data from either extractedData or editableFields
//     const extractedData = flyer.extractedData as Record<string, any> || {};
//     const editableFields = flyer.editableFields as Record<string, any> || {};

//     const title = editableFields.title || extractedData['Title/Headline'] || extractedData.title || flyer.title || 'Flyer';
//     const description = editableFields.description || extractedData['Description/Details'] || extractedData.description || 'View this flyer';

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
//     const { shortUrl } = params;
//     const flyer = await getFlyerByShortUrl(shortUrl);
    
//     if (!flyer || !flyer.template) {
//         notFound();
//     }

//     // Prepare data from both extractedData and editableFields
//     const extractedData = flyer.extractedData as Record<string, any> || {};
//     const editableFields = flyer.editableFields as Record<string, any> || {};

//     // Replace placeholders in template
//     let html = flyer.template.htmlContent;
//     const css = flyer.template.cssContent;
//     const js = flyer.template.jsContent || '';

//     // Default values structure
//     const defaultValues = {
//         title: 'Event Title',
//         description: 'Event description goes here...',
//         date: 'Date TBA',
//         time: 'Time TBA',
//         location: 'Location TBA',
//         address: 'abc street, city, state, zip',
//         phone: '03000000000',
//         email: 'example@example.com',   
//         website: 'www.example.com',
//         buttonText: 'Learn More',
//         buttonUrl: '#',
//         qrCode: flyer.qrCodePath ? `<img src="${flyer.qrCodePath}" alt="QR Code" class="qr-code" />` : ''
//     };

//     // Mapping of field names between extractedData and template placeholders
//     const fieldMappings = {
//         title: [
//             editableFields.title,
//             extractedData['Title/Headline'],
//             extractedData.title,
//             flyer.title
//         ],
//         description: [
//             editableFields.description,
//             extractedData['Description/Details'],
//             extractedData.description
//         ],
//         date: [
//             editableFields.date,
//             extractedData['Date and Time'],
//             extractedData.date
//         ],
//         time: [
//             editableFields.time,
//             extractedData['Date and Time'],
//             extractedData.time
//         ],
//         location: [
//             editableFields.location,
//             extractedData['Location/Address'],
//             extractedData.location
//         ],
//         address: [
//             editableFields.address,
//             extractedData['Location/Address'],
//             extractedData.address
//         ],
//         phone: [
//             editableFields.phone,
//             extractedData['Contact information (email, phone, website)'],
//             extractedData.phone
//         ],
//         email: [
//             editableFields.email,
//             extractedData['Contact information (email, phone, website)'],
//             extractedData.email
//         ],
//         website: [
//             editableFields.website,
//             extractedData['Contact information (email, phone, website)'],
//             extractedData.website
//         ],
//         buttonText: [
//             editableFields.buttonText,
//             extractedData['Call-to-action buttons or instructions'],
//             'Learn More'
//         ],
//         buttonUrl: [
//             editableFields.buttonUrl,
//             '#'
//         ]
//     };

//     // Get the first non-empty value for each field
//     const values = Object.fromEntries(
//         Object.entries(fieldMappings).map(([key, sources]) => {
//             const value = sources.find(val => val !== undefined && val !== null && val !== '');
//             return [key, value || defaultValues[key]];
//         })
//     );

//     // Replace all placeholders in the HTML
//     Object.entries(values).forEach(([key, value]) => {
//         html = html.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
//     });

//     return (
//         <html lang="en">
//             <head>
//                 <meta charSet="UTF-8" />
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//                 <title>{values.title}</title>
//                 <style dangerouslySetInnerHTML={{
//                     __html: `
//                         ${css}
//                         body { 
//                             margin: 0; 
//                             padding: 0; 
//                             // font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                          
//                         }
//                         .flyer-container {
//                             width: 100%;
//                             max-width: auto;
//                             margin: 1rem;
//                             background: white;
//                             border-radius: 8px;
//                             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//                             overflow: hidden;
//                         }
//                         .powered-by {
//                             text-align: center;
//                             margin-top: 1rem;
//                             padding: 0.5rem;
//                             font-size: 0.75rem;
//                             color: #666;
//                             background: rgba(255,255,255,0.8);
//                             border-radius: 4px;
//                         }
//                         .powered-by a {
//                             color: #3b82f6;
//                             text-decoration: none;
//                         }
//                         .powered-by a:hover {
//                             text-decoration: underline;
//                         }
//                         .qr-code {
//                             display: block;
//                             margin: 1rem auto;
//                             max-width: 150px;
//                             height: auto;
//                         }
//                     `
//                 }} />
//             </head>
//             <body>
//                 <div className="flyer-container">
//                     <div dangerouslySetInnerHTML={{ __html: html }} />
//                     <div className="powered-by">
//                         Powered by <a href={process.env.NEXTAUTH_URL} target="_blank" rel="noopener noreferrer">InteractMe</a>
//                     </div>
//                 </div>
//                 {js && (
//                     <script dangerouslySetInnerHTML={{ __html: js }} />
//                 )}
//             </body>
//         </html>
//     )
// }

import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import QRCode from 'qrcode'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

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

        if (!flyer) return null;

        // Generate and save QR code if it doesn't exist
        if (!flyer.qrCodePath && flyer.generatedUrl) {
            const qrCodeDataUrl = await generateQRCodeDataUrl(flyer.generatedUrl);
            if (qrCodeDataUrl) {
                await prisma.flyer.update({
                    where: { id: flyer.id },
                    data: {
                        qrCodePath: qrCodeDataUrl,
                        viewCount: { increment: 1 }
                    }
                });
                return {
                    ...flyer,
                    qrCodePath: qrCodeDataUrl,
                    viewCount: flyer.viewCount + 1
                };
            }
        } else {
            // Increment view count
            await prisma.flyer.update({
                where: { id: flyer.id },
                data: { viewCount: { increment: 1 } }
            });
        }

        return {
            ...flyer,
            viewCount: flyer.viewCount + 1
        };
    } catch (error) {
        console.error('Error fetching flyer:', error);
        return null;
    }
}

interface PageProps {
    params: {
        shortUrl: string
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { shortUrl } = params;
    const flyer = await getFlyerByShortUrl(shortUrl);

    if (!flyer) {
        return {
            title: 'Flyer Not Found',
            description: 'The requested flyer could not be found.'
        }
    }

    // Safely extract data from either extractedData or editableFields
    const extractedData = flyer.extractedData as Record<string, any> || {};
    const editableFields = flyer.editableFields as Record<string, any> || {};

    const title = editableFields.title || extractedData['Title/Headline'] || extractedData.title || flyer.title || 'Flyer';
    const description = editableFields.description || extractedData['Description/Details'] || extractedData.description || 'View this flyer';

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
    const { shortUrl } = params;
    const flyer = await getFlyerByShortUrl(shortUrl);
    
    if (!flyer || !flyer.template) {
        notFound();
    }

    // Prepare data from both extractedData and editableFields
    const extractedData = flyer.extractedData as Record<string, any> || {};
    const editableFields = flyer.editableFields as Record<string, any> || {};

    // Replace placeholders in template
    let html = flyer.template.htmlContent;
    const css = flyer.template.cssContent;
    const js = flyer.template.jsContent || '';

    // Default values structure
    const defaultValues = {
        title: 'Event Title',
        description: 'Event description goes here...',
        date: 'Date TBA',
        time: 'Time TBA',
        location: 'Location TBA',
        address: 'abc street, city, state, zip',
        phone: '03000000000',
        email: 'example@example.com',   
        website: 'www.example.com',
        buttonText: 'Learn More',
        buttonUrl: '#',
        qrCode: flyer.qrCodePath ? `<img src="${flyer.qrCodePath}" alt="QR Code" class="flyer-qr-code" />` : ''
    };

    // Mapping of field names between extractedData and template placeholders
    const fieldMappings = {
        title: [
            editableFields.title,
            extractedData['Title/Headline'],
            extractedData.title,
            flyer.title
        ],
        description: [
            editableFields.description,
            extractedData['Description/Details'],
            extractedData.description
        ],
        date: [
            editableFields.date,
            extractedData['Date and Time'],
            extractedData.date
        ],
        time: [
            editableFields.time,
            extractedData['Date and Time'],
            extractedData.time
        ],
        location: [
            editableFields.location,
            extractedData['Location/Address'],
            extractedData.location
        ],
        address: [
            editableFields.address,
            extractedData['Location/Address'],
            extractedData.address
        ],
        phone: [
            editableFields.phone,
            extractedData['Contact information (email, phone, website)'],
            extractedData.phone
        ],
        email: [
            editableFields.email,
            extractedData['Contact information (email, phone, website)'],
            extractedData.email
        ],
        website: [
            editableFields.website,
            extractedData['Contact information (email, phone, website)'],
            extractedData.website
        ],
        buttonText: [
            editableFields.buttonText,
            extractedData['Call-to-action buttons or instructions'],
            'Learn More'
        ],
        buttonUrl: [
            editableFields.buttonUrl,
            '#'
        ]
    };

    // Get the first non-empty value for each field
    const values = Object.fromEntries(
        Object.entries(fieldMappings).map(([key, sources]) => {
            const value = sources.find(val => val !== undefined && val !== null && val !== '');
            return [key, value || defaultValues[key]];
        })
    );

    // Replace all placeholders in the HTML
    Object.entries(values).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value as string);
    });

    const modernStyles = `
    

        html, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        body {
            justify-content: center;
            padding: 10px;
            position: relative;
        }

        body::before {
            content: '';
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
                radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
            pointer-events: none;
        }

        .flyer-wrapper {
            max-width: 800px;
            position: relative;
            z-index: 1;
            margin: 0 auto;
        }

        .flyer-container {
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 
                0 32px 64px rgba(0, 0, 0, 0.15),
                0 16px 32px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flyer-container:hover {
            transform: translateY(-8px);
            box-shadow: 
                0 48px 80px rgba(0, 0, 0, 0.2),
                0 24px 48px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.9);
        }

        .flyer-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
            background-size: 300% 100%;
            animation: gradientShift 6s ease infinite;
        }

        @keyframes gradientShift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .flyer-content {
            padding: 40px;
            position: relative;
        }

        .flyer-content h1 {
            font-size: 2.5rem;
            font-weight: 800;
background: linear-gradient(135deg, #00ff00 0%, #00ffff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 16px;
            line-height: 1.2;
        }

        .flyer-content h2 {
            font-size: 2rem;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 12px;
            line-height: 1.3;
        }

        .flyer-content h3 {
            font-size: 1.5rem;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 10px;
            line-height: 1.4;
        }

        .flyer-content p {
            font-size: 1.1rem;
            color: #4a5568;
            margin-bottom: 16px;
            line-height: 1.7;
        }

        .flyer-content a {
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            position: relative;
        }

        .flyer-content a:hover {
            color: #764ba2;
            text-decoration: underline;
        }

        .flyer-content button,
        .flyer-content .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 50px;
            font-size: 1.1rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
            position: relative;
            overflow: hidden;
        }

        .flyer-content button::before,
        .flyer-content .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .flyer-content button:hover::before,
        .flyer-content .btn:hover::before {
            left: 100%;
        }

        .flyer-content button:hover,
        .flyer-content .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 32px rgba(102, 126, 234, 0.4);
        }

        .flyer-content button:active,
        .flyer-content .btn:active {
            transform: translateY(0);
        }

        .flyer-qr-code {
            display: block;
            margin: 32px auto;
            max-width: 180px;
            height: auto;
            border-radius: 16px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            background: white;
            padding: 16px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flyer-qr-code:hover {
            transform: scale(1.05) rotate(2deg);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .powered-by {
            text-align: center;
            padding: 24px 40px;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
            border-top: 1px solid rgba(102, 126, 234, 0.1);
            font-size: 0.9rem;
            color: #718096;
            position: relative;
        }

        .powered-by::before {
            content: '';
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #667eea, transparent);
        }

        .powered-by a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
        }

        .powered-by a:hover {
            color: #764ba2;
        }

        .powered-by a::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }

        .powered-by a:hover::after {
            width: 100%;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          

            .flyer-content {
                padding: 32px 24px;
            }

            .flyer-content h1 {
                font-size: 2rem;
            }

            .flyer-content h2 {
                font-size: 1.75rem;
            }

            .flyer-content h3 {
                font-size: 1.25rem;
            }

            .flyer-content p {
                font-size: 1rem;
            }

            .flyer-content button,
            .flyer-content .btn {
                padding: 14px 28px;
                font-size: 1rem;
            }

            .flyer-qr-code {
                max-width: 150px;
                margin: 24px auto;
                padding: 12px;
            }

            .powered-by {
                padding: 20px 24px;
                font-size: 0.85rem;
            }
        }

        @media (max-width: 480px) {
        
            .flyer-container {
                border-radius: 20px;
            }

            .flyer-content {
                padding: 24px 20px;
            }

            .flyer-content h1 {
                font-size: 1.75rem;
            }

            .flyer-content h2 {
                font-size: 1.5rem;
            }

            .flyer-content h3 {
                font-size: 1.125rem;
            }

            .flyer-content p {
                font-size: 0.95rem;
            }

            .flyer-content button,
            .flyer-content .btn {
                padding: 12px 24px;
                font-size: 0.95rem;
                border-radius: 40px;
            }

            .flyer-qr-code {
                max-width: 120px;
                margin: 20px auto;
                padding: 10px;
                border-radius: 12px;
            }

            .powered-by {
                padding: 16px 20px;
                font-size: 0.8rem;
            }
        }

        /* Animation for page load */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .flyer-container {
            animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced focus states for accessibility */
        .flyer-content button:focus,
        .flyer-content .btn:focus,
        .flyer-content a:focus {
            outline: 3px solid rgba(102, 126, 234, 0.5);
            outline-offset: 2px;
        }

        /* Print styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }

            body::before {
                display: none;
            }

            .flyer-container {
                box-shadow: none;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                max-width: 100%;
            }

            .flyer-container::before {
                display: none;
            }

            .powered-by {
                display: none;
            }

            .flyer-content button,
            .flyer-content .btn {
                background: #667eea !important;
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
   
            .flyer-container {
            margin-top: 20px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .flyer-content h2,
            .flyer-content h3 {
                color: #e2e8f0;
            }

           

            .powered-by {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
                color: #a0aec0;
            }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            .flyer-container:hover {
                transform: none;
            }

            .flyer-qr-code:hover {
                transform: none;
            }
        }
    `;

    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="color-scheme" content="light dark" />
                <title>{values.title}</title>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        ${modernStyles}
                        ${css}
                    `
                }} />
            </head>
            <body>
                <div className="flyer-wrapper">
                    <div className="flyer-container">
                        <div className="flyer-content">
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                        </div>
                        <div className="powered-by">
                            Powered by <a href={process.env.NEXTAUTH_URL} target="_blank" rel="noopener noreferrer">InteractMe</a>
                        </div>
                    </div>
                </div>
                {js && (
                    <script dangerouslySetInnerHTML={{ __html: js }} />
                )}
            </body>
        </html>
    )
}