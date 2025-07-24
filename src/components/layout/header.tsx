'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    User,
    Settings,
    LogOut,
    CreditCard,
    FileText,
    Zap
} from 'lucide-react'

export function Header() {
    const { data: session, status } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Zap className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-gradient">InteractMe</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/features"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Features
                        </Link>
                        <Link
                            href="/pricing"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/templates"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Templates
                        </Link>
                        <Link
                            href="/about"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            About
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center space-x-4">
                    <ThemeToggle />

                    {status === 'loading' ? (
                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                    ) : session ? (
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">
                                    Dashboard
                                </Button>
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                                            <AvatarFallback>
                                                {session.user?.name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <div className="flex items-center justify-start gap-2 p-2">
                                        <div className="flex flex-col space-y-1 leading-none">
                                            {session.user?.name && (
                                                <p className="font-medium">{session.user.name}</p>
                                            )}
                                            {session.user?.email && (
                                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                                    {session.user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            <FileText className="mr-2 h-4 w-4" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/billing">
                                            <CreditCard className="mr-2 h-4 w-4" />
                                            Billing
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="cursor-pointer"
                                        onSelect={() => signOut()}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link href="/auth/signin">
                                <Button variant="ghost" size="sm">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/auth/signin">
                                <Button variant="default" size="sm">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}