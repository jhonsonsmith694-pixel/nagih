// Format balasan agent (Markdown) -> format WhatsApp.
// WhatsApp cuma mendukung *bold*, _italic_, ~strike~, ```mono```.
// Heading, tabel, link markdown, dan bullet "* " harus diubah dulu.

function splitRow(line) {
  return line
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((s) => s.trim());
}

function convertTables(text) {
  const lines = text.split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const isRow = lines[i].includes("|");
    const isSeparator =
      i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1]);

    if (isRow && isSeparator) {
      const headers = splitRow(lines[i]);
      i += 2;
      while (i < lines.length && lines[i].includes("|")) {
        const cells = splitRow(lines[i]);
        const parts = cells
          .map((cell, idx) => (headers[idx] ? `${headers[idx]}: ${cell}` : cell))
          .filter(Boolean);
        if (parts.length) out.push(`• ${parts.join(" | ")}`);
        i++;
      }
      continue;
    }

    out.push(lines[i]);
    i++;
  }

  return out.join("\n");
}

export function toWhatsApp(input) {
  let t = String(input || "").replace(/\r\n/g, "\n");

  // Lindungi code fence dulu supaya backtick-nya tidak diubah aturan lain.
  const codeBlocks = [];
  t = t.replace(/```[a-zA-Z0-9_-]*\n?([\s\S]*?)```/g, (_, code) => {
    codeBlocks.push(code.trim());
    return `\u0000CODE${codeBlocks.length - 1}\u0000`;
  });

  // Tabel markdown -> baris bullet.
  t = convertTables(t);

  // Heading -> bold.
  t = t.replace(/^\s{0,3}#{1,6}\s+(.+?)\s*#*\s*$/gm, (_, h) => `*${h.trim()}*`);

  // Bold markdown -> bold WhatsApp.
  t = t.replace(/\*\*(.+?)\*\*/g, "*$1*");
  t = t.replace(/__(.+?)__/g, "*$1*");

  // Strikethrough.
  t = t.replace(/~~(.+?)~~/g, "~$1~");

  // Link markdown -> teks (URL).
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1 ($2)");
  t = t.replace(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g, "$1");

  // Bullet markdown "- ", "* ", "+ " -> "• ".
  // Penting: "* " di awal baris kalau dibiarkan bisa kebaca sebagai bold.
  t = t.replace(/^(\s*)[-*+]\s+/gm, "$1• ");

  // Garis horizontal.
  t = t.replace(/^\s*([-*_])\1{2,}\s*$/gm, "──────────");

  // Blockquote.
  t = t.replace(/^\s*>\s?/gm, "");

  // Inline code -> teks biasa (backtick tunggal tidak selalu dirender).
  t = t.replace(/`([^`\n]+)`/g, "$1");

  // Rapikan baris kosong.
  t = t.replace(/[ \t]+$/gm, "");
  t = t.replace(/\n{3,}/g, "\n\n");

  // Kembalikan code fence sebagai monospace WhatsApp.
  t = t.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => {
    const code = codeBlocks[Number(i)] || "";
    return `\`\`\`\n${code}\n\`\`\``;
  });

  return t.trim();
}
