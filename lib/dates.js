export function rupiah(n) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Number(n) || 0);
}

// Parse tanggal KTP: "5 Nov", "5 November", "besok"/"lusa"/"minggu depan"/"+30 hari"/"2026-11-05"
const BULAN = ["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"];

export function parseDue(text) {
  const t = String(text || "").toLowerCase().trim();
  if (!t) return null;

  const today = new Date();
  if (/besok/.test(t)) return addDays(today, 1);
  if (/lusa/.test(t)) return addDays(today, 2);
  if (/minggu depan/.test(t)) return addDays(today, 7);

  const rel = t.match(/\+?(\d+)\s*hari/);
  if (rel) return addDays(today, Number(rel[1]));

  const iso = t.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));

  // "5 Nov" / "5 November"
  const m = t.match(/(\d{1,2})\s+([a-z]+)/);
  if (m) {
    const b = BULAN.findIndex((x) => x.startsWith(m[2]));
    if (b >= 0) {
      const d = new Date(Date.UTC(today.getUTCFullYear(), b, Number(m[1])));
      if (d < today) d.setUTCFullYear(d.getUTCFullYear() + 1);
      return d;
    }
  }
  return null;
}

function addDays(d, n) {
  return new Date(d.getTime() + n * 86400_000);
}

export function tanggalID(d) {
  if (!d) return "-";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" });
}
