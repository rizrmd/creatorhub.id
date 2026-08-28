import { useEffect, useRef } from "react";

export default function DesaKreatifDetail() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = ref.current;
    if (!iframe) return;
    const handler = () => {
      try {
        const doc = iframe.contentDocument;
        if (doc && doc.body) {
          iframe.style.height = doc.body.scrollHeight + "px";
        }
      } catch {}
    };
    iframe.addEventListener("load", handler);
    return () => iframe.removeEventListener("load", handler);
  }, []);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#0a0e17" }}>
      <iframe
        ref={ref}
        src="/desa-kreatif-gampongnusa.html"
        style={{
          width: "1440px",
          height: "900px",
          border: "none",
          transformOrigin: "top left",
          transform: "scale(1)",
        }}
        title="Desa Kreatif Gampong Nusa"
      />
    </div>
  );
}
