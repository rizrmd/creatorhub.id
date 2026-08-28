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

    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "dc-resize" && typeof e.data.h === "number") {
        const h = Math.max(e.data.h, 900);
        iframe.style.height = h + "px";
        wrapper.style.height = h * SCALE + "px";
      }
    };

    const onLoad = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc && doc.body) {
          const h = Math.max(doc.body.scrollHeight, 900);
          iframe.style.height = h + "px";
          wrapper.style.height = h * SCALE + "px";
        }
      } catch {}
    };

    iframe.addEventListener("load", onLoad);
    window.addEventListener("message", onMsg);
    return () => {
      iframe.removeEventListener("load", onLoad);
      window.removeEventListener("message", onMsg);
    };
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
