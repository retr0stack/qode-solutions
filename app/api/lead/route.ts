import { NextResponse } from "next/server";
import { leadSchema, serviceLabel } from "@/lib/lead-schema";

/** Заявки не кэшируются и не пререндерятся. */
export const dynamic = "force-dynamic";

interface LeadPayload {
  name: string;
  contact: string;
  /* Короткая форма спрашивает только имя и контакт, поэтому оба поля
     необязательные — заявка без них полноценна, а не сломана. */
  task?: string;
  service?: string;
  receivedAt: string;
}

/**
 * Отправка заявки в Telegram.
 *
 * TODO: подключить бота.
 *   1. Создать бота через @BotFather, получить токен.
 *   2. Узнать chat_id менеджера или группы (например, через @userinfobot).
 *   3. Заполнить TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в .env.local.
 * Пока переменных нет, функция только пишет заявку в лог сервера
 * и честно сообщает вызывающему, что доставка не настроена.
 */
async function deliverToTelegram(lead: LeadPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "[lead] Telegram не настроен (нет TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID). Заявка только в логе.",
    );
    return false;
  }

  /* Пустые поля в сообщение не попадают: строка «Бюджет: —» в чате только
     мешает читать заявку, пришедшую с короткой формы. */
  const text = [
    "Новая заявка с сайта",
    `Имя: ${lead.name}`,
    `Контакт: ${lead.contact}`,
    lead.service ? `Направление: ${serviceLabel(lead.service)}` : null,
    lead.task ? `Задача: ${lead.task}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
  });

  if (!response.ok) {
    console.error(
      "[lead] Telegram ответил ошибкой",
      response.status,
      await response.text(),
    );
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // Ловушка для ботов сработала — отвечаем как при успехе, чтобы не подсказывать.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const lead: LeadPayload = {
    name: parsed.data.name,
    contact: parsed.data.contact,
    task: parsed.data.task,
    service: parsed.data.service,
    receivedAt: new Date().toISOString(),
  };

  // Лог остаётся и после подключения бота: это резервная копия заявки.
  console.info("[lead]", JSON.stringify(lead));

  try {
    await deliverToTelegram(lead);
  } catch (error) {
    // Заявка уже в логе — не показываем пользователю ошибку из-за доставки.
    console.error("[lead] доставка не удалась", error);
  }

  return NextResponse.json({ ok: true });
}
