// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { Loader2, ArrowLeft, Zap, Eye, EyeOff } from 'lucide-react'
// import Link from 'next/link'

// export default function RegisterPage() {
//     const [isLoading, setIsLoading] = useState(false)
//     const [showPassword, setShowPassword] = useState(false)
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         confirmPassword: ''
//     })
//     const router = useRouter()

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target
//         setFormData(prev => ({ ...prev, [name]: value }))
//     }

//     const validateForm = () => {
//         if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//             toast.error('All fields are required')
//             return false
//         }

//         if (formData.password.length < 8) {
//             toast.error('Password must be at least 8 characters long')
//             return false
//         }

//         if (formData.password !== formData.confirmPassword) {
//             toast.error('Passwords do not match')
//             return false
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//         if (!emailRegex.test(formData.email)) {
//             toast.error('Please enter a valid email address')
//             return false
//         }

//         return true
//     }

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault()
        
//         if (!validateForm()) return

//         setIsLoading(true)
        
//         try {
//             const response = await fetch('/api/auth/register', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: formData.name,
//                     email: formData.email,
//                     password: formData.password,
//                 }),
//             })

//             const data = await response.json()

//             if (!response.ok) {
//                 throw new Error(data.error || 'Registration failed')
//             }

//             toast.success('Account created successfully! Please sign in.')
//             router.push('/auth/signin')
//         } catch (error) {
//             console.error('Registration error:', error)
//             toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     return (
//         <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
//             {/* Left side - Branding */}
//             <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
//                 <div className="absolute inset-0 gradient-hero" />
//                 <div className="relative z-20 flex items-center text-lg font-medium">
//                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 mr-3">
//                         <Zap className="h-4 w-4" />
//                     </div>
//                     FlyerWeb
//                 </div>
//                 <div className="relative z-20 mt-auto">
//                     <blockquote className="space-y-2">
//                         <p className="text-lg">
//                             "Join thousands of users who trust FlyerWeb for their digital flyer needs."
//                         </p>
//                         <footer className="text-sm opacity-80">Start your free account today</footer>
//                     </blockquote>
//                 </div>
//             </div>

//             {/* Right side - Registration form */}
//             <div className="lg:p-8">
//                 <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//                     <div className="flex flex-col space-y-2 text-center">
//                         <Link href="/auth/signin" className="flex items-center justify-center gap-2 mb-6">
//                             <ArrowLeft className="h-4 w-4" />
//                             <span className="text-sm text-muted-foreground">Back to sign in</span>
//                         </Link>

//                         <h1 className="text-2xl font-semibold tracking-tight">
//                             Create your account
//                         </h1>
//                         <p className="text-sm text-muted-foreground">
//                             Enter your details to create your FlyerWeb account
//                         </p>
//                     </div>

