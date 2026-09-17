/* ============================================================================
   Контракт словаря локализации.

   Один интерфейс на все языки: если в ru.ts появилась строка, TypeScript
   потребует её и в kk.ts. Ни одна строка интерфейса не живёт в компонентах –
   только здесь и в файлах словарей рядом.
   ========================================================================= */

export type Locale = "ru" | "kk";

export interface DictLink {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface DictIntro {
  readonly eyebrow: string;
  readonly title: string;
  readonly lead?: string;
}

export interface DictServiceItem {
  /** Стартовая цена: «от 50 000 ₸» либо «обговаривается лично». */
  readonly price: string;
  /** Срок в рабочих днях с момента материалов и предоплаты. */
  readonly duration: string;
  readonly title: string;
  readonly description: string;
}

export interface DictServiceCategory {
  /** Латиницей – это же id якоря и ключ фильтра. */
  readonly slug: string;
  readonly title: string;
  /** Короткая строка под заголовком: чем закрывается направление. */
  readonly tagline: string;
  readonly items: readonly DictServiceItem[];
  /** Приписка под разделом, если она есть (например, «дополнительно к сайтам»). */
  readonly note?: string;
}

export interface DictTeamMember {
  readonly slug: string;
  readonly name: string;
  /** Роль в агентстве. */
  readonly role: string;
  /** Кем работает вне агентства или текущий статус. */
  readonly status: string;
  readonly education: string;
  readonly bio: string;
  readonly skills: readonly string[];
  /** Путь к фото в /public. Файла может не быть – карточка это переживёт. */
  readonly photo: string;
  /**
   * Карточка без имени не рендерится: строка «Имя Фамилия» на живом сайте
   * бьёт по доверию сильнее, чем отсутствие человека в списке.
   */
  readonly published: boolean;
}

export interface DictFounder {
  /** Путь к фото в /public/founders. */
  readonly photo: string;
  readonly slug: string;
  readonly name: string;
  readonly role: string;
  readonly tagline: string;
  readonly bio: readonly string[];
  readonly facts: readonly { readonly label: string; readonly value: string }[];
  readonly photoAlt: string;
}

export interface DictStoryChapter {
  readonly marker: string;
  readonly title: string;
  readonly text: string;
  /** Короткий акцент – крупная цитата или итог главы. */
  readonly accent?: string;
}

export interface Dict {
  readonly meta: {
    readonly htmlLang: string;
    readonly label: string;
    readonly short: string;
  };

  readonly common: {
    readonly skipToContent: string;
    readonly openMenu: string;
    readonly closeMenu: string;
    readonly discuss: string;
    readonly writeWhatsApp: string;
    readonly more: string;
    readonly languageLabel: string;
    readonly toHome: string;
    readonly close: string;
  };

  readonly nav: readonly DictLink[];

  readonly hero: {
    readonly title: string;
    readonly subtitle: string;
    readonly primaryCta: string;
    readonly secondaryCta: string;
    readonly scrollHint: string;
    readonly coverage: string;
    readonly stats: readonly { readonly value: string; readonly label: string }[];
  };

  readonly europe: {
    readonly eyebrow: string;
    readonly title: string;
    readonly lead: string;
  };

  readonly directions: {
    readonly intro: DictIntro;
    readonly items: readonly {
      readonly slug: string;
      readonly title: string;
      readonly description: string;
    }[];
  };

  readonly process: {
    readonly intro: DictIntro;
    readonly steps: readonly {
      readonly title: string;
      readonly description: string;
    }[];
  };

  readonly advantages: {
    readonly intro: DictIntro;
    readonly items: readonly { readonly title: string; readonly description: string }[];
  };

  readonly faq: {
    readonly intro: DictIntro;
    readonly notFound: string;
    readonly items: readonly { readonly question: string; readonly answer: string }[];
  };

  readonly cta: {
    readonly intro: DictIntro;
    readonly whatsappTitle: string;
    readonly whatsappNote: string;
    readonly telegramLabel: string;
    readonly phoneLabel: string;
    readonly emailLabel: string;
    readonly coverageLabel: string;
    /** Заголовок свёрнутого блока с остальными способами связи. */
    readonly otherWays: string;
  };

