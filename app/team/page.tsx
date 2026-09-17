import type { Metadata } from "next";
import { PageIntro } from "@/components/layout";
import { TeamGrid } from "@/components/team";
import { CtaSection } from "@/components/home";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageSeo } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: pageSeo.team.title,
  description: pageSeo.team.description,
  alternates: { canonical: "/team" },
  openGraph: {
    title: pageSeo.team.title,
    description: pageSeo.team.description,
    url: "/team",
  },
};

/** Команда: шесть человек одной сеткой, каждый раскрывается на месте. */
export default function TeamPage() {
  // Счётчик считается от опубликованных карточек, а не от длины массива.
  const published = ru.team.members.filter((member) => member.published).length;

  return (
    <>
      <PageIntro
        section="team"
        aside={
          <p className="text-small lg:text-right">
            {published} {ru.team.countLabel}. {ru.team.aside}
          </p>
        }
      />

      <TeamGrid />

      <CtaSection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", path: "/" },
          { name: ru.team.intro.eyebrow, path: "/team" },
        ])}
      />
    </>
  );
}
