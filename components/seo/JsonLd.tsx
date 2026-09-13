/**
 * Разметка schema.org. Отдаётся сервером в теле страницы —
 * это допустимо и не влияет на CLS, потому что тег не рендерится.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Данные собираются на сервере из /content, пользовательского ввода тут нет.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
