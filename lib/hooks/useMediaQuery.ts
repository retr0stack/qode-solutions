"use client";

import { useEffect, useState } from "react";

/** Подписка на медиазапрос. Пример: useMediaQuery("(width >= 64rem)"). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Есть ли у устройства точный указатель — курсор и magnetic только для него. */
export function useHasPointer(): boolean {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** Десктопная раскладка (≥ 1024px) — для упрощённых мобильных сцен. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(width >= 64rem)");
}
