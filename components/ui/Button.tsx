import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

const BASE = [
  "group/btn relative inline-flex items-center justify-center gap-2",
  "font-display font-semibold whitespace-nowrap select-none",
  "rounded-full isolate",
  // Анимируются только transform и opacity — reflow нет.
  "transition-[transform,opacity] duration-200 ease-brand",
  "motion-safe:hover:-translate-y-0.5 active:translate-y-0",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const VARIANTS = {
  /** Основное действие: заливка градиентом бренда, контраст выверен под AA. */
  primary: [
    "text-[color:var(--btn-primary-fg)]",
    "bg-[image:var(--btn-primary-bg)] bg-[length:180%_180%] bg-[position:0%_50%]",
    "motion-safe:hover:bg-[position:100%_50%]",
    "transition-[transform,opacity,background-position] duration-500",
  ].join(" "),
  /** Второстепенное: градиент появляется рамкой в 1px при наведении. */
  secondary: [
    "text-[color:var(--btn-secondary-fg)] bg-[color:var(--btn-secondary-bg)]",
    "border border-line border-gradient",
    "hover:border-gradient-on focus-visible:border-gradient-on",
  ].join(" "),
  /** Текстовое действие с градиентным подчёркиванием. */
  ghost: "text-fg rounded-none",
} as const;

const SIZES = {
  md: "h-11 px-6 text-small",
  lg: "h-13 px-8 text-body",
} as const;

interface OwnProps {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}

type AnchorProps = OwnProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof OwnProps> & { href: string };

type NativeProps = OwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof OwnProps> & { href?: undefined };

export type ButtonProps = AnchorProps | NativeProps;

function buttonClasses({ variant = "primary", size = "md", className }: OwnProps) {
  return cn(BASE, VARIANTS[variant], variant !== "ghost" && SIZES[size], className);
}

/** Градиентное подчёркивание для варианта ghost — растёт от левого края. */
function GhostUnderline() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[image:var(--gradient-brand)]",
        "scale-x-0 transition-transform duration-300 ease-brand",
        "group-hover/btn:scale-x-100 group-focus-visible/btn:scale-x-100",
      )}
    />
  );
}

const EXTERNAL = /^(https?:|mailto:|tel:)/;

function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...rest
}: AnchorProps) {
  const isExternal = EXTERNAL.test(href);

  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, className, children })}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {variant === "ghost" ? <GhostUnderline /> : null}
    </Link>
  );
}

function ButtonNative({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: NativeProps) {
  return (
    <button className={buttonClasses({ variant, size, className, children })} {...rest}>
      {children}
      {variant === "ghost" ? <GhostUnderline /> : null}
    </button>
  );
}

/**
 * Кнопка и кнопка-ссылка в одном компоненте: наличие href решает,
 * что отрендерится — <Link> или <button>.
 *
 * Magnetic-эффект не встроен намеренно — оборачивайте в <Magnetic> там,
 * где он нужен, чтобы кнопка оставалась серверным компонентом по умолчанию.
 */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) return <ButtonLink {...props} />;
  return <ButtonNative {...props} />;
}
