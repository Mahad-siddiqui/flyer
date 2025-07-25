'use client'

import { signIn, useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Chrome, Loader2, ArrowLeft, Zap, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isCredentialsLoading, setIsCredentialsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session, status } = useSession()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
    const error = searchParams.get('error')

    useEffect(() => {
        // Check if user is already signed in and redirect
        if (status === 'authenticated' && session) {
            router.push(callbackUrl)
        }
    }, [status, session, router, callbackUrl])

    useEffect(() => {
        // Handle authentication errors
        if (error) {
            switch (error) {
                case 'OAuthSignin':
                    toast.error('Error occurred during sign in. Please try again.')
                    break
                case 'OAuthCallback':
                    toast.error('Error occurred during authentication. Please try again.')
                    break
                case 'OAuthCreateAccount':
                    toast.error('Could not create account. Please try again.')
                    break
                case 'EmailCreateAccount':
                    toast.error('Could not create account. Please try again.')
                    break
                case 'Callback':
                    toast.error('Authentication callback error. Please try again.')
                    break
                case 'OAuthAccountNotLinked':
                    toast.error('Account not linked. Please sign in with the same provider you used originally.')
                    break
                case 'EmailSignin':
                    toast.error('Email sign in error. Please try again.')
                    break
                case 'CredentialsSignin':
                    toast.error('Invalid credentials. Please check your email and password.')
                    break
                case 'SessionRequired':
                    toast.error('You need to be signed in to access this page.')
                    break
                default:
                    toast.error('An unexpected error occurred. Please try again.')
            }
        }
    }, [error])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true)
            const result = await signIn('google', {
                callbackUrl,
                redirect: true, // Let NextAuth handle the redirect
            })
        } catch (error) {
            console.error('Sign in error:', error)
            toast.error('An unexpected error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCredentialsSignIn = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            toast.error('Please fill in all fields')
            return
        }

        try {
            setIsCredentialsLoading(true)
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                callbackUrl,
                redirect: true, // Let NextAuth handle the redirect
            })
        } catch (error) {
            console.error('Sign in error:', error)
            toast.error('An unexpected error occurred. Please try again.')
        } finally {
            setIsCredentialsLoading(false)
        }
    }

    // Show loading state while checking session
    if (status === 'loading') {
        return (
            <div className="container relative min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    // If already authenticated, don't show the form
    if (status === 'authenticated') {
        return (
            <div className="container relative min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg mb-4">Redirecting to dashboard...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left side - Branding */}
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 gradient-hero" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 mr-3">
                        <Zap className="h-4 w-4" />
                    </div>
                    FlyerWeb
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "FlyerWeb transformed how we share event information. Our QR codes get 3x more engagement than traditional flyers."
                        </p>
                        <footer className="text-sm opacity-80">Sarah Johnson, Event Coordinator</footer>
                    </blockquote>
                </div>
            </div>

            {/* Right side - Sign in form */}
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">Back to home</span>
                        </Link>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Sign in to FlyerWeb</CardTitle>
                            <CardDescription className="text-center">
                                Choose your preferred sign in method
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={isCredentialsLoading}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            disabled={isCredentialsLoading}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                            disabled={isCredentialsLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isCredentialsLoading}
                                >
                                    {isCredentialsLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign in'
                                    )}
                                </Button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Chrome className="mr-2 h-4 w-4" />
                                )}
                                Continue with Google
                            </Button>

                            <div className="text-center text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="px-8 text-center text-sm text-muted-foreground">
                        By continuing, you agree to our{' '}
                        <Link
                            href="/terms"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link
                            href="/privacy"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </div>
                </div>
            </div>
        </div>
    )
}