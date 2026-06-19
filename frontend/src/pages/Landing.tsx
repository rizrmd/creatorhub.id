import { Link } from "react-router-dom";
import {
  Users, Megaphone, BarChart3, Radio, Search, Sparkles,
  ArrowRight, Star, Play, TrendingUp, Heart,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FEATURES = [
  {
    icon: Search,
    title: "Smart Creator Discovery",
    desc: "Find the perfect creators with AI-powered matching, advanced filters, and real-time analytics across all platforms.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Megaphone,
    title: "Campaign Management",
    desc: "Create, manage, and track influencer campaigns from brief to completion with our intuitive dashboard.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    desc: "Monitor campaign performance, engagement rates, and ROI with comprehensive analytics and reporting.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Radio,
    title: "Media Monitoring",
    desc: "Track brand mentions, sentiment, and viral reach across social media with our monitoring tools.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const STATS = [
  { value: "10,000+", label: "Verified Creators" },
  { value: "500+", label: "Brands Trust Us" },
  { value: "2,500+", label: "Campaigns Completed" },
  { value: "98%", label: "Client Satisfaction" },
];

const PLATFORMS = [
  { name: "Instagram", icon: "📸" },
  { name: "TikTok", icon: "🎵" },
  { name: "YouTube", icon: "▶️" },
  { name: "Facebook", icon: "📘" },
  { name: "X (Twitter)", icon: "𝕏" },
  { name: "LinkedIn", icon: "💼" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Account", desc: "Sign up as a brand or creator in minutes." },
  { step: "02", title: "Discover Creators", desc: "Browse and filter thousands of verified creators." },
  { step: "03", title: "Launch Campaign", desc: "Create your campaign brief and invite creators." },
  { step: "04", title: "Track Results", desc: "Monitor performance and measure your ROI." },
];

const TESTIMONIALS = [
  { name: "Rina Sari", role: "Marketing Director, Wardah", text: "CreatorHub transformed our influencer marketing. We found the perfect creators and our campaign engagement increased by 340%." },
  { name: "Budi Hartono", role: "Brand Manager, Tokopedia", text: "The platform is incredibly intuitive. We managed 50+ creators for our Ramadan campaign all from one dashboard." },
  { name: "Maya Putri", role: "CMO, Traveloka", text: "Data-driven creator selection helped us achieve 5x ROI on our latest travel campaign. Highly recommended!" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="CreatorHub.ID" className="h-10" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#testimonials" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Testimonials</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-sm font-semibold">Log In</Button>
              </Link>
              <Link to="/login">
                <Button className="text-sm font-semibold bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4 text-blue-600 bg-blue-50">
                <Sparkles className="w-3 h-3 mr-1" /> #1 Creator Marketplace in Indonesia
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Empowering Creators, <span className="text-blue-600">Elevating Brands</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
                The all-in-one platform connecting brands with Indonesia's best content creators. Discover, collaborate, and grow together.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                    Find Creators <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-base font-semibold">
                    <Play className="w-4 h-4 mr-2" /> Watch Demo
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free to join</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> No setup fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Cancel anytime</span>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl shadow-blue-200">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: Users, label: "Active Creators", value: "10,247", color: "bg-blue-500" },
                    { icon: Megaphone, label: "Live Campaigns", value: "342", color: "bg-orange-500" },
                    { icon: TrendingUp, label: "Avg. Engagement", value: "4.8%", color: "bg-green-500" },
                    { icon: Heart, label: "Total Reach", value: "25M+", color: "bg-purple-500" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mb-2`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                      <p className="text-xs text-blue-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">+24.7%</p>
                  <p className="text-[10px] text-slate-500">This month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-slate-400 mb-8">Trusted by Indonesian brands, agencies, and creators</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-50">
            {["Wardah", "Tokopedia", "Traveloka", "Blibli", "BRI", "Kino"].map((brand) => (
              <span key={brand} className="text-xl font-bold text-slate-300">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl lg:text-4xl font-extrabold text-blue-600" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Powerful tools for brands to find, manage, and measure influencer campaigns at scale.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="group rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-blue-100 transition-all duration-300">
                <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon className={`w-6 h-6 ${feat.color}`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Support */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            All platforms, one dashboard
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Connect with creators across every major social media platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {PLATFORMS.map((p) => (
              <div key={p.name} className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/20 transition-colors">
                <span className="text-2xl">{p.icon}</span>
                <span className="text-sm font-semibold text-white">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              How it works
            </h2>
            <p className="mt-4 text-lg text-slate-600">Get started in 4 simple steps.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-extrabold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              What our clients say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 lg:p-16 shadow-2xl shadow-blue-200">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Ready to grow your brand?
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-lg mx-auto">
              Join thousands of brands and creators already using CreatorHub.ID to create impactful campaigns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-base shadow-lg">
                  Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="mailto:hello@creatorhub.id">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold text-base">
                  Contact Sales
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src="/logo.png" alt="CreatorHub.ID" className="h-10 mb-4" />
              <p className="text-sm leading-relaxed">The all-in-one influencer marketing platform for Indonesian brands and creators.</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">For Creators</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Creator Dashboard</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Find Campaigns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>hello@creatorhub.id</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} CreatorHub.ID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
