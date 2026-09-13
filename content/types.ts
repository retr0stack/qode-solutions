/* ============================================================================
   Типы контента. Ни одна строка текста не живёт в компонентах – только здесь
   и в файлах рядом. Компоненты принимают эти типы и ничего не знают о языке.
   ========================================================================= */

/** Поддерживаемые локали. Сам i18n ещё не подключён – см. content/README.md. */
export type Locale = "ru" | "kk" | "en";

export interface LinkItem {
  readonly label: string;
  readonly href: string;
  /** Внешняя ссылка – открывается в новой вкладке с rel="noopener". */
  readonly external?: boolean;
}

/* --- Услуги ---------------------------------------------------------------- */

export interface ServiceItem {
  readonly title: string;
  readonly description: string;
}

export interface ServiceSection {
  /** Часть URL для будущего /services/[slug]. Только латиница и дефисы. */
  readonly slug: string;
  readonly section: string;
  /** Короткая строка под заголовком раздела в sticky-навигации. */
  readonly summary: string;
  readonly items: readonly ServiceItem[];
}

/* --- Главная --------------------------------------------------------------- */

export interface HeroContent {
  readonly title: string;
  readonly subtitle: string;
  readonly primaryCta: LinkItem;
  readonly secondaryCta: LinkItem;
}

/** Карточка направления. `featured` – крупная плитка (Сайты). */
export interface DirectionCard {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly featured?: boolean;
}

export interface ProcessStep {
  readonly index: number;
  readonly title: string;
  readonly description: string;
  /** Ориентировочный срок – показывается мелким текстом под шагом. */
  readonly duration: string;
}

export interface Advantage {
  readonly title: string;
  readonly description: string;
}

export interface StackGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

/** Заголовочный блок секции: надзаголовок, заголовок, лид. */
export interface SectionIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
}

/* --- Команда --------------------------------------------------------------- */

export interface TeamMember {
  readonly slug: string;
  readonly name: string;
  readonly role: string;
  /** 2–3 строки о бэкграунде. Каждая строка – отдельный абзац. */
  readonly bio: readonly string[];
  readonly photo: {
    readonly src: string;
    readonly alt: string;
  };
  readonly links: readonly LinkItem[];
}

/* --- Кейсы (портфолио пока пустое, тип готов) ------------------------------ */

export interface CaseStudy {
  readonly slug: string;
  readonly client: string;
  readonly title: string;
  readonly summary: string;
  readonly year: number;
  readonly tags: readonly string[];
  /**
   * Обложка. Пока настоящих снимков нет, поле необязательное: карточка
   * рисует фирменную абстрактную заливку по палитре ниже. Как только
   * появится файл, достаточно дописать сюда src и alt.
   */
  readonly cover?: {
    readonly src: string;
    readonly alt: string;
  };
  /** Палитра абстрактной обложки: два цвета фирменного диапазона. */
  readonly palette: readonly [string, string];
  /** Пропорция плитки в сетке – сетка намеренно неровная. */
  readonly ratio: "wide" | "tall" | "square";
  /** Измеримый результат: «конверсия +18%». Показывается на карточке. */
  readonly result?: string;
}

/* --- Формы ----------------------------------------------------------------- */

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

export interface FieldCopy {
  readonly label: string;
  readonly placeholder: string;
  /** Подсказка под полем – не заменяет сообщение об ошибке. */
  readonly hint?: string;
}

/* --- SEO ------------------------------------------------------------------- */

export interface PageSeo {
  readonly title: string;
  readonly description: string;
}
