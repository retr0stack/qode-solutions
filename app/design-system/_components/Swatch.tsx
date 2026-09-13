import { cn } from "@/lib/cn";

interface SwatchProps {
  name: string;
  token: string;
  hex: string;
  /** Измеренный контраст к своему фону. */
  contrast?: string;
  /** Ограничение по применению — важнее самого цвета. */
  usage: string;
  status?: "ok" | "large-only" | "decorative";
}

const STATUS_LABEL = {
  ok: "AA – текст",
  "large-only": "только крупный текст",
  decorative: "только декор",
} as const;

const STATUS_STYLE = {
  ok: "text-[color:var(--color-violet-ink)]",
  "large-only": "text-fg-2",
  decorative: "text-fg-2",
} as const;

export function Swatch({ name, token, hex, contrast, usage, status = "ok" }: SwatchProps) {
  return (
    <div className="flex flex-col">
      <div
        className="border-line h-20 w-full rounded-md border"
        style={{ backgroundColor: hex }}
      />
      <div className="mt-3 flex flex-col gap-1">
        <span className="text-small font-semibold">{name}</span>
        <code className="text-fg-2 font-mono text-caption">{token}</code>
        <span className="text-fg-2 font-mono text-caption tabular-nums uppercase">
          {hex}
        </span>
        {contrast ? (
          <span className={cn("text-caption tabular-nums", STATUS_STYLE[status])}>
            {contrast} · {STATUS_LABEL[status]}
          </span>
        ) : null}
        <span className="text-fg-2 mt-1 text-caption">{usage}</span>
      </div>
    </div>
  );
}