  readonly services: {
    readonly intro: DictIntro;
    readonly aside: string;
    readonly allLabel: string;
    readonly categoriesLabel: string;
    readonly servicesLabel: string;
    readonly categories: readonly DictServiceCategory[];
    readonly closing: {
      readonly title: string;
      readonly text: string;
      readonly cta: string;
    };
  };

  readonly team: {
    readonly intro: DictIntro;
    readonly aside: string;
    readonly foundersLink: string;
    /** Подпись счётчика: число считается от опубликованных карточек. */
    readonly countLabel: string;
    readonly allLink: string;
    readonly members: readonly DictTeamMember[];
  };

  readonly founders: {
    readonly intro: DictIntro;
    readonly people: readonly DictFounder[];
    readonly photoSlot: string;
    readonly storyIntro: DictIntro;
    readonly chapters: readonly DictStoryChapter[];
    readonly outro: {
      readonly title: string;
      readonly text: string;
      readonly cta: string;
    };
  };

  readonly contacts: {
    readonly intro: DictIntro;
    readonly phoneLabel: string;
    readonly emailLabel: string;
    readonly telegramLabel: string;
    readonly socialsLabel: string;
    readonly coverageTitle: string;
    readonly coverageText: string;
    readonly meetingTitle: string;
    readonly meetingText: string;
    readonly hoursNote: string;
    /** Заголовки свёрнутых блоков на мобильном. */
    readonly channelsTitle: string;
    readonly geographyTitle: string;
  };

  readonly form: {
    readonly title: string;
    readonly lead: string;
    readonly nameLabel: string;
    readonly namePlaceholder: string;
    readonly contactLabel: string;
    readonly contactPlaceholder: string;
    readonly contactHint: string;
    readonly taskLabel: string;
    readonly taskPlaceholder: string;
    readonly serviceLabel: string;
    readonly servicePlaceholder: string;
    readonly serviceHint: string;
    readonly serviceOptions: readonly { readonly value: string; readonly label: string }[];
    readonly submit: string;
    readonly submitting: string;
    readonly reply: string;
    readonly consent: string;
    readonly successTitle: string;
    readonly successText: string;
    readonly sendMore: string;
    readonly errorTitle: string;
    readonly errorText: string;
    readonly honeypot: string;
    readonly validation: {
      readonly nameRequired: string;
      readonly nameTooShort: string;
      readonly contactRequired: string;
      readonly contactInvalid: string;
      readonly taskRequired: string;
      readonly taskTooShort: string;
      readonly serviceRequired: string;
    };
  };

  readonly footer: {
    readonly tagline: string;
    readonly groups: readonly {
      readonly title: string;
      readonly links: readonly DictLink[];
    }[];
    readonly contactTitle: string;
    readonly socialsTitle: string;
  };

  /** Зарубежные клиенты и то, что для них делали. */
  readonly partners: {
    readonly intro: DictIntro;
    readonly items: readonly {
      readonly slug: string;
      readonly name: string;
      /** Отрасль бренда. Чем мы ему помогали – на сайте не раскрывается. */
      readonly field: string;
      /** Страна словом: флаги-эмодзи рисуются системой по-разному и в половине случаев ломают строку. */
      readonly country: string;
    }[];
  };

  readonly cases: {
    readonly intro: DictIntro;
    readonly emptyTitle: string;
    readonly emptyText: string;
    readonly emptyCta: string;
    /** Подписи разделов разбора кейса. */
    readonly problemLabel: string;
    readonly solutionLabel: string;
    readonly deliveredLabel: string;
    readonly ctaLabel: string;
    /** Ссылка с главной на подробные разборы. */
    readonly allLink: string;
  };

  /** Подсказка на стене портфолио: разная для курсора и пальца. */
  readonly portfolioHint: {
    readonly hoverTitle: string;
    readonly hoverText: string;
    readonly tapTitle: string;
    readonly tapText: string;
  };

  /** Тёмная плашка в конце портфолио: часть работ под NDA. */
  readonly portfolioNda: {
    readonly title: string;
    readonly text: string;
    readonly cta: string;
    readonly whatsappText: string;
  };

  readonly notFound: {
    readonly title: string;
    readonly text: string;
    readonly home: string;
    readonly contacts: string;
  };

  readonly whatsapp: {
    readonly aria: string;
    readonly tooltip: string;
    /** Подпись основной кнопки в мобильной нижней панели. */
    readonly barCta: string;
    readonly barNote: string;
  };
}
