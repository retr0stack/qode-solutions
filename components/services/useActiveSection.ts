"use client";

import { useEffect, useState } from "react";

/**
 * Какой раздел сейчас читают.
 *
 * IntersectionObserver, а не слушатель скролла: браузер считает пересечения
 * сам, вне главного потока, и на скролле не появляется работы на каждый кадр.
 *
 * rootMargin поднимает «линию чтения» под шапку и отсекает нижние две трети
 * экрана — иначе активными считались бы сразу два раздела.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
