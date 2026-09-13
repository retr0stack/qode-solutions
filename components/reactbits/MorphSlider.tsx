"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

export interface MorphItem {
  image: string;
  caption: string;
  meta?: string;
}

interface MorphSliderProps {
  items: readonly MorphItem[];
  duration?: number;
  intensity?: number;
  scale?: number;
  aberration?: number;
  drift?: number;
  /** Подпись группы для скринридера — приходит из словаря. */
  label?: string;
  className?: string;
}

const vertexShader = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/*
 * Шейдер перехода. Из четырёх режимов оригинала оставлен один — melt:
 * плавное растекание одного кадра в другой по шуму fbm. Остальные
 * (ripple, shear, swirl) заметно резче и на портретах людей выглядят как
 * дефект изображения, а не как переход.
 *
 * uOverlay подкрашивает виньетку в --color-ink, поэтому слайдер не
 * выпадает из палитры.
 */
const fragmentShader = /* glsl */ `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec3 uOverlay;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) { s.y = 1.0 / ratio; } else { s.x = ratio; }
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;
  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    float nn = fbm(uv * uScale + uTime * 0.03);
    float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
    vec2 g = vec2(nn, warp) - 0.5;
    uvC = uv + g * uIntensity * 0.5 * p;
    uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
    m = smoothstep(nn - 0.15, nn + 0.15, p);
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(
    texture2D(tCurrent, sC + vec2(ca, 0.0)).r,
    texture2D(tCurrent, sC).g,
    texture2D(tCurrent, sC - vec2(ca, 0.0)).b
  );
  vec3 colN = vec3(
    texture2D(tNext, sN + vec2(ca, 0.0)).r,
    texture2D(tNext, sN).g,
    texture2D(tNext, sN - vec2(ca, 0.0)).b
  );

  vec3 col = mix(colC, colN, m);

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(col, uOverlay, (1.0 - vig) * 0.3);

  gl_FragColor = vec4(col, 1.0);
}
`;

function fallbackTexture(gl: ConstructorParameters<typeof Texture>[0]) {
  const size = 4;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i += 1) {
    data[i * 4] = 16;
    data[i * 4 + 1] = 32;
    data[i * 4 + 2] = 46;
    data[i * 4 + 3] = 255;
  }
  return new Texture(gl, { image: data, width: size, height: size, generateMipmaps: false });
}

/**
 * Морф-слайдер. Порт компонента React Bits morph-slider.
 *
 * Что изменено против оригинала:
 *   • оставлен один режим перехода вместо четырёх (см. комментарий у шейдера);
 *   • виньетка красится в --color-ink, подписи оформлены типографикой сайта;
 *   • подпись получила вторую строку под роль человека;
 *   • контекст создаётся только когда блок попал во вьюпорт, и rAF
 *     останавливается, когда блок ушёл или вкладка неактивна: держать
 *     WebGL-цикл живым на телефоне ради секции, которую не видно, —
 *     прямой расход батареи.
 *
 * Слайдер листается свайпом, кнопками и стрелками с клавиатуры.
 * Автопрокрутки нет: под пальцем она всегда мешает.
 */
