function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const services = {
  general: "Általános érdeklődés",
  website: "Weboldal készítés",
  webshop: "Webshop fejlesztés",
  graphics: "Grafikai tervezés",
  support: "Karbantartás és IT támogatás",
};

export async function onRequestPost(context) {
  const { request, env } = context;

  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      const host = new URL(origin).hostname;
      if (host !== "forgrit.hu" && host !== "www.forgrit.hu" && host !== "forgrit.pages.dev") {
        return json({ ok: false, error: "origin_not_allowed" }, 403);
      }
    } catch {
      return json({ ok: false, error: "invalid_origin" }, 403);
    }
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  // Honeypot: bots often fill hidden fields.
  if (clean(data.website, 200)) {
    return json({ ok: true });
  }

  const name = clean(data.name, 100);
  const email = clean(data.email, 160);
  const serviceKey = clean(data.service, 40);
  const message = clean(data.message, 5000);

  if (!name || !email || !message) {
    return json({ ok: false, error: "missing_fields" }, 400);
  }

  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailLooksValid) {
    return json({ ok: false, error: "invalid_email" }, 400);
  }

  if (message.length < 10) {
    return json({ ok: false, error: "message_too_short" }, 400);
  }

  if (!env.EMAIL) {
    console.error("Missing EMAIL binding");
    return json({ ok: false, error: "email_not_configured" }, 500);
  }

  const service = services[serviceKey] || services.general;
  const to = env.CONTACT_TO || "shdwtrggr@gmail.com";
  const from = env.CONTACT_FROM || "website@forgrit.hu";

  const subject = `FORGRIT weboldal – ${service} – ${name}`;

  const text = [
    "Új üzenet érkezett a forgrit.hu kapcsolatfelvételi űrlapjáról.",
    "",
    `Név: ${name}`,
    `Email: ${email}`,
    `Téma: ${service}`,
    "",
    "Üzenet:",
    message,
  ].join("\n");

  const html = `
    <h2>Új üzenet a forgrit.hu oldalról</h2>
    <p><strong>Név:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Téma:</strong> ${escapeHtml(service)}</p>
    <p><strong>Üzenet:</strong></p>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    await env.EMAIL.send({
      to,
      from,
      replyTo: email,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error("Contact email failed", error);
    return json({ ok: false, error: "send_failed" }, 502);
  }

  return json({ ok: true });
}

export function onRequest(context) {
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }

  return json({ ok: false, error: "method_not_allowed" }, 405);
}
