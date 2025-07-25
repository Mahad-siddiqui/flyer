import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Play,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      {/* <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="container relative z-10 px-4 py-20 mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm mb-6">
              <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
              <span className="text-white/90">
                Try it FREE - No Credit Card Required
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your Flyers into
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Interactive Web Pages
              </span>
            </h1>
            <h3 className="text-2xl md:text-3xl font-bold text-purple-600 mb-6 leading-tight">Welcome to InteractMe</h3>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
              Turn your static document into an interactive hub in seconds,
              completely free. Upload, customize, and preview instantly - no
              signup required until you're ready to publish!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/try-now">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try It Now - FREE
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg backdrop-blur-sm"
                >
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>Try before you sign up</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-400" />
                <span>Instant preview</span>
              </div>
            </div>
          </div>
        </div>
      </section> */}
<section className="relative overflow-hidden gradient-hero">
  <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
  <div className="container relative z-10 px-4 py-20 mx-auto text-center">
    <div className="max-w-4xl mx-auto">
      <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm mb-6">
        <Sparkles className="mr-2 h-4 w-4 text-yellow-300" />
        <span className="text-white/90">
          Try it FREE - No Credit Card Required
        </span>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
        Transform Your Content into
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
          Interactive Web Pages
        </span>
      </h1>
      <h3 className="text-2xl md:text-3xl font-bold text-purple-800 mb-6 leading-tight">Welcome to InteractMe</h3>
      <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
        Turn your static documents into interactive hubs in seconds,
        completely free. Upload, customize, and preview instantly - no
        signup required until you're ready to publish!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link href="/try-now">
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 py-6 text-lg shadow-lg"
          >
            <Play className="mr-2 h-5 w-5" />
            Try It Now - FREE
          </Button>
        </Link>
        <Link href="#how-it-works">
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 hover:bg-white/10 font-semibold px-8 py-6 text-lg backdrop-blur-sm"
          >
            See How It Works
          </Button>
        </Link>
      </div>

      <div className="mt-12 flex items-center justify-center gap-8 text-white/60">
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-400" />
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-400" />
          <span>Try before you sign up</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="h-5 w-5 text-green-400" />
          <span>Instant preview</span>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the full process before deciding to sign up. No
              commitment required!
            </p>
          </div>

          {/* Interactive Flow Diagram */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Step 1 */}
              <Card className="feature-card text-center relative">
                <div className="absolute -top-0 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    1
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Upload Your Document
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Drop any file - PDF, Word, PNG, JPEG. Our AI instantly
                    processes and extracts layout, data, and editable fields.
                  </CardDescription>
                  <div className="mt-4 text-sm text-green-600 font-medium">
                    ✓ No signup required
                  </div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="feature-card text-center relative">
                <div className="absolute -top-0 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    2
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Select Your Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Choose from professional templates: Event Flyer,
                    Registration Form, Invoice, and more. Perfect fit
                    guaranteed.
                  </CardDescription>
                  <div className="mt-4 text-sm text-green-600 font-medium">
                    ✓ Try all templates free
                  </div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="feature-card text-center relative">
                <div className="absolute -top-0 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                    3
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Edit3 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    Preview & Edit Fields
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    See your interactive document come to life! Edit fields,
                    customize content, and perfect your design in real-time.
                  </CardDescription>
                  <div className="mt-4 text-sm text-green-600 font-medium">
                    ✓ Full preview access
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sign Up Step */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-4 p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  4
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Ready to Publish?</h3>
                  <p className="text-muted-foreground">
                    Sign up in seconds to get your QR code and shareable link
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-primary" />
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  5
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Publish & Share
                  </h3>
                  <p className="text-muted-foreground">
                    Get your QR code and link instantly
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/try-now">
                <Button size="lg" className="px-8 py-6 text-lg font-semibold">
                  <Play className="mr-2 h-5 w-5" />
                  Start Your Free Trial Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-3">
                Experience everything before you commit. No credit card
                required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Try InteractMe?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See the magic happen before you decide. No risk, no commitment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Play className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Try Before You Buy</h3>
                <p className="text-sm text-muted-foreground">
                  Experience the full process - upload, customize, preview - all
                  before signing up
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  AI processes your document in seconds, not minutes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Smartphone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Mobile-Perfect</h3>
                <p className="text-sm text-muted-foreground">
                  Every document looks amazing on phones, tablets, and desktops
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Risk Trial</h3>
                <p className="text-sm text-muted-foreground">
                  No credit card, no email required until you're ready to
                  publish
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instant QR Codes</h3>
                <p className="text-sm text-muted-foreground">
                  Get shareable QR codes and links the moment you publish
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Professional Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from dozens of professionally designed templates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Join Thousands Who've Already Tried InteractMe
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-muted-foreground">
                  Documents Transformed
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">98%</div>
                <div className="text-muted-foreground">User Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                <div className="text-muted-foreground">Instant Processing</div>
              </div>
            </div>

            <blockquote className="text-xl italic text-muted-foreground mb-8 max-w-2xl mx-auto">
              "I was amazed how quickly I could turn my event flyer into an
              interactive webpage. The try-before-signup approach let me see
              exactly what I was getting!"
            </blockquote>
            <cite className="text-sm font-medium">
              — Sarah J., Event Coordinator
            </cite>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Document?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free trial now. Experience everything before you
              commit. No credit card required until you're ready to publish.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/try-now">
                <Button
                  size="lg"
                  variant="default"
                  className="px-8 py-6 text-lg font-semibold"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Try InteractMe FREE
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold"
                >
                  View Pricing Plans
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              ✓ No signup required to try ✓ Full preview access ✓ Professional
              templates
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
