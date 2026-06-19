import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Megaphone, BarChart3, Radio, Sparkles,
  ArrowRight, Play, Headphones,
  CheckCircle2, ChevronDown, Eye, MessageSquare, Settings,
  LayoutDashboard, Instagram, Youtube, Facebook, Twitter, Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Users,
    title: "Content Creators",
    desc: "Discover and connect with vetted creators who match your niche, audience, campaign goals, and brand identity.",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: Radio,
    title: "Homeless Media",
    desc: "Access premium media placement opportunities across high-impact digital channels, communities, and publisher networks.",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: Megaphone,
    title: "Publishers",
    desc: "Work with publishers and digital media platforms to amplify your campaign reach and strengthen public visibility.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Headphones,
    title: "Podcast / Live Streaming",
    desc: "Promote products and services through podcasts, live streams, live shopping sessions, and creator-led conversations.",
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    icon: Eye,
    title: "Media Monitoring Tools",
    desc: "Track conversations, mentions, reach, sentiment, and campaign performance in real time across multiple platforms.",
    color: "text-green-500",
    bg: "bg-green-50",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Account", desc: "Sign up as a brand, creator, publisher, or media partner in minutes." },
  { step: "02", title: "Discover Creators", desc: "Browse and filter verified creators based on category, audience, platform, location, and performance." },
  { step: "03", title: "Launch Campaigns", desc: "Create your campaign brief, invite selected creators, manage deliverables, and start collaborating." },
  { step: "04", title: "Track Results", desc: "Monitor performance, engagement, reach, sentiment, and campaign impact from one dashboard." },
];

const PLATFORMS = [
  { name: "Instagram", icon: Instagram },
  { name: "TikTok", icon: Play },
  { name: "YouTube", icon: Youtube },
  { name: "Facebook", icon: Facebook },
  { name: "X / Twitter", icon: Twitter },
  { name: "LinkedIn", icon: Linkedin },
];

const SIDEBAR_MENU = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Megaphone, label: "Campaigns" },
  { icon: Users, label: "Creators" },
  { icon: MessageSquare, label: "Messages" },
  { icon: BarChart3, label: "Reports" },
  { icon: Eye, label: "Media Monitoring" },
  { icon: Settings, label: "Settings" },
];

const CAMPAIGN_METRICS = [
  { label: "Active Campaigns", value: "12" },
  { label: "Open Invites", value: "8" },
  { label: "Creators Engaged", value: "247" },
  { label: "Completed", value: "56" },
];

const ACTIVITIES = [
  { text: "New creator joined", color: "bg-green-500" },
  { text: "Campaign updated", color: "bg-blue-500" },
  { text: "New message received", color: "bg-orange-500" },
  { text: "Content activated", color: "bg-purple-500" },
];

