module.exports = {

"[project]/.next-internal/server/app/f/[shortUrl]/page/actions.js [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/fs [external] (fs, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[project]/src/app/f/[shortUrl]/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

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
__turbopack_context__.s({
    "default": ()=>PublicFlyerPage,
    "generateMetadata": ()=>generateMetadata
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/qrcode/lib/index.js [app-rsc] (ecmascript)");
;
;
;
;
async function generateQRCodeDataUrl(url) {
    try {
        return await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$qrcode$2f$lib$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].toDataURL(url, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
    } catch (error) {
        console.error('Error generating QR code:', error);
        return '';
    }
}
async function getFlyerByShortUrl(shortUrl) {
    try {
        const flyer = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].flyer.findFirst({
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
        });
        if (flyer) {
            // Generate and save QR code if it doesn't exist and we have a generatedUrl
            if (!flyer.qrCodePath && flyer.generatedUrl) {
                console.log('Generating QR code for:', flyer.generatedUrl);
                const qrCodeDataUrl = await generateQRCodeDataUrl(flyer.generatedUrl);
                if (qrCodeDataUrl) {
                    console.log('Generated QR code, saving to database...');
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].flyer.update({
                        where: {
                            id: flyer.id
                        },
                        data: {
                            qrCodePath: qrCodeDataUrl,
                            viewCount: {
                                increment: 1
                            }
                        }
                    });
                    // Return updated flyer with QR code
                    return await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].flyer.findFirst({
                        where: {
                            id: flyer.id
                        },
                        include: {
                            template: true,
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    });
                }
            } else {
                // Just increment view count if QR code already exists
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["prisma"].flyer.update({
                    where: {
                        id: flyer.id
                    },
                    data: {
                        viewCount: {
                            increment: 1
                        }
                    }
                });
            }
        }
        return flyer;
    } catch (error) {
        console.error('Error fetching flyer:', error);
        return null;
    }
}
async function generateMetadata({ params }) {
    const flyer = await getFlyerByShortUrl(params.shortUrl);
    if (!flyer) {
        return {
            title: 'Flyer Not Found',
            description: 'The requested flyer could not be found.'
        };
    }
    const extractedData = flyer.extractedData;
    const editableFields = flyer.editableFields;
    const title = editableFields?.title || extractedData?.title || flyer.title || 'Flyer';
    const description = editableFields?.description || extractedData?.description || 'View this flyer';
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description
        }
    };
}
async function PublicFlyerPage({ params }) {
    const flyer = await getFlyerByShortUrl(params.shortUrl);
    console.log("flyer", flyer);
    if (!flyer || !flyer.template) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    }
    // Prepare the data for rendering
    const extractedData = flyer.extractedData;
    const editableFields = flyer.editableFields || {};
    // Replace placeholders in template
    let html = flyer.template.htmlContent;
    const css = flyer.template.cssContent;
    const js = flyer.template.jsContent || '';
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
    };
    // Replace placeholders
    Object.entries(placeholders).forEach(([placeholder, value])=>{
        html = html.replace(new RegExp(placeholder, 'g'), value);
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("html", {
        lang: "en",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("head", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        charSet: "UTF-8"
                    }, void 0, false, {
                        fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                        lineNumber: 334,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1.0"
                    }, void 0, false, {
                        fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                        lineNumber: 335,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                        dangerouslySetInnerHTML: {
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
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                        lineNumber: 336,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                lineNumber: 333,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("body", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flyer-container",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                dangerouslySetInnerHTML: {
                                    __html: html
                                }
                            }, void 0, false, {
                                fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                                lineNumber: 381,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "powered-by",
                                children: [
                                    "Powered by ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: process.env.NEXTAUTH_URL,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        children: "InteractMe"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                                        lineNumber: 383,
                                        columnNumber: 36
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                                lineNumber: 382,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                        lineNumber: 380,
                        columnNumber: 17
                    }, this),
                    js && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                        dangerouslySetInnerHTML: {
                            __html: js
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                        lineNumber: 387,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
                lineNumber: 379,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/f/[shortUrl]/page.tsx",
        lineNumber: 332,
        columnNumber: 9
    }, this);
}
}),
"[project]/src/app/f/[shortUrl]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)": ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/f/[shortUrl]/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__efcc97b4._.js.map