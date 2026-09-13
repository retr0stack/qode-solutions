import { QMark } from "@/components/brand";
import { TechGrid } from "@/components/motion";

/**
 * Заглушка портрета, пока нет фото. Не «битая картинка» и не серый прямоугольник,
 * а тёмная панель со знаком — выглядит намеренно.
 * Как только в content/team.ts появится photo.src, заглушка исчезнет сама.
 */
export function PhotoPlaceholder({ markId }: { markId: string }) {
  return (
    <div
      data-surface="dark"
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <TechGrid fade={false} />
      <QMark id={markId} className="relative w-2/5 opacity-15" />
    </div>
  );
}
