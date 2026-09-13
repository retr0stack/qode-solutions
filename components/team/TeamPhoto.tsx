import Image from "next/image";
import { cn } from "@/lib/cn";
import type { DictTeamMember } from "@/content/i18n";

interface TeamPhotoProps {
  member: DictTeamMember;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Фотография участника команды.
 *
 * Файлы лежат в /public/team и подключаются напрямую. Раньше здесь стоял
 * флаг TEAM_PHOTOS_READY, и пока он был выключен, вместо снимков рисовались
 * заглушки с инициалом — из-за него фотографии и «не прогружались» после
 * того, как файлы положили в папку. Флага больше нет.
 *
 * Люди идут в натуральном цвете, только с лёгкой коррекцией: фирменный
 * дуотон, которым обрабатывались остальные кадры, на портретах делал из
 * человека силуэт.
 */
export function TeamPhoto({
  member,
  className,
  sizes = "(min-width: 1024px) 22rem, 40vw",
  priority = false,
}: TeamPhotoProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-lg)] bg-[color:var(--color-paper-4)]",
        className,
      )}
    >
      <Image
        src={member.photo}
        alt={`${member.name} – ${member.role}`}
        fill
        sizes={sizes}
        priority={priority}
        quality={90}
        className="object-cover [filter:contrast(1.05)_saturate(0.95)]"
      />
    </div>
  );
}
