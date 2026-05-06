import { ImageResponse } from "next/og";

export const alt = "사회복지협의회로부터 정책제안을 전달받았습니다.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family
    )}:wght@${weight}`,
    {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0",
      },
    }
  ).then((r) => r.text());

  const match = css.match(/url\((.+?)\)\s*format\(['"]?(truetype|opentype|woff)['"]?\)/);
  if (!match) {
    throw new Error(`Font not found: ${family} ${weight}`);
  }
  const fontUrl = match[1].replace(/['"]/g, "");
  const buf = await fetch(fontUrl).then((r) => r.arrayBuffer());
  return buf;
}

export default async function Image() {
  const [black, semibold] = await Promise.all([
    loadGoogleFont("Noto Sans KR", 900),
    loadGoogleFont("Noto Sans KR", 600),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #003b8e 0%, #1a2654 60%, #0a1633 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          color: "white",
          fontFamily: "NotoSansSemi",
        }}
      >
        <div
          style={{
            fontSize: 26,
            opacity: 0.7,
            marginBottom: 36,
            letterSpacing: 10,
          }}
        >
          OSAN VOICE
        </div>
        <div
          style={{
            fontSize: 72,
            lineHeight: 1.2,
            marginBottom: 40,
            fontFamily: "NotoSans",
            letterSpacing: -1.5,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>사회복지협의회로부터</span>
          <span>정책제안을 전달받았습니다.</span>
        </div>
        <div
          style={{
            fontSize: 32,
            opacity: 0.85,
            lineHeight: 1.45,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>함께 잘 사는 오산,</span>
          <span>든든하고 당당한 오산을 만들겠습니다.</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "NotoSans", data: black, style: "normal", weight: 900 },
        { name: "NotoSansSemi", data: semibold, style: "normal", weight: 600 },
      ],
    }
  );
}
