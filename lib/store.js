// Simpan invoice + reminder ke file JSON (MVP, tanpa DB).
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const FILE = process.env.NAGIH_STORE || new URL("../data/nagih.json", import.meta.url).pathname;

let db = { invoices: [], counter: 1 };
try {
  if (existsSync(FILE)) db = { ...db, ...JSON.parse(readFileSync(FILE, "utf8")) };
} catch {}

export function save() {
  writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export function db_() {
  return db;
}

export function nextId() {
  const id = `INV-${String(db.counter).padStart(4, "0")}`;
  db.counter++;
  save();
  return id;
}

export function addInvoice(inv) {
  db.invoices.push(inv);
  save();
}

export function findInvoice(id) {
  return db.invoices.find((i) => i.id === id);
}

export function listInvoices({histo=false} = {}) {
  if (histo) return db.invoices;
  return db.invoices.filter((i) => i.status !== "lunas");
}

export function setInvoiceStatus(id, status) {
  const inv = findInvoice(id);
  if (!inv) return null;
  inv.status = status;
  inv.updated_at = new Date().toISOString();
  save();
  return inv;
}
