import { DsSection } from "../_components/DsSection";
import { Logo } from "@/components/brand";
import { GradientBlobs } from "@/components/motion";

/**
 * Знак и логотип. Оба берутся из исходных файлов бренда, а не рисуются кодом:
 * /public/logo_website.png — полный логотип, /public/logo_q.png — только знак.
 */
export function BrandSection() {
  return (
    <DsSection
      index="01"
      title="Знак и логотип"
      note="Исходники лежат в /public. Знак не пересобирается кодом – на сайте показывается тот же файл, что уходит в соцсети и печать."
    >
      <div className="flex flex-col gap-10">
        <div className="sky-panel relative flex items-center justify-center overflow-hidden p-14">
          <GradientBlobs />
          <div className="relative scale-[2.2]">
            <Logo variant="mark" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="surface flex flex-col gap-4 p-6">
            <p className="text-fg-2 text-caption">Только знак</p>
            <Logo variant="mark" />
          </div>

          <div className="surface flex flex-col gap-4 p-6">
            <p className="text-fg-2 text-caption">Полный логотип</p>
            <Logo />
          </div>
        </div>
      </div>
    </DsSection>
  );
}
