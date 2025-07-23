'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import {
    Check,
    X,
    Zap,
    Star,
    Crown,
    Loader2,
    ArrowRight
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { plans } from '@/lib/stripe'

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false)
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
    const { data: session } = useSession()
    const router = useRouter()

    const handleSubscribe = async (planId: string) => {
        if (!session) {
            router.push('/auth/signin?callbackUrl=/pricing')
            return
        }

        try {
            setLoadingPlan(planId)

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: planId,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create checkout session')
            }

            const { url } = await response.json()
            if (url) {
                window.location.href = url
            }
        } catch (error) {
            console.error('Subscription error:', error)
            toast.error('Failed to start subscription. Please try again.')
        } finally {
            setLoadingPlan(null)
        }
    }

    const getPlanIcon = (planName: string) => {
        switch (planName) {
            case 'Free':
                return <Zap className="h-5 w-5" />
            case 'Pro':
                return <Star className="h-5 w-5" />
            case 'Enterprise':
                return <Crown className="h-5 w-5" />
            default:
                return <Zap className="h-5 w-5" />
        }
    }

    const getYearlyPrice = (monthlyPrice: number) => {
        return monthlyPrice * 12 * 0.8 // 20% discount for yearly
    }

    return (
        <div className="container py-20 px-4 mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Choose Your Plan
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Start for free, then scale as you grow. All plans include our core features.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <Label htmlFor="billing-toggle" className="text-sm font-medium">
                        Monthly
                    </Label>
                    <Switch
                        id="billing-toggle"
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                    />
                    <Label htmlFor="billing-toggle" className="text-sm font-medium">
                        Yearly
                    </Label>
                    <Badge variant="secondary" className="ml-2">
                        Save 20%
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => {
                    const isPopular = plan.name === 'Pro'
                    const price = isYearly && plan.price > 0 ? getYearlyPrice(plan.price) : plan.price
                    const billingPeriod = isYearly ? 'year' : 'month'

                    return (
                        <Card
                            key={plan.name}
                            className={`pricing-card relative ${isPopular ? 'featured' : ''}`}
                        >
                            {isPopular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <Badge className="bg-primary text-primary-foreground">
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {getPlanIcon(plan.name)}
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                </div>
                                <CardDescription className="text-sm">
                                    {plan.description}
                                </CardDescription>
                                <div className="mt-4">
                                    <div className="text-3xl font-bold">
                                        {formatPrice(price)}
                                        <span className="text-sm font-normal text-muted-foreground">
                                            /{billingPeriod}
                                        </span>
                                    </div>
                                    {isYearly && plan.price > 0 && (
                                        <div className="text-sm text-muted-foreground line-through">
                                            {formatPrice(plan.price * 12)}/year
                                        </div>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <Button
                                    className="w-full"
                                    variant={isPopular ? "default" : "outline"}
                                    onClick={() => handleSubscribe(plan.stripePriceId)}
                                    disabled={loadingPlan === plan.stripePriceId}
                                >
                                    {loadingPlan === plan.stripePriceId ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            {plan.name === 'Free' ? 'Get Started' : 'Subscribe'}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>

                                <div className="space-y-3">
                                    <div className="text-sm font-medium">What's included:</div>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="pt-4 border-t">
                                    <div className="flex justify-between items-center text-sm">
                                        <span>Flyers per month:</span>
                                        <span className="font-medium">
                                            {plan.flyerLimit === -1 ? 'Unlimited' : plan.flyerLimit}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm mt-2">
                                        <span>Template access:</span>
                                        <span className="font-medium">
                                            {plan.templateAccess.premium ? 'All' : 'Basic'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Feature Comparison */}
            <div className="mt-20">
                <h2 className="text-2xl font-bold text-center mb-8">
                    Feature Comparison
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border rounded-lg">
                        <thead>
                            <tr className="bg-muted/50">
                                <th className="border border-border p-4 text-left">Feature</th>
                                <th className="border border-border p-4 text-center">Free</th>
                                <th className="border border-border p-4 text-center">Pro</th>
                                <th className="border border-border p-4 text-center">Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border border-border p-4 font-medium">Flyers per month</td>
                                <td className="border border-border p-4 text-center">5</td>
                                <td className="border border-border p-4 text-center">50</td>
                                <td className="border border-border p-4 text-center">Unlimited</td>
                            </tr>
                            <tr>
                                <td className="border border-border p-4 font-medium">Template library</td>
                                <td className="border border-border p-4 text-center">Basic</td>
                                <td className="border border-border p-4 text-center">All</td>
                                <td className="border border-border p-4 text-center">All + Custom</td>
                            </tr>
                            <tr>
                                <td className="border border-border p-4 font-medium">QR code customization</td>
                                <td className="border border-border p-4 text-center">
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">
                                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">
                                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-border p-4 font-medium">Analytics dashboard</td>
                                <td className="border border-border p-4 text-center">
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">
                                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">Advanced</td>
                            </tr>
                            <tr>
                                <td className="border border-border p-4 font-medium">Custom domains</td>
                                <td className="border border-border p-4 text-center">
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">
                                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-border p-4 font-medium">API access</td>
                                <td className="border border-border p-4 text-center">
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">
                                    <X className="h-4 w-4 text-red-500 mx-auto" />
                                </td>
                                <td className="border border-border p-4 text-center">
                                    <Check className="h-4 w-4 text-green-500 mx-auto" />
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-border p-4 font-medium">Priority support</td>
                                <td className="border border-border p-4 text-center">Email</td>
                                <td className="border border-border p-4 text-center">Email + Chat</td>
                                <td className="border border-border p-4 text-center">Phone + Dedicated</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-20 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground mb-8">
                    Have questions? We're here to help.
                </p>
                <Button variant="outline" asChild>
                    <a href="/contact">Contact Support</a>
                </Button>
            </div>
        </div>
    )
}