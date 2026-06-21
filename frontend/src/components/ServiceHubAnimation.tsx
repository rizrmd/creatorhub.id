import { useState, useEffect, useRef, useCallback } from "react";
import { Play, X, CheckCircle, ChevronRight } from "lucide-react";

interface ProvinceData {
  name: string;
  count: number;
}

interface ServiceHubAnimationProps {
  provinces: ProvinceData[];
  isOpen: boolean;
  onClose: () => void;
  onProvinceHighlight: (name: string | null) => void;
}

const TYPING_SPEED = 18;
const LINE_DELAY = 200;
const HEADER_TEXT = "> Analyzing Content Creator Distribution in Indonesia...\n";

export default function ServiceHubAnimation({
  provinces,
  isOpen,
  onClose,
  onProvinceHighlight,
}: ServiceHubAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sortedProvinces = [...provinces].sort((a, b) => b.count - a.count);

  const formatLine = useCallback((p: ProvinceData, idx: number): string => {
    const num = String(idx + 1).padStart(2, " ");
    const dots = ".".repeat(Math.max(2, 28 - p.name.length));
    return `${num}. ${p.name} ${dots} ${p.count} creators`;
  }, []);

  const resetAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayLines([]);
    setCurrentTyping("");
    setCurrentLineIdx(0);
    setIsPlaying(false);
    setIsComplete(false);

    onProvinceHighlight(null);
  }, [onProvinceHighlight]);

  const startAnimation = useCallback(() => {
    resetAnimation();
    setTimeout(() => {
      setIsPlaying(true);
    }, 100);
  }, [resetAnimation]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentLineIdx === 0 && currentTyping === "") {
      let charIdx = 0;
      intervalRef.current = setInterval(() => {
        charIdx++;
        if (charIdx <= HEADER_TEXT.length) {
          setCurrentTyping(HEADER_TEXT.slice(0, charIdx));
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setCurrentTyping("");
          setDisplayLines([HEADER_TEXT.trimEnd()]);
          setCurrentLineIdx(0);
        }
      }, TYPING_SPEED);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }

    if (currentLineIdx >= sortedProvinces.length) {
      setIsPlaying(false);
      setIsComplete(true);
  
      onProvinceHighlight(null);
      return;
    }

    const lineText = formatLine(sortedProvinces[currentLineIdx], currentLineIdx);
    let charIdx = 0;

    const provinceDelay = setTimeout(() => {
      onProvinceHighlight(sortedProvinces[currentLineIdx].name);

      intervalRef.current = setInterval(() => {
        charIdx++;
        if (charIdx <= lineText.length) {
          setCurrentTyping(lineText.slice(0, charIdx));
        } else {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDisplayLines((prev) => [...prev, lineText]);
          setCurrentTyping("");
          setCurrentLineIdx((prev) => prev + 1);
        }
      }, TYPING_SPEED);
    }, currentLineIdx === 0 ? 100 : LINE_DELAY);

    return () => {
      clearTimeout(provinceDelay);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentLineIdx, currentTyping, sortedProvinces, formatLine, onProvinceHighlight]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayLines, currentTyping]);

  useEffect(() => {
    if (!isOpen) resetAnimation();
  }, [isOpen, resetAnimation]);

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full animate-panel-slide-in overflow-hidden" style={{ width: 380, minWidth: 380, background: "var(--ch-surface)", borderLeft: "1px solid var(--ch-border)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
        <div className="flex items-center gap-2">
          <img src="/favicon.png?v=4" alt="AI" className="w-6 h-6 rounded-md" />
          <span className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            AI Analysis
          </span>
          {isPlaying && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Processing
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-green-400">
              <CheckCircle className="w-3 h-3" /> Complete
            </span>
          )}
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="w-3.5 h-3.5" style={{ color: "var(--ch-text-muted)" }} />
        </button>
      </div>

      {/* Terminal output */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
        {displayLines.map((line, i) => (
          <div key={i} className="animate-line-appear whitespace-pre" style={{ color: i === 0 ? "#60a5fa" : "var(--ch-text)" }}>
            {line}
          </div>
        ))}
        {currentTyping && (
          <div className="whitespace-pre" style={{ color: isPlaying && currentLineIdx === 0 ? "#60a5fa" : "var(--ch-text)" }}>
            {currentTyping}
            <span className="animate-typing-cursor text-orange-400">▊</span>
          </div>
        )}
        {!isPlaying && !isComplete && displayLines.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <img src="/favicon.png?v=4" alt="CreatorHub" className="w-10 h-10 rounded-lg opacity-40" />
            <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
              Click "Run AI Analysis" to analyze content creator distribution across all 38 provinces of Indonesia
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t flex items-center gap-2" style={{ borderColor: "var(--ch-border)" }}>
        {!isPlaying && !isComplete && (
          <button
            onClick={startAnimation}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold transition-colors"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Play className="w-3.5 h-3.5" /> Run AI Analysis
          </button>
        )}
        {isPlaying && (
          <button
            onClick={() => { if (intervalRef.current) clearInterval(intervalRef.current); setIsPlaying(false); setIsComplete(true); onProvinceHighlight(null); setDisplayLines(sortedProvinces.map((p, i) => formatLine(p, i))); setCurrentTyping(""); }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-[12px] font-semibold transition-colors"
          >
            Skip
          </button>
        )}
        {isComplete && (
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={startAnimation}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-[12px] font-semibold transition-colors"
            >
              Replay
            </button>
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-1 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-bold transition-colors"
            >
              Explore <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
