import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Target, Users, Lightbulb, ArrowRight } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-foreground text-balance">About GrammarPro</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              We're on a mission to help everyone write with confidence and clarity. Our advanced AI-powered grammar
              checking technology makes professional writing accessible to all.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                At GrammarPro, we believe that clear communication is the foundation of success. Whether you're writing
                an important email, crafting a research paper, or creating content for your business, your words should
                reflect your intelligence and professionalism.
              </p>
              <p className="text-lg text-muted-foreground mb-8 text-pretty">
                That's why we've developed the most advanced real-time grammar checking technology available, designed
                to help you write with confidence and achieve your communication goals.
              </p>
              <Button asChild>
                <Link href="/checker">
                  Try Our Grammar Checker
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="bg-primary/5 rounded-lg p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">2019</div>
                  <div className="text-sm text-muted-foreground">Founded</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100K+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">50M+</div>
                  <div className="text-sm text-muted-foreground">Words Checked</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              The principles that guide everything we do at GrammarPro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-border/50 text-center">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Accuracy</CardTitle>
                <CardDescription>
                  We're committed to providing the most accurate grammar checking available, with continuous
                  improvements to our AI algorithms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Precision</CardTitle>
                <CardDescription>
                  Every suggestion is carefully crafted to improve your writing while maintaining your unique voice and
                  style.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Accessibility</CardTitle>
                <CardDescription>
                  Professional writing tools should be available to everyone, regardless of their background or
                  experience level.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 text-center">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-xl">Innovation</CardTitle>
                <CardDescription>
                  We continuously push the boundaries of what's possible in AI-powered writing assistance and grammar
                  checking.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              A diverse group of linguists, engineers, and AI researchers dedicated to improving written communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">AJ</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Alex Johnson</h3>
                <p className="text-muted-foreground mb-2">CEO & Co-Founder</p>
                <p className="text-sm text-muted-foreground">
                  Former linguistics professor with 15 years of experience in natural language processing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">SP</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Sarah Park</h3>
                <p className="text-muted-foreground mb-2">CTO & Co-Founder</p>
                <p className="text-sm text-muted-foreground">
                  AI researcher and engineer specializing in machine learning and language models.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">MR</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Michael Rodriguez</h3>
                <p className="text-muted-foreground mb-2">Head of Product</p>
                <p className="text-sm text-muted-foreground">
                  Product strategist focused on creating intuitive and powerful writing tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            Join our community of writers and professionals who trust GrammarPro for their communication needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/signup">
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-8 py-6 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