export function MorphSlider({
  items,
  duration = 1.1,
  intensity = 0.55,
  scale = 2.4,
  aberration = 0.3,
  drift = 0.4,
  label,
  className,
}: MorphSliderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<{
    next: () => void;
    prev: () => void;
    destroy: () => void;
    beginDrag: () => boolean;
    drag: (n: number) => void;
    endDrag: () => void;
  } | null>(null);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host || items.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.className = "ms-canvas";
    stage.appendChild(canvas);

    const textures = items.map(() => fallbackTexture(gl));
    const sizes: [number, number][] = items.map(() => [1, 1]);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: textures[0] },
        tNext: { value: textures[0] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: sizes[0] },
        uNextSize: { value: sizes[0] },
        uProgress: { value: 0 },
        uIntensity: { value: intensity },
        uScale: { value: scale },
        uAberration: { value: aberration },
        uDrift: { value: drift },
        uTime: { value: 0 },
        uReduce: { value: reduced ? 1 : 0 },
        // --color-ink = #10202e
        uOverlay: { value: [0.063, 0.125, 0.18] },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let current = 0;
    let animating = false;
    let dragging = false;
    let dragDir = 0;
    let tween: gsap.core.Tween | null = null;
    let raf = 0;
    let visible = true;

    items.forEach((item, i) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.src = item.image;
      img.onload = () => {
        const texture = new Texture(gl, { generateMipmaps: false });
        texture.image = img;
        textures[i] = texture;
        sizes[i] = [img.naturalWidth || 1, img.naturalHeight || 1];
        if (i === current) {
          program.uniforms.tCurrent.value = texture;
          program.uniforms.uCurrentSize.value = sizes[i];
        }
      };
    });

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1));
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };

    const loop = (t: number) => {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf === 0 && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf !== 0) cancelAnimationFrame(raf);
      raf = 0;
    };

    const wrap = (i: number) => ((i % items.length) + items.length) % items.length;

    const prepare = (dir: number) => {
      const target = wrap(current + dir);
      program.uniforms.tCurrent.value = textures[current];
      program.uniforms.uCurrentSize.value = sizes[current];
      program.uniforms.tNext.value = textures[target];
      program.uniforms.uNextSize.value = sizes[target];
      return target;
    };

    const commit = (target: number) => {
      current = target;
      program.uniforms.tCurrent.value = textures[target];
      program.uniforms.uCurrentSize.value = sizes[target];
      program.uniforms.uProgress.value = 0;
      animating = false;
      tween = null;
      setIndex(target);
    };

    const goTo = (dir: number) => {
      if (animating || dragging || items.length < 2) return;
      const target = prepare(dir);
      animating = true;
      setIndex(target);
      tween = gsap.fromTo(
        program.uniforms.uProgress,
        { value: 0 },
        {
          value: 1,
          duration: reduced ? 0.3 : duration,
          ease: "power2.inOut",
          onComplete: () => commit(target),
        },
      );
    };

    engineRef.current = {
      next: () => goTo(1),
      prev: () => goTo(-1),
      beginDrag: () => {
        if (animating || items.length < 2) return false;
        dragging = true;
        dragDir = 0;
        return true;
      },
      drag: (ndx: number) => {
        if (!dragging) return;
        const dir = ndx < 0 ? 1 : -1;
        if (dir !== dragDir) {
          dragDir = dir;
          prepare(dir);
        }
        program.uniforms.uProgress.value = Math.min(Math.abs(ndx), 1);
      },
      endDrag: () => {
        if (!dragging) return;
        dragging = false;
        if (dragDir === 0) return;
        const p = program.uniforms.uProgress.value as number;
        const target = wrap(current + dragDir);
        animating = true;
        if (p > 0.4) {
          setIndex(target);
          tween = gsap.to(program.uniforms.uProgress, {
            value: 1,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => commit(target),
          });
        } else {
          tween = gsap.to(program.uniforms.uProgress, {
            value: 0,
            duration: 0.45,
            ease: "power2.out",
            onComplete: () => {
              animating = false;
              tween = null;
            },
          });
        }
      },
      destroy: () => {},
    };

    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(host);

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);

    start();

    return () => {
      stop();
      tween?.kill();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.parentNode?.removeChild(canvas);
      engineRef.current = null;
    };
  }, [items, duration, intensity, scale, aberration, drift]);

  // Свайп пальцем и перетаскивание мышью.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    let startX = 0;
    let width = 1;
    let active = false;

    const onDown = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      width = rect.width || 1;
      startX = event.clientX;
      active = engineRef.current?.beginDrag() ?? false;
      if (active) el.setPointerCapture?.(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!active) return;
      engineRef.current?.drag((event.clientX - startX) / width);
    };
    const onUp = () => {
      if (!active) return;
      active = false;
      engineRef.current?.endDrag();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      engineRef.current?.next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      engineRef.current?.prev();
    }
  }, []);

  return (
    <div ref={hostRef} className={cn("ms-root", className)}>
      <div
        ref={stageRef}
        className="ms-stage"
        role="group"
        aria-roledescription="карусель"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
      />

      {/* Подпись. Все варианты лежат друг на друге в одной ячейке грида,
          поэтому высота блока не скачет при смене слайда. */}
      <div className="pointer-events-none absolute inset-x-4 bottom-16 z-[2] grid" aria-live="polite">
        {items.map((item, i) => (
          <span
            key={item.caption}
            aria-hidden={i === index ? undefined : true}
            className={cn(
              "col-start-1 row-start-1 flex flex-col gap-0.5 justify-self-start rounded-[var(--radius-md,0.75rem)] bg-[color:var(--color-ink)]/55 px-4 py-2.5 backdrop-blur-md",
              "transition-[opacity,transform,filter] duration-500 ease-brand",
              i === index ? "opacity-100 blur-0" : "translate-y-3 opacity-0 blur-[6px]",
            )}
          >
            <span className="font-display text-small font-bold text-[color:var(--color-paper)]">
              {item.caption}
            </span>
            {item.meta ? (
              <span className="text-caption text-[color:var(--color-muted)]">{item.meta}</span>
            ) : null}
          </span>
        ))}
      </div>

      <div className="absolute inset-x-0 top-1/2 z-[3] flex -translate-y-1/2 justify-between px-4">
        {(["prev", "next"] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            aria-label={dir === "prev" ? "Предыдущий" : "Следующий"}
            onClick={() => (dir === "prev" ? engineRef.current?.prev() : engineRef.current?.next())}
            className="pointer-events-auto inline-flex size-10 items-center justify-center rounded-full border border-white/25 bg-[color:var(--color-ink)]/45 text-[color:var(--color-paper)] backdrop-blur-md transition-transform duration-200 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden="true">
              <path
                d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-5 z-[3] flex justify-center gap-2">
        {items.map((item, i) => (
          <span
            key={item.caption}
            aria-hidden="true"
            className={cn(
              "h-1.5 rounded-full transition-all duration-400",
              i === index ? "w-6 bg-[image:var(--gradient-brand)]" : "w-1.5 bg-white/35",
            )}
          />
        ))}
      </div>
    </div>
  );
}
