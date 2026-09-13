"use client";

import Script from "next/script";
import { useEffect } from "react";
import { YM_ID, track } from "@/lib/analytics";

/**
 * Счётчик Метрики и одна цель, которую нельзя повесить на клик, —
 * глубина просмотра 75%.
 *
 * Скрипт грузится стратегией afterInteractive: он не участвует в LCP и не
 * блокирует первый экран. Если NEXT_PUBLIC_YM_ID не задан, не рендерится
 * ничего — ни тега, ни слушателя.
 */
export function Metrika() {
  useEffect(() => {
    if (!YM_ID) return;

    let fired = false;
    const onScroll = () => {
      if (fired) return;
      const scrollable = document.body.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.75) {
        fired = true;
        track("scroll_75");
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!YM_ID) return null;

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
        (window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
        ym("${YM_ID}","init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
      </Script>

      {/* Пиксель Метрики – обычный img: next/image здесь не нужен и
          не сработает, внутри noscript JavaScript недоступен. */}
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
