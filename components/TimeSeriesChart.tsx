interface Point {
  label: string;
  value: number;
}

export function TimeSeriesChart({ data }: { data: Point[] }) {
  const W = 720;
  const H = 200;
  const PAD_X = 32;
  const PAD_Y = 24;
  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_Y * 2;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const points = data.map((d, i) => ({
    x: PAD_X + i * stepX,
    y: PAD_Y + innerH - (d.value / maxVal) * innerH,
    ...d,
  }));
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${path} L ${points[points.length - 1]?.x.toFixed(1)} ${PAD_Y + innerH} L ${PAD_X} ${PAD_Y + innerH} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto min-w-[480px]"
        role="img"
        aria-label="최근 14일 시민의견 추이"
      >
        <defs>
          <linearGradient id="ts-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#003b8e" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#003b8e" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((r) => (
          <line
            key={r}
            x1={PAD_X}
            x2={W - PAD_X}
            y1={PAD_Y + innerH * r}
            y2={PAD_Y + innerH * r}
            stroke="#e5e7eb"
            strokeDasharray="2 4"
          />
        ))}
        <path d={area} fill="url(#ts-fill)" />
        <path
          d={path}
          fill="none"
          stroke="#003b8e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="3.5"
              fill="#fff"
              stroke="#003b8e"
              strokeWidth="2"
            />
            {p.value > 0 && (
              <text
                x={p.x}
                y={p.y - 9}
                fontSize="10"
                fontWeight="800"
                textAnchor="middle"
                fill="#003b8e"
              >
                {p.value}
              </text>
            )}
          </g>
        ))}
        {points.map((p, i) =>
          i % 2 === 0 || i === points.length - 1 ? (
            <text
              key={`label-${i}`}
              x={p.x}
              y={H - 6}
              fontSize="9.5"
              textAnchor="middle"
              fill="#9ca3af"
              fontWeight="700"
            >
              {p.label}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}
