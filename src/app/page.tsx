'use client'
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'digital-goods', 'services', 'work', 'blog', 'testimonials', 'pricing', 'faq', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 md:gap-2 bg-black/20 backdrop-blur-md rounded-full px-3 md:px-4 py-2 border border-white/10">
          <button
            onClick={() => scrollToSection('home')}
            className={`p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 ${activeSection === 'home' ? 'bg-white/20' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </button>
          <button
            onClick={() => scrollToSection('digital-goods')}
            className={`p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 ${activeSection === 'digital-goods' ? 'bg-white/20' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="8" cy="21" r="1"/>
              <circle cx="19" cy="21" r="1"/>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57L20.07 7H5.12"/>
            </svg>
          </button>
          <button
            onClick={() => scrollToSection('work')}
            className={`p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 ${activeSection === 'work' ? 'bg-white/20' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
              <rect width="6" height="6" x="9" y="9" rx="1" ry="1"/>
            </svg>
          </button>
          <button
            onClick={() => scrollToSection('blog')}
            className={`p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 ${activeSection === 'blog' ? 'bg-white/20' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m3 17 6-6 4 4 8-8"/>
              <path d="m14 5 7 7"/>
            </svg>
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className={`p-2 hover:bg-white/10 rounded-full transition-all duration-300 hover:scale-110 ${activeSection === 'contact' ? 'bg-white/20' : ''}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
              <path d="m22 7-10 5L2 7"/>
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 animate-in fade-in duration-700 delay-100">
            <Badge variant="secondary" className="rounded-full px-3 md:px-4 py-2 text-xs md:text-sm hover:scale-105 transition-all duration-300">🔧 Design</Badge>
            <Badge variant="secondary" className="rounded-full px-3 md:px-4 py-2 text-xs md:text-sm hover:scale-105 transition-all duration-300">UX & UI design</Badge>
            <Badge variant="secondary" className="rounded-full px-3 md:px-4 py-2 text-xs md:text-sm hover:scale-105 transition-all duration-300">No-Coding</Badge>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-normal mb-6 leading-tight animate-in fade-in duration-1000 delay-200">
            I'm Alex,<br />
            <span className="italic">Digital creator.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-in fade-in duration-700 delay-500">
            Amsterdam-based digital storyteller for worldwide brands.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16 animate-in fade-in duration-700 delay-700">
            <Button
              size="lg"
              onClick={() => scrollToSection('work')}
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 md:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              See work
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('digital-goods')}
              className="rounded-full px-6 md:px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Shop products
            </Button>
          </div>

          {/* Hero Image */}
           <div className="relative max-w-lg mx-auto animate-in fade-in duration-1000 delay-1000">
            <Image
                src="/p2.png"              // file lives in /public
                alt="Portrait of Shon"
                width={800}
                height={1000}
                className="w-full h-auto rounded-3xl hover:scale-105 transition-all duration-500"
                priority
            />
            </div>
        </div>
      </section>

      {/* Digital Goods Section */}
      <section id="digital-goods" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-serif">Digital goods</h2>
            <Button variant="link" className="text-muted-foreground hover:text-foreground transition-colors duration-300">See all</Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Keynote Card */}
            <Card className="overflow-hidden bg-card border-border hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-purple-400 to-purple-600 p-8 relative group-hover:scale-102 transition-all duration-300">
                <div className="absolute top-4 left-4 text-white">
                  <div className="text-sm font-medium">SCHEDULE</div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm">01.07</div>
                  <div className="text-sm">2026</div>
                  <div className="text-sm">Amsterdam</div>
                </div>
                <div className="text-center text-white">
                  <h3 className="text-4xl font-bold">Offscreen</h3>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif mb-2">Keynote</h3>
                    <p className="text-muted-foreground">Event template</p>
                  </div>
                  <div className="text-lg font-medium">$99</div>
                </div>
              </CardContent>
            </Card>

            {/* Directory Card */}
            <Card className="overflow-hidden bg-card border-border hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <div className="aspect-video bg-gradient-to-br from-orange-400 to-red-400 p-8 relative group-hover:scale-102 transition-all duration-300">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-4">Exceptional<br />creations.</h3>
                  <div className="text-sm">Hardwired<br />for creatives.</div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-serif mb-2">Directory</h3>
                    <p className="text-muted-foreground">Directory template</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">Free</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What I Do Section */}
      <section id="services" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif mb-16">What I do</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card border-border p-8 hover:bg-card/80 hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-serif mb-4 group-hover:text-primary transition-colors duration-300">Complete websites</h3>
                <p className="text-muted-foreground">Strategic, beautiful websites that achieve your business goals.</p>
              </div>
            </Card>

            <Card className="bg-card border-border p-8 hover:bg-card/80 hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 1v6m0 6v6"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-serif mb-4">Design systems</h3>
                <p className="text-muted-foreground">Building scalable design foundations that keep your product consistent and efficient.</p>
              </div>
            </Card>

            <Card className="bg-card border-border p-8 hover:bg-card/80 hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <div className="text-black font-bold text-sm">BR</div>
                </div>
                <h3 className="text-2xl font-serif mb-4">Branding</h3>
                <p className="text-muted-foreground">Creating distinctive visual identities that make your brand memorable.</p>
              </div>
            </Card>

            <Card className="bg-card border-border p-8 hover:bg-card/80 hover:scale-105 transition-all duration-300 hover:shadow-xl group cursor-pointer">
              <div className="mb-6">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-all duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-serif mb-4">Product Design</h3>
                <p className="text-muted-foreground">Turning complex ideas into intuitive digital products people love.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Work Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-serif">Latest work</h2>
            <Button variant="link" className="text-muted-foreground">See all</Button>
          </div>

          <Card className="overflow-hidden bg-card border-border">
            <div className="aspect-video relative">
              <img
                src="https://ext.same-assets.com/4129804017/732750994.png"
                alt="GreenWave Eco-Cleaning branding project"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-serif">GreenWave Eco-Cleaning</h3>
                <Badge variant="secondary">Branding</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Company Logos */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center gap-16 opacity-50">
            <div className="text-2xl font-bold">booking.com</div>
            <div className="text-2xl font-bold">Spotify</div>
            <div className="text-2xl font-bold">Notion</div>
            <div className="text-2xl font-bold">mailchimp</div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-serif">From the blog</h2>
            <Button variant="link" className="text-muted-foreground">See all</Button>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "Turning critique into creative opportunities",
                date: "Oct 24, 2024",
                readTime: "2 min"
              },
              {
                title: "Creating compelling narratives through design",
                date: "Oct 20, 2024",
                readTime: "4 min"
              },
              {
                title: "Tools and techniques for better productivity",
                date: "Oct 8, 2024",
                readTime: "1 min"
              },
              {
                title: "Choosing the right fonts for your design projects",
                date: "Sep 24, 2024",
                readTime: "2 min"
              },
              {
                title: "How to create inclusive user experiences",
                date: "Sep 15, 2024",
                readTime: "3 min"
              }
            ].map((post, index) => (
              <div key={index} className="flex justify-between items-center py-6 border-b border-border last:border-b-0 group hover:bg-card/30 px-4 -mx-4 rounded-lg transition-colors">
                <div>
                  <h3 className="text-xl font-serif mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif mb-16">What others say</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                text: "Alex's work exceeded all expectations. They brought fresh ideas to the table, and the final designs were nothing short of exceptional.",
                name: "Jordan P.",
                title: "Startup Founder",
                avatar: "https://ext.same-assets.com/4129804017/849432527.jpeg"
              },
              {
                text: "Alex is a true creative talent. From concept to completion, they delivered a portfolio that truly reflects my style and personality.",
                name: "Samantha R.",
                title: "Creative Director",
                avatar: "https://ext.same-assets.com/4129804017/3647061311.png"
              },
              {
                text: "Alex made the design process smooth and exciting. Their unique approach and dedication resulted in a polished and cohesive brand aesthetic.",
                name: "Nina S.",
                title: "Marketing Manager",
                avatar: "https://ext.same-assets.com/4129804017/3065586418.jpeg"
              },
              {
                text: "Alex's work exceeded all expectations. They brought fresh ideas to the table, and the final designs were nothing short of exceptional.",
                name: "Jordan P.",
                title: "Startup Founder",
                avatar: "https://ext.same-assets.com/4129804017/849432527.jpeg"
              },
              {
                text: "Working with Alex was a game-changer. Their innovative designs not only look amazing but also perfectly align with our brand's identity.",
                name: "Lucas M.",
                title: "Photographer",
                avatar: "https://ext.same-assets.com/4129804017/3647061311.png"
              },
              {
                text: "Alex transformed our vision into a stunning reality. Their creativity and attention to detail brought our brand to life in ways we couldn't have imagined!",
                name: "Juno C.",
                title: "Small Business Owner",
                avatar: "https://ext.same-assets.com/4129804017/3065586418.jpeg"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card border-border p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-sm mb-6">"{testimonial.text}"</blockquote>
                <div className="flex items-center gap-3">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="font-medium text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif mb-16">Pricing</h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Per Project */}
            <Card className="bg-card border-border p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-serif mb-4">Per project</h3>
                <p className="text-muted-foreground mb-6">For clients seeking a professionally designed landing page with no recurring costs.</p>

                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">From</div>
                  <div className="text-4xl font-bold">$5000<span className="text-lg font-normal text-muted-foreground">/project</span></div>
                </div>

                <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 mb-6">
                  Book a call
                </Button>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    One-time investment
                  </li>
                  <li className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    Full ownership
                  </li>
                  <li className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    Get all the design files
                  </li>
                </ul>
              </div>
            </Card>

            {/* Monthly */}
            <Card className="bg-card border-border p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-serif mb-4">Monthly</h3>
                <p className="text-muted-foreground mb-6">For clients who want ongoing design updates and support.</p>

                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">From</div>
                  <div className="text-4xl font-bold">$2500<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                </div>

                <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 mb-6">
                  Book a call
                </Button>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    Lower upfront cost
                  </li>
                  <li className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    Monthly updates and support
                  </li>
                  <li className="flex items-center gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    Easily add new features
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {[
              "What types of digital products do you design?",
              "What is your design process like?",
              "What is your typical timeline for projects?",
              "What do you need from me to get started?",
              "How do you handle revisions and feedback?",
              "What is your communication style during projects?"
            ].map((question, index) => (
              <Card key={index} className="bg-card border-border">
                <button className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-card/80 transition-colors">
                  <span className="font-medium">{question}</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-serif mb-6">
            Are you ready to take the next step?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Ready to bring your digital vision to life? Whether it's a stunning website, a mobile app, or a full design system, let's create something exceptional together.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8">
              Let's talk
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8">
              Plan a call
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-serif mb-4">
              Let's create something<br />awesome together.
            </h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-medium mb-4">Pages</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Shop</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Work</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Latest products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Keynote</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Directory</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Display</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Gallereee</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Feature</a></li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">Get template</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">Built by Marc</a>
              <span>•</span>
              <a href="#" className="hover:text-foreground transition-colors">All templates</a>
            </div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13.77,9.13 13.77,14.87 9.77,12"/>
                  <rect width="20" height="14" x="2" y="5" rx="2" ry="2"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
