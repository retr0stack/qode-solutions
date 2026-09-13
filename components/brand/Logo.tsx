import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/content";

interface LogoProps {
  /** `full` — полный логотип со словесной частью, `mark` — только знак Q. */
  variant?: "full" | "mark";
  className?: string;
}

/**
 * Логотип-ссылка на главную. Единственная точка правки лого в интерфейсе.
 *
 * Знак больше не собирается кодом: берутся исходные файлы бренда —
 * /public/logo_website.png (полный) и /public/logo_q.png (только знак).
 * Так логотип на сайте всегда совпадает с тем, что уходит в соцсети и печать.
 */
export function Logo({ variant = "full", className }: LogoProps) {
  const mark = variant === "mark";

  return (
    <Link
      href="/"
      aria-label={`${site.name} – на главную`}
      className={cn(
        "group inline-flex items-center rounded-sm transition-opacity",
        "hover:opacity-80 motion-safe:duration-200",
        className,
      )}
    >
      {mark ? (
        <Image
          src="/logo_q.webp"
          alt={site.name}
          width={1254}
          height={1254}
          quality={95}
          sizes="40px"
          className="h-8 w-8 shrink-0 md:h-9 md:w-9"
        />
      ) : (
        <Image
          src="/logo_website.png"
          alt={site.name}
          width={1790}
          height={496}
          sizes="220px"
          className="h-8 w-auto md:h-9"
        />
      )}
    </Link>
  );
}
