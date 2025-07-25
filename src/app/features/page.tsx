import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Upload,
  Sparkles,
  Smartphone,
  QrCode,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Check,
  Star,
  FileText,
  Eye,
  Edit3,
  Share2,
  BarChart3,
  Users,
  Clock,
  Palette,
  Download,
  Link2
} from 'lucide-react'

export default function FeaturesPage() {
  const features = [
    {
      icon: Upload,
      title: "Smart Document Processing",
      description: "Upload any document format - PDF, Word, images - and our AI instantly extracts all the important information.",
      benefits: ["Supports 10+ file formats", "AI-powered text extraction", "Automatic field detection", "Layout preservation"]
    },
    {
      icon: Palette,
      title: "Professional Templates",
      description: "Choose from dozens of professionally designed templates that automatically adapt to your content.",
      benefits: ["50+ premium templates", "Mobile-responsive design", "Customizable colors & fonts", "Industry-specific layouts"]
    },
    {
      icon: Edit3,
      title: "Real-time Editing",
      description: "Edit any field in real-time with instant preview. See your changes as you make them.",
      benefits: ["Live preview updates", "Drag & drop editing", "Rich text formatting", "Undo/redo functionality"]
    },
    {
      icon: QrCode,
      title: "Instant QR Codes",
      description: "Generate custom QR codes instantly. Perfect for sharing your interactive documents anywhere.",
      benefits: ["Custom QR code design", "High-resolution downloads", "Tracking & analytics", "Bulk generation"]
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Every document looks perfect on phones, tablets, and desktops. Responsive by default.",
      benefits: ["Touch-friendly interface", "Fast loading times", "Offline viewing", "Cross-platform compatibility"]
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track views, engagement, and user interactions with detailed analytics and insights.",
      benefits: ["Real-time statistics", "Geographic data", "Device analytics", "Export reports"]
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your documents via QR codes, links, or embed them directly into websites.",
      benefits: ["Multiple sharing options", "Custom short URLs", "Social media integration", "Email campaigns"]
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime. Your documents are safe and always accessible.",
      benefits: ["SSL encryption", "Regular backups", "GDPR compliant", "24/7 monitoring"]
    }
  ]

  const useCases = [
    {
      title: "Event Organizers",
      description: "Transform event flyers into interactive pages with RSVP forms, maps, and social sharing.",
      icon: Star,
      examples: ["Conference registration", "Wedding invitations", "Community events", "Workshops"]
    },
    {
      title: "Small Businesses",
      description: "Convert promotional materials into engaging web experiences that drive conversions.",
      icon: Zap,
      examples: ["Product catalogs", "Service brochures", "Price lists", "Contact forms"]
    },
    {
      title: "Educators",
      description: "Make educational materials interactive with embedded videos, links, and resources.",
      icon: FileText,
      examples: ["Course syllabi", "Assignment sheets", "Resource guides", "Study materials"]
    },
    {
      title: "Non-Profits",
      description: "Create compelling donation pages and volunteer sign-ups from your existing materials.",
      icon: Users,
      examples: ["Fundraising campaigns", "Volunteer forms", "Event announcements", "Impact reports"]
    }
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container relative z-10 px-4 py-20 mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Powerful Features for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Interactive Documents
              </span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Everything you need to transform static documents into engaging, interactive web experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/try-now">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-lg"
                >
                  Try All Features Free
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 hover:bg-white/10 font-semibold px-8 py-6 text-lg backdrop-blur-sm"
                >
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools to create, customize, and share interactive documents
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="feature-card h-full">
                  <CardHeader>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perfect for Every Industry
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how different professionals use InteractMe to enhance their documents
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon
              return (
                <Card key={index} className="feature-card">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{useCase.title}</CardTitle>
                      </div>
                    </div>
                    <CardDescription className="text-base">
                      {useCase.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {useCase.examples.map((example, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From upload to publish in just a few clicks
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Upload, title: "Upload", desc: "Drop your document" },
                { icon: Palette, title: "Template", desc: "Choose your style" },
                { icon: Edit3, title: "Customize", desc: "Edit your content" },
                { icon: Share2, title: "Publish", desc: "Share with the world" }
              ].map((step, index) => {
                const Icon = step.icon
                return (
                  <div key={index} className="text-center">
                    <div className="relative mb-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mx-auto">
                        <Icon className="h-8 w-8" />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Try all features free. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/try-now">
                <Button size="lg" className="px-8 py-6 text-lg font-semibold">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}