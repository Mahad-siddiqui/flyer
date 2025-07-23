"use client";

import { Header } from '@/components/layout/header';
import { ThemeProvider } from '@/components/theme-provider'
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { Toaster } from 'sonner';

function ClientLayout({ session, children }: { session: Session | null; children: React.ReactNode }) {
    return (
        <SessionProvider session={session}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <div className="relative flex min-h-screen flex-col">
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <footer className="border-t">
                        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                            <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                                    Built with ❤️ by FlyerWeb Team. The source code is available on{' '}
                                    <a
                                        href="https://github.com/flyerweb"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="font-medium underline underline-offset-4"
                                    >
                                        GitHub
                                    </a>
                                    .
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <a
                                    href="/privacy"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Privacy
                                </a>
                                <a
                                    href="/terms"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Terms
                                </a>
                                <a
                                    href="/contact"
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    Contact
                                </a>
                            </div>
                        </div>
                    </footer>
                </div>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: 'hsl(var(--background))',
                            color: 'hsl(var(--foreground))',
                            border: '1px solid hsl(var(--border))',
                        },
                    }}
                />
            </ThemeProvider>
        </SessionProvider>
    )
}

export default ClientLayout
