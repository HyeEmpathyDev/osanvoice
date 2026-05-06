interface Word {
  text: string;
  count: number;
}

export function WordCloud({ words }: { words: Word[] }) {
  if (words.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-12">
        아직 키워드를 추출하기에 의견이 부족합니다.
      </p>
    );
  }

  const max = Math.max(...words.map((w) => w.count));
  const min = Math.min(...words.map((w) => w.count));
  const range = max - min || 1;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 p-4">
      {words.map((w) => {
        const t = (w.count - min) / range;
        const fontSize = 14 + t * 26;
        const opacity = 0.55 + t * 0.45;
        const isHot = t > 0.66;
        const color = isHot ? "#003b8e" : t > 0.33 ? "#1a2654" : "#4b5563";
        return (
          <span
            key={w.text}
            title={`${w.count}회 언급`}
            className="font-black tracking-tight inline-block"
            style={{ fontSize: `${fontSize}px`, color, opacity }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
}
