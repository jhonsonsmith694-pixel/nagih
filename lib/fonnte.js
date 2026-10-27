// Adapter Fonnte (unofficial WhatsApp gateway).
// Kontrak: sendMessage(target, text) -> hasil API.
// Kalau nanti pindah ke Twilio/official, buat providers/twilio.js dengan kontrak yang sama.
export async function sendMessage(target, message) {
  const token = process.env.FONNTE_TOKEN;
  if (!token) throw new Error("FONNTE_TOKEN belum di-set di .env.local");

  const body = new URLSearchParams({ target: String(target), message: String(message) });
  const res = await fetch("https://api.fonnte.com/send", {
    method: "POST",
    headers: { Authorization: token },
    body,
    signal: AbortSignal.timeout(30_000),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status === false) {
    throw new Error(`Fonnte send gagal: HTTP ${res.status} ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}