//                     <Card>
//                         <CardHeader>
//                             <CardTitle className="text-center">Sign up for FlyerWeb</CardTitle>
//                             <CardDescription className="text-center">
//                                 Create your account and start building amazing flyers
//                             </CardDescription>
//                         </CardHeader>
//                         <CardContent>
//                             <form onSubmit={handleSubmit} className="space-y-4">
//                                 <div className="space-y-2">
//                                     <Label htmlFor="name">Full Name</Label>
//                                     <Input
//                                         id="name"
//                                         name="name"
//                                         type="text"
//                                         placeholder="Enter your full name"
//                                         value={formData.name}
//                                         onChange={handleInputChange}
//                                         disabled={isLoading}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="email">Email</Label>
//                                     <Input
//                                         id="email"
//                                         name="email"
//                                         type="email"
//                                         placeholder="Enter your email"
//                                         value={formData.email}
//                                         onChange={handleInputChange}
//                                         disabled={isLoading}
//                                         required
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="password">Password</Label>
//                                     <div className="relative">
//                                         <Input
//                                             id="password"
//                                             name="password"
//                                             type={showPassword ? "text" : "password"}
//                                             placeholder="Create a password"
//                                             value={formData.password}
//                                             onChange={handleInputChange}
//                                             disabled={isLoading}
//                                             required
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                                             onClick={() => setShowPassword(!showPassword)}
//                                             disabled={isLoading}
//                                         >
//                                             {showPassword ? (
//                                                 <EyeOff className="h-4 w-4" />
//                                             ) : (
//                                                 <Eye className="h-4 w-4" />
//                                             )}
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label htmlFor="confirmPassword">Confirm Password</Label>
//                                     <div className="relative">
//                                         <Input
//                                             id="confirmPassword"
//                                             name="confirmPassword"
//                                             type={showConfirmPassword ? "text" : "password"}
//                                             placeholder="Confirm your password"
//                                             value={formData.confirmPassword}
//                                             onChange={handleInputChange}
//                                             disabled={isLoading}
//                                             required
//                                         />
//                                         <Button
//                                             type="button"
//                                             variant="ghost"
//                                             size="sm"
//                                             className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                                             onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                             disabled={isLoading}
//                                         >
//                                             {showConfirmPassword ? (
//                                                 <EyeOff className="h-4 w-4" />
//                                             ) : (
//                                                 <Eye className="h-4 w-4" />
//                                             )}
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 <Button
//                                     type="submit"
//                                     className="w-full"
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? (
//                                         <>
//                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                             Creating account...
//                                         </>
//                                     ) : (
//                                         'Create account'
//                                     )}
//                                 </Button>
//                             </form>

//                             <div className="mt-4 text-center text-sm text-muted-foreground">
//                                 Already have an account?{' '}
//                                 <Link
//                                     href="/auth/signin"
//                                     className="underline underline-offset-4 hover:text-primary"
//                                 >
//                                     Sign in
//                                 </Link>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <div className="px-8 text-center text-sm text-muted-foreground">
//                         By creating an account, you agree to our{' '}
//                         <Link
//                             href="/terms"
//                             className="underline underline-offset-4 hover:text-primary"
//                         >
//                             Terms of Service
//                         </Link>{' '}
//                         and{' '}
//                         <Link
//                             href="/privacy"
//                             className="underline underline-offset-4 hover:text-primary"
//                         >
//                             Privacy Policy
//                         </Link>
//                         .
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Zap, Eye, EyeOff, Rocket, Check, Sparkles, LayoutTemplate } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Typewriter } from 'react-simple-typewriter'

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const router = useRouter()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error('All fields are required')
            return false
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long')
            return false
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match')
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address')
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) return

        setIsLoading(true)
        
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            }

            toast.success('Account created successfully! Please sign in.')
            router.push('/auth/signin')
        } catch (error) {
            console.error('Registration error:', error)
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* Left side - Branding with animations */}
            <div className="relative hidden h-full flex-col bg-gradient-to-br from-purple-700 to-indigo-700 p-40 dark:border-r lg:flex">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 bg-[url('/images/auth-pattern.svg')] bg-cover"
                />
                
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-20 flex items-center text-lg font-medium"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 mr-3">
                        <Zap className="h-4 w-4" />
                    </div>
                    InteractMe
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="relative z-20 mt-auto"
                >
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            <Typewriter
                                words={[
                                    '"Join thousands of users who trust InteractMe"',
                                    '"Create stunning digital flyers in minutes"',
                                    '"The easiest way to share your events"',
                                    '"Professional results with no design skills needed"'
                                ]}
                                loop={true}
                                cursor
                                cursorStyle="|"
                                typeSpeed={70}
                                deleteSpeed={50}
                                delaySpeed={2000}
                            />
                        </p>
                        <footer className="text-sm opacity-80">Start your free account today</footer>
                    </blockquote>
                </motion.div>

                {/* Feature highlights with animations */}
                <motion.div 
                    className="relative z-20 mt-16 space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <motion.div 
                        className="flex items-start space-x-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="bg-white/20 p-2 rounded-lg">
                            <LayoutTemplate className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium">Beautiful Templates</h3>
                            <p className="text-sm opacity-80">Professional designs for any occasion</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="flex items-start space-x-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Rocket className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium">Easy Sharing</h3>
                            <p className="text-sm opacity-80">Share with QR codes or direct links</p>
                        </div>
                    </motion.div>

                    <motion.div 
                        className="flex items-start space-x-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-medium">Instant Results</h3>
                            <p className="text-sm opacity-80">Create your first flyer in under 5 minutes</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Right side - Registration form */}
            <div className="lg:p-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
                >
                    <motion.div 
                        whileHover={{ x: -5 }}
                        className="flex flex-col space-y-2 text-center"
                    >
                        <Link href="/auth/signin" className="flex items-center justify-center gap-2 mb-6">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">Back to sign in</span>
                        </Link>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create your account
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your details to create your InteractMe account
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-center">Sign up for InteractMe</CardTitle>
                                <CardDescription className="text-center">
                                    Create your account and start building amazing InteractMe experiences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <motion.div 
                                        className="space-y-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </motion.div>

                                    <motion.div 
                                        className="space-y-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                            required
                                        />
                                    </motion.div>

                                    <motion.div 
                                        className="space-y-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Create a password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                disabled={isLoading}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            <p className="flex items-center gap-1"><Check className="h-3 w-3" /> At least 8 characters</p>
                                        </div>
                                    </motion.div>

                                    <motion.div 
                                        className="space-y-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                disabled={isLoading}
                                                required
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                disabled={isLoading}
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Creating account...
                                                </>
                                            ) : (
                                                'Create account'
                                            )}
                                        </Button>
                                    </motion.div>
                                </form>

                                <motion.div 
                                    className="mt-4 text-center text-sm text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    Already have an account?{' '}
                                    <Link
                                        href="/auth/signin"
                                        className="underline underline-offset-4 hover:text-primary"
                                    >
                                        Sign in
                                    </Link>
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        className="px-8 text-center text-sm text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9 }}
                    >
                        By creating an account, you agree to our{' '}
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
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}