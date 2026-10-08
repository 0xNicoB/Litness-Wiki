import { getCollection, type CollectionEntry } from "astro:content";
import categories from "../data/categories.json";
export { categories };
export type Article = CollectionEntry<"docs">;
export const articleUrl = (id: string) => `/wiki/${id}/`;
export const categoryUrl = (id: string) => `/categorie/${id}/`;
export const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
export const numberLabel = (value: number) =>
  new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
export const statusLabels: Record<string, string> = {
  ufficiale: "Fonte ufficiale",
  osservato: "Osservato",
  riferito: "Evidenze da allegare",
  calcolato: "Calcolato",
  ipotesi: "Ipotesi",
  "da-verificare": "Da verificare",
  superato: "Superato",
};
export async function articles() {
  return (await getCollection("docs")).sort(
    (a, b) =>
      categories.findIndex((c) => c.id === a.data.category) -
        categories.findIndex((c) => c.id === b.data.category) ||
      a.data.order - b.data.order ||
      a.id.localeCompare(b.id),
  );
}
