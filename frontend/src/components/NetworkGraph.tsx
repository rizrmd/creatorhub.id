import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { creatorsApi } from "@/lib/api";
import type { Creator } from "@/types";

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  r: number;
  image: string;
  followers: number;
  isCenter: boolean;
}

interface Edge {
  from: string;
  to: string;
}

function getHueForId(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export default function NetworkGraph({ creator }: { creator: Creator }) {
  const { data: relatedData } = useQuery({
    queryKey: ["creators", { city: creator.city, pageSize: 12, verified: true }],
    queryFn: () =>
      creatorsApi.list({ city: creator.city, pageSize: 12, verified: true }),
    staleTime: 60_000,
  });

  const { data: categoryData } = useQuery({
    queryKey: ["creators", { category: creator.category.split(",")[0]?.trim(), pageSize: 8, verified: true }],
    queryFn: () =>
      creatorsApi.list({ category: creator.category.split(",")[0]?.trim(), pageSize: 8, verified: true }),
    staleTime: 60_000,
  });

  const { nodes, edges, width, height } = useMemo(() => {
    const w = 800;
    const h = 500;
    const cx = w / 2;
    const cy = h / 2;

    const related = relatedData?.data ?? [];
    const category = categoryData?.data ?? [];
    const allRelated = [...related, ...category].filter(
      (c) => c.id !== creator.id
    );
    // dedupe by id
    const seen = new Set<string>();
    const uniqueRelated = allRelated.filter((c) => {
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });
    const neighbors = uniqueRelated.slice(0, 10);

    const centerNode: Node = {
      id: creator.id,
      name: creator.name,
      x: cx,
      y: cy,
      r: 36,
      image: creator.imageUrl || "",
      followers: creator.followers,
      isCenter: true,
    };

    const nodeMap = new Map<string, Node>();
    nodeMap.set(centerNode.id, centerNode);

    const edges: Edge[] = [];
    const angleStep = (2 * Math.PI) / Math.max(neighbors.length, 1);

    neighbors.forEach((n, i) => {
      const angle = angleStep * i - Math.PI / 2;
      const dist = 140 + (n.followers > 100000 ? 30 : 0);
      const node: Node = {
        id: n.id,
        name: n.name,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        r: Math.max(16, Math.min(28, 10 + Math.log10(Math.max(n.followers, 1)) * 4)),
        image: n.imageUrl || "",
        followers: n.followers,
        isCenter: false,
      };
      nodeMap.set(n.id, node);
      edges.push({ from: centerNode.id, to: n.id });

      // add some second-degree connections
      if (i < neighbors.length - 1) {
        edges.push({ from: n.id, to: neighbors[(i + 1) % neighbors.length].id });
      }
    });

    return { nodes: Array.from(nodeMap.values()), edges, width: w, height: h };
  }, [creator, relatedData, categoryData]);

  return (
    <div className="w-full overflow-hidden rounded-xl" style={{ background: "#0B1120" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ minHeight: 360 }}
      >
        {/* Edges */}
        {edges.map((e, i) => {
          const from = nodes.find((n) => n.id === e.from);
          const to = nodes.find((n) => n.id === e.to);
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const hue = getHueForId(n.id);
          const borderColor = `hsl(${hue}, 60%, 50%)`;
          return (
            <g key={n.id}>
              {/* outer ring */}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 3}
                fill="none"
                stroke={borderColor}
                strokeWidth={2}
                opacity={0.6}
              />
              {/* clip path */}
              <defs>
                <clipPath id={`clip-${n.id}`}>
                  <circle cx={n.x} cy={n.y} r={n.r} />
                </clipPath>
              </defs>
              {/* photo or fallback */}
              {n.image ? (
                <image
                  href={n.image}
                  x={n.x - n.r}
                  y={n.y - n.r}
                  width={n.r * 2}
                  height={n.r * 2}
                  clipPath={`url(#clip-${n.id})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={`hsl(${hue}, 40%, 25%)`}
                />
              )}
              {/* fallback letter if no image */}
              {!n.image && (
                <text
                  x={n.x}
                  y={n.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  fontSize={n.r * 0.7}
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  {n.name[0]}
                </text>
              )}
              {/* name label */}
              <text
                x={n.x}
                y={n.y + n.r + 14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.6)"
                fontSize={n.isCenter ? 11 : 9}
                fontWeight={n.isCenter ? "bold" : "normal"}
                style={{ pointerEvents: "none" }}
              >
                {n.name.length > 16 ? n.name.slice(0, 14) + "…" : n.name}
              </text>
              {/* center glow */}
              {n.isCenter && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 6}
                  fill="none"
                  stroke={borderColor}
                  strokeWidth={1}
                  opacity={0.3}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
