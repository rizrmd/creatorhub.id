import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight, Play, Volume2, VolumeX,
  CheckCircle2, ChevronDown, Instagram, Youtube, Twitter, Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    title: "Content Creators",
    desc: "Discover and connect with vetted creators to match your niche, audience, and campaign goals.",
    image: "/feat-creators.png",
  },
  {
    title: "Homeless Media",
    desc: "Access premium media placement opportunities across high-impact digital channels, communities, and publisher networks.",
    image: "/feat-homeless.png",
  },
  {
    title: "Publishers",
    desc: "Work with publishers and digital media platforms to amplify your campaign reach and strengthen public visibility.",
    image: "/feat-publishers.png",
  },
  {
    title: "Podcast / Live Streaming",
    desc: "Promote products and services through podcasts, live streams, live shopping sessions, and creator-led conversations.",
    image: "/feat-podcast.png",
  },
  {
    title: "Media Monitoring Tools",
    desc: "Track conversations, mentions, reach, sentiment, and campaign performance in real time across multiple platforms.",
    image: "/feat-monitoring.png",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Create Account", desc: "Sign up as a brand, creator, publisher, or media partner in minutes." },
  { step: "02", title: "Discover Creators", desc: "Browse and filter verified creators based on category, audience, platform, location, and performance." },
  { step: "03", title: "Launch Campaigns", desc: "Create your campaign brief, invite selected creators, manage deliverables, and start collaborating." },
  { step: "04", title: "Track Results", desc: "Monitor performance, engagement, reach, sentiment, and campaign impact from one service hub." },
];




export default function Landing() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  function toggleVideoMute() {
    const nextMuted = !isVideoMuted;

    setIsVideoMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-slate-950 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png?v=14" alt="CreatorHub" className="h-12 w-12" />
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
                    <Link to="/dashboard/projects" className="block px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Analytics</Link>
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
      <section className="relative overflow-hidden bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pt-8 lg:pb-16">
          <div className="grid lg:grid-cols-[1fr_0.78fr] gap-10 lg:gap-14 items-center">
            <div className="max-w-2xl lg:max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20 text-white">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-semibold">One-stop access to content creators, homeless media, and publishers</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Create, Connect With the Right Ecosystem, and Grow With Us
              </h1>
              <p className="mt-6 text-lg lg:text-xl text-slate-300 max-w-lg leading-relaxed">
                The all-in-one platform connecting brands with Indonesia's best content creators. Discover, collaborate, and grow together.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg" className="text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg shadow-orange-500/25">
                    I'm a Creator <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button size="lg" variant="outline" className="text-base font-semibold border-white/30 text-white hover:bg-white/10">
                    I'm a Brand
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-300">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Free to join</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> No setup fees</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Cancel anytime</span>
              </div>
            </div>

            <div className="w-full justify-self-center lg:justify-self-end">
              <div className="flex gap-4 items-end">
                <video
                  ref={videoRef}
                  src="/hero-video.mp4"
                  poster="/hero.png"
                  className="h-[220px] w-[180px] rounded-2xl object-cover sm:h-[260px] sm:w-[220px] lg:h-[320px] lg:w-[280px]"
                  autoPlay
                  muted={isVideoMuted}
                  loop
                  playsInline
                  preload="auto"
                  onLoadedMetadata={(event) => {
                    event.currentTarget.muted = isVideoMuted;
                  }}
                  aria-label="CreatorHub video preview"
                />
                <video
                  src="/hero-video-2.mp4"
                  className="h-[220px] w-[180px] rounded-2xl object-cover sm:h-[260px] sm:w-[220px] lg:h-[320px] lg:w-[280px]"
                  autoPlay
                  muted={isVideoMuted}
                  loop
                  playsInline
                  preload="auto"
                  onLoadedMetadata={(event) => {
                    event.currentTarget.muted = isVideoMuted;
                  }}
                  aria-label="CreatorHub second video preview"
                />
              </div>
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={toggleVideoMute}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-500/90 text-white transition-colors hover:bg-red-500"
                  aria-label={isVideoMuted ? "Unmute video" : "Mute video"}
                >
                  {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              </div>
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
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {FEATURES.map((feat) => (
              <div key={feat.title} className="group bg-white rounded-2xl overflow-hidden hover:scale-[1.03] transition-all duration-300" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)" }}>
                <div className="h-48 bg-gradient-to-br from-slate-50 to-white flex items-center justify-center overflow-hidden p-4">
                  <img src={feat.image} alt={feat.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
                </div>
                <div className="p-5 border-t border-slate-100">
                  <h3 className="text-base font-extrabold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-orange-500 mb-2 uppercase tracking-wider">Platform Preview</p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            All platforms, one service hub
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
            Connect with creators and track your campaign activity across every major social media platform from a single command center.
          </p>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
            <img src="/feat-one-dashboard.png" alt="CreatorHub Service Hub" className="w-full h-auto object-cover" />
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

      {/* Footer */}
      <footer className="text-slate-400">
        {/* CTA - slightly lighter than footer */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

        {/* Divider line */}
        <div className="border-t border-white/10" />

        {/* Footer content - darker */}
        <div className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-6 gap-8 mb-12">
            {/* Logo + Tagline */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/favicon.png?v=14" alt="CreatorHub" className="h-8 w-8" />
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
                <li><Link to="\/dashboard" className="hover:text-white transition-colors">Creator Service Hub</Link></li>
                <li><Link to="/dashboard/campaigns" className="hover:text-white transition-colors">Find Campaigns</Link></li>
                <li><Link to="\/dashboard" className="hover:text-white transition-colors">Creator Community</Link></li>
              </ul>
            </div>

            {/* For Brands */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">For Brands</h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link to="\/dashboard" className="hover:text-white transition-colors">Brand Service Hub</Link></li>
                <li><Link to="/dashboard/campaigns" className="hover:text-white transition-colors">Launch Campaign</Link></li>
                <li><Link to="/dashboard/marketplace" className="hover:text-white transition-colors">Find Creators</Link></li>
                <li><Link to="/dashboard/projects" className="hover:text-white transition-colors">Track Performance</Link></li>
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
        </div>
      </footer>
    </div>
  );
}