export default function Landing() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png?v=3" alt="CreatorHub" className="h-9 w-9" />
              <span className="text-2xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CreatorHub.ID</span>
            </div>
            <div className="hidden md:flex items-center gap-7">
              <a href="#features" className="text-sm font-bold text-white hover:text-slate-300 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm font-bold text-white hover:text-slate-300 transition-colors">How It Works</a>
              <div className="relative">
                <button
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  onBlur={() => setTimeout(() => setSolutionsOpen(false), 150)}
                  className="flex items-center gap-1 text-sm font-bold text-white hover:text-slate-300 transition-colors"
                >
                  Solutions <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {solutionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-2 z-50">
                    <Link to="/dashboard/marketplace" className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Content Creators</Link>
                    <Link to="/dashboard/homeless-media" className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Homeless Media</Link>
                    <Link to="/dashboard/marketplace" className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Publishers</Link>
                    <Link to="/dashboard/campaigns" className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Campaign Brief</Link>
                    <Link to="/dashboard/analytics" className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Analytics</Link>
                  </div>
                )}
              </div>
              <a href="#pricing" className="text-sm font-bold text-white hover:text-slate-300 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-white/10">Log In</Button>
              </Link>
              <Link to="/login">
                <Button className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-500/25">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full mb-6">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-blue-600">#1 Creator Marketplace in Indonesia</span>
              </div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Empowering Creators, <span className="text-blue-600">Elevating Brands</span>
              </h1>
              <p className="mt-6 text-lg text-slate-600 max-w-lg leading-relaxed">
                The all-in-one platform connecting brands with Indonesia's best content creators. Discover, collaborate, and grow together.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-500/25">
                    Get Started <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="text-base font-semibold">
                    <Play className="w-4 h-4 mr-2" /> Explore Features
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Free to join</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> No setup fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Cancel anytime</span>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <img src="/hero.png" alt="CreatorHub Dashboard" className="w-full h-auto rounded-3xl shadow-2xl" />
            </div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Dashboard Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Dark Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 lg:p-10">
              <h3 className="text-2xl lg:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                All platforms, one dashboard
              </h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Connect with creators and track your campaign activity across every major social media platform from a single command center.
              </p>
              <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <div key={p.name} className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                    <p.icon className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Dashboard Mockup */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="flex">
                {/* Sidebar */}
                <div className="w-48 bg-slate-900 p-4 min-h-[400px]">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-bold text-white">Campaign</span>
                  </div>
                  <nav className="space-y-1">
                    {SIDEBAR_MENU.map((item, i) => (
                      <div key={item.label} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${i === 0 ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"} transition-colors cursor-pointer`}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                    ))}
                  </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-5">
                  <h4 className="text-base font-bold text-slate-900 mb-4">Campaign Overview</h4>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {CAMPAIGN_METRICS.map((m) => (
                      <div key={m.label} className="bg-slate-50 rounded-xl p-3">
                        <p className="text-2xl font-extrabold text-slate-900">{m.value}</p>
                        <p className="text-xs text-slate-500">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chart Placeholder */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-5">
                    <p className="text-sm font-semibold text-slate-700 mb-3">Performance Overview</p>
                    <div className="flex items-end gap-1.5 h-24">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>

                  {/* Activity */}
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-3">Recent Activity</p>
                    <div className="space-y-2">
                      {ACTIVITIES.map((a, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm">
                          <div className={`w-2 h-2 ${a.color} rounded-full`} />
                          <span className="text-slate-600">{a.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-orange-500 mb-2 uppercase tracking-wider">How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Get started in 4 simple steps.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center text-xl font-extrabold mx-auto mb-4 shadow-lg shadow-orange-500/25">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 lg:p-16 shadow-2xl">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Ready to launch your next creator campaign?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-lg mx-auto">
              Join CreatorHub.ID and start connecting with creators, media partners, publishers, and digital communities that can help your campaign grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 font-semibold text-base shadow-lg shadow-orange-500/25">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-white/10 font-semibold text-base">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-6 gap-8 mb-12">
            {/* Logo + Tagline */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/favicon.png?v=3" alt="CreatorHub" className="h-8 w-8" />
                <span className="text-lg font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CreatorHub.ID</span>
              </div>
              <p className="text-sm font-semibold text-white mb-2">Create &bull; Connect &bull; Grow</p>
              <p className="text-sm leading-relaxed">
                CreatorHub.ID is an all-in-one creator marketing and digital collaboration platform built for Indonesian brands, creators, publishers, and media partners.
              </p>
              <div className="flex gap-3 mt-4">
                {[Instagram, Play, Youtube, Linkedin, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Platform</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* For Creators */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">For Creators</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Creator Dashboard</Link></li>
                <li><Link to="/dashboard/campaigns" className="hover:text-white transition-colors">Find Campaigns</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Creator Community</Link></li>
              </ul>
            </div>

            {/* For Brands */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">For Brands</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Brand Dashboard</Link></li>
                <li><Link to="/dashboard/campaigns" className="hover:text-white transition-colors">Launch Campaign</Link></li>
                <li><Link to="/dashboard/marketplace" className="hover:text-white transition-colors">Find Creators</Link></li>
                <li><Link to="/dashboard/analytics" className="hover:text-white transition-colors">Track Performance</Link></li>
              </ul>
            </div>

            {/* Company + Contact */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm mb-6">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
              <h4 className="text-sm font-bold text-white mb-2">Contact</h4>
              <ul className="space-y-1.5 text-sm">
                <li>hello@creatorhub.id</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 CreatorHub.ID. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
