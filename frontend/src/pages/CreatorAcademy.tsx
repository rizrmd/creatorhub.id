import { useState } from "react";
import {
  Search, BookOpen, Clock, Users, Star, Play,
  FileText, CheckCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const courses = [
  {
    id: 1,
    title: "Content Strategy for Creator",
    description: "Learn how to create engaging and consistent content to build your personal brand.",
    category: "Content",
    level: "Beginner",
    duration: "4 hours",
    lessons: 12,
    students: 1240,
    rating: 4.8,
    instructor: "Sarah Chen",
    thumbnail: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
    progress: 75,
    tags: ["Content", "Branding"],
  },
  {
    id: 2,
    title: "Social Media Monetization",
    description: "Complete strategy to earn money from social media: endorsements, affiliate, and digital products.",
    category: "Monetization",
    level: "Intermediate",
    duration: "6 hours",
    lessons: 18,
    students: 890,
    rating: 4.9,
    instructor: "Rizky Pratama",
    thumbnail: "linear-gradient(135deg, #16A34A 0%, #22C55E 100%)",
    progress: 30,
    tags: ["Monetization", "Business"],
  },
  {
    id: 3,
    title: "Video Editing for Beginners",
    description: "Master the basics of video editing for Reels, TikTok, and YouTube Shorts content.",
    category: "Skill",
    level: "Beginner",
    duration: "8 hours",
    lessons: 24,
    students: 2100,
    rating: 4.7,
    instructor: "Davo Laksono",
    thumbnail: "linear-gradient(135deg, #6366F1 0%, #818CF8 100%)",
    progress: 0,
    tags: ["Video", "Editing"],
  },
  {
    id: 4,
    title: "Brand Negotiation",
    description: "How to negotiate rates and collaboration contracts with brands to get the best value.",
    category: "Business",
    level: "Advanced",
    duration: "3 hours",
    lessons: 10,
    students: 560,
    rating: 4.6,
    instructor: "Nurul Arifin",
    thumbnail: "linear-gradient(135deg, #EC4899 0%, #F472B6 100%)",
    progress: 0,
    tags: ["Negotiation", "Business"],
  },
  {
    id: 5,
    title: "Analytics & Data for Creators",
    description: "Read and leverage analytics data to optimize your content strategy.",
    category: "Skill",
    level: "Intermediate",
    duration: "5 hours",
    lessons: 15,
    students: 720,
    rating: 4.5,
    instructor: "Sarah Chen",
    thumbnail: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
    progress: 10,
    tags: ["Analytics", "Data"],
  },
  {
    id: 6,
    title: "Building Online Communities",
    description: "Strategies to build and manage engaged communities across various platforms.",
    category: "Community",
    level: "Intermediate",
    duration: "4 hours",
    lessons: 14,
    students: 430,
    rating: 4.4,
    instructor: "Rizky Pratama",
    thumbnail: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
    progress: 0,
    tags: ["Community", "Engagement"],
  },
];

const stats = [
  { label: "Total Courses", value: "6", icon: BookOpen },
  { label: "In Progress", value: "3", icon: Play },
  { label: "Completed", value: "1", icon: CheckCircle },
  { label: "Study Hours", value: "18", icon: Clock },
];

const levelColors: Record<string, { bg: string; text: string }> = {
  Beginner: { bg: "#DCFCE7", text: "#16A34A" },
  Intermediate: { bg: "#FEF3C7", text: "#D97706" },
  Advanced: { bg: "#FEE2E2", text: "#DC2626" },
};

export default function CreatorAcademy() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1
          className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Creator Academy
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Improve your skills and knowledge as a content creator.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--ch-primary-50)" }}
              >
                <s.icon className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
              </div>
              <div>
                <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                  {s.value}
                </p>
                <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                  {s.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs & Search */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-3 pb-0 bg-[#0B1120] rounded-t-xl">
          <div className="flex items-center gap-0 rounded-2xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
            <TabsTrigger
              value="all"
              className="flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-none border-0 data-[state=active]:bg-[var(--ch-orange)] data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              All
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-none border-0 data-[state=active]:bg-[var(--ch-orange)] data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-white transition-colors"
            >
              <Play className="w-4 h-4" />
              In Progress
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-none border-0 data-[state=active]:bg-[var(--ch-orange)] data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-white transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger
              value="new"
              className="flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-none border-0 data-[state=active]:bg-[var(--ch-orange)] data-[state=active]:text-white data-[state=active]:shadow-none text-slate-400 hover:text-white transition-colors"
            >
              <Clock className="w-4 h-4" />
              Not Started
            </TabsTrigger>
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--ch-text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border bg-white"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
            />
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered
              .filter((c) => {
                if (activeTab === "in-progress") return c.progress > 0 && c.progress < 100;
                if (activeTab === "completed") return c.progress === 100;
                if (activeTab === "new") return c.progress === 0;
                return true;
              })
              .map((c) => {
                const lc = levelColors[c.level] || levelColors.Beginner;
                return (
                  <Card
                    key={c.id}
                    className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] overflow-hidden"
                  >
                    <div
                      className="h-32 flex items-center justify-center relative"
                      style={{ background: c.thumbnail }}
                    >
                      <BookOpen className="w-10 h-10 text-white/80" />
                      {c.progress > 0 && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-white/90 text-[11px] font-bold" style={{ color: c.progress === 100 ? "#16A34A" : "#F97316" }}>
                            {c.progress === 100 ? (
                              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>
                            ) : (
                              `${c.progress}%`
                            )}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: lc.bg, color: lc.text }}
                        >
                          {c.level}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">
                          {c.category}
                        </Badge>
                      </div>
                      <p
                        className="text-[14px] font-bold leading-tight line-clamp-2"
                        style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {c.title}
                      </p>
                      <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: "var(--ch-text-muted)" }}>
                        {c.description}
                      </p>
                      {c.progress > 0 && c.progress < 100 && (
                        <div className="space-y-1">
                          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${c.progress}%`, background: "var(--ch-primary)" }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                          <Clock className="w-3 h-3" /> {c.duration}
                        </span>
                        <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                          <FileText className="w-3 h-3" /> {c.lessons} lessons
                        </span>
                        <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                          <Users className="w-3 h-3" /> {c.students}
                        </span>
                        <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {c.rating}
                        </span>
                      </div>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                          by {c.instructor}
                        </span>
                        <button
                          className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold rounded-lg text-white transition-opacity hover:opacity-90"
                          style={{ background: "var(--ch-primary)" }}
                        >
                          {c.progress > 0 && c.progress < 100 ? (
                            <><Play className="w-3 h-3" /> Continue</>
                          ) : c.progress === 100 ? (
                            <><CheckCircle className="w-3 h-3" /> Completed</>
                          ) : (
                            <><Play className="w-3 h-3" /> Start</>
                          )}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
