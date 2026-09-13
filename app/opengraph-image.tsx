import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/content";
import { ru } from "@/content/i18n";

export const alt = `${site.name} – ${site.descriptor}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Размер знака в картинке. Задаётся стилями — satori считает размер по ним. */
const MARK_SIZE = 360;

/**
 * Open Graph картинка для всех страниц.
 *
 * Рисуется из той же геометрии знака (components/brand/geometry.ts) и той же
 * палитры, что и сайт: ссылка в мессенджере выглядит продолжением сайта,
 * а при правке логотипа картинка обновится сама.
 *
 * Шрифты берём из app/og-fonts: satori внутри next/og читает ttf/otf/woff,
 * но не woff2, которым мы раздаём шрифты в браузер. Латиницу закрывает
 * Space Grotesk, кириллицу — Manrope, ровно как в интерфейсе.
 * Файлы кладёт scripts/sync-fonts.mjs.
 */
async function loadFont(file: string) {
  return readFile(join(process.cwd(), "app", "og-fonts", file));
}

export default async function Image() {
  const [display700, display500, cyr700, cyr500] = await Promise.all([
    loadFont("space-grotesk-700.woff"),
    loadFont("space-grotesk-500.woff"),
    loadFont("manrope-700.woff"),
    loadFont("manrope-500.woff"),
  ]);


  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#141824",
          // Тот же приём, что в hero: пятно бренда за знаком, без картинок.
          backgroundImage:
            "radial-gradient(circle at 78% 45%, rgba(43,127,255,0.28), rgba(20,24,36,0) 55%)",
          // Стек, а не одна гарнитура: кириллицу закрывает Manrope.
          fontFamily: "Display, Cyrillic",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 660 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 3,
                borderRadius: 999,
                backgroundImage: "linear-gradient(135deg,#00E0F0,#2B7FFF,#6B3BF5)",
              }}
            />
            <span
              style={{
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 3,
                color: "#8B92A8",
                textTransform: "uppercase",
              }}
            >
              {site.name}
            </span>
          </div>

          <span
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -2.4,
              color: "#FFFFFF",
            }}
          >
            {ru.hero.title}
          </span>

          <span style={{ fontSize: 26, fontWeight: 500, color: "#8B92A8" }}>
            {ru.hero.coverage}
          </span>
        </div>

        {/* Знак: кольцо с градиентом бренда и диагональный хвост.
            Рисуется стилями, а не файлом: satori не встраивает PNG. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: MARK_SIZE,
            height: MARK_SIZE,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: MARK_SIZE,
              background: "linear-gradient(135deg, #56E2F5 0%, #22D3EE 26%, #2B8DFF 66%, #7C3AED 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 62,
              borderRadius: MARK_SIZE,
              background: "#0B1622",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 34,
              bottom: 28,
              width: 150,
              height: 56,
              borderRadius: 28,
              transform: "rotate(42deg)",
              background: "linear-gradient(135deg, #22D3EE 0%, #7C3AED 100%)",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Display", data: display700, weight: 700, style: "normal" },
        { name: "Display", data: display500, weight: 500, style: "normal" },
        { name: "Cyrillic", data: cyr700, weight: 700, style: "normal" },
        { name: "Cyrillic", data: cyr500, weight: 500, style: "normal" },
      ],
    },
  );
}
