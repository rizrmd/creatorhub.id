import { useEffect, useRef } from "react";

const SCALE = 0.85;
const CONTENT_W = 1440;

export default function DesaKreatifDetail() {
  const ref = useRef<HTMLIFrameElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    const wrapper = wrapperRef.current;
    if (!iframe || !wrapper) return;

    let ticking = false;
    const resize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        try {
          const doc = iframe.contentDocument;
          if (doc && doc.body) {
            const h = Math.max(doc.body.scrollHeight, 900);
            iframe.style.height = h + "px";
            wrapper.style.height = h * SCALE + "px";
          }
        } catch {}
        ticking = false;
      });
    };

    iframe.addEventListener("load", resize);
    return () => iframe.removeEventListener("load", resize);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: CONTENT_W * SCALE + "px",
        height: "900px",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={ref}
        src="/desa-kreatif-gampongnusa.html"
        style={{
          width: CONTENT_W + "px",
          height: "900px",
          border: "none",
        }}
        title="Desa Kreatif Gampong Nusa"
      />
    </div>
  );
}
