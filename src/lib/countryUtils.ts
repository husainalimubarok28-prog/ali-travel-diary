import type { City, Country } from "@/types";

type CountryRow = Record<string, unknown>;

export function parseCountry<T extends CountryRow>(data: T): Country {
  return {
    id: String(data.id ?? ""),
    slug: String(data.slug ?? ""),
    name: String(data.name ?? ""),
    nameId: String(data.nameId ?? ""),
    flag: String(data.flag ?? ""),
    continent: String(data.continent ?? ""),
    description: String(data.description ?? ""),
    heroImage: String(data.heroImage ?? ""),
    visited: String(data.visited ?? ""),
    duration: String(data.duration ?? ""),
    budget: Number(data.budget ?? 0),
    cities: (data.cities as Country["cities"]) || [],
    gallery: (data.gallery as Country["gallery"]) || [],
    video: String(data.video ?? ""),
    coordinates: JSON.parse(String(data.coordinates ?? "[]")),
    story: String(data.story ?? ""),
    transport: JSON.parse(String(data.transport ?? "[]")),
    visa: String(data.visa ?? ""),
    visaCost: Number(data.visaCost ?? 0),
    documents: JSON.parse(String(data.documents ?? "[]")),
    tips: JSON.parse(String(data.tips ?? "[]")),
    budgetBreakdown: JSON.parse(String(data.budgetBreakdown ?? "[]")),
    food: JSON.parse(String(data.food ?? "[]")),
    accommodation: JSON.parse(String(data.accommodation ?? "[]")),
    internet: String(data.internet ?? ""),
    simCard: String(data.simCard ?? ""),
    money: String(data.money ?? ""),
    safety: String(data.safety ?? ""),
    mosque: JSON.parse(String(data.mosque ?? "[]")),
    halalFood: String(data.halalFood ?? ""),
    bestExperience: String(data.bestExperience ?? ""),
    worstExperience: String(data.worstExperience ?? ""),
    travelTips: JSON.parse(String(data.travelTips ?? "[]")),
    mistakes: JSON.parse(String(data.mistakes ?? "[]")),
    hiddenGems: JSON.parse(String(data.hiddenGems ?? "[]")),
    ratings: JSON.parse(String(data.ratings ?? "{}")),
  };
}

export function serializeCountry(c: Country): Record<string, unknown> {
  return {
    slug: c.slug,
    name: c.name,
    nameId: c.nameId,
    flag: c.flag,
    continent: c.continent,
    description: c.description,
    heroImage: c.heroImage,
    visited: c.visited,
    duration: c.duration,
    budget: c.budget,
    story: c.story,
    content: "",
    coordinates: JSON.stringify(c.coordinates ?? []),
    video: c.video || "",
    transport: JSON.stringify(c.transport ?? []),
    visa: c.visa,
    visaCost: c.visaCost,
    documents: JSON.stringify(c.documents ?? []),
    tips: JSON.stringify(c.tips ?? []),
    budgetBreakdown: JSON.stringify(c.budgetBreakdown ?? []),
    food: JSON.stringify(c.food ?? []),
    accommodation: JSON.stringify(c.accommodation ?? []),
    internet: c.internet,
    simCard: c.simCard,
    money: c.money,
    safety: c.safety,
    mosque: JSON.stringify(c.mosque ?? []),
    halalFood: c.halalFood,
    bestExperience: c.bestExperience,
    worstExperience: c.worstExperience,
    travelTips: JSON.stringify(c.travelTips ?? []),
    mistakes: JSON.stringify(c.mistakes ?? []),
    hiddenGems: JSON.stringify(c.hiddenGems ?? []),
    ratings: JSON.stringify(c.ratings ?? {}),
  };
}

export function parseCity<T extends Record<string, unknown>>(data: T): City {
  return {
    id: String(data.id ?? ""),
    slug: String(data.slug ?? ""),
    name: String(data.name ?? ""),
    countrySlug: String(data.countrySlug ?? ""),
    countryName: String(data.countryName ?? ""),
    description: String(data.description ?? ""),
    heroImage: String(data.heroImage ?? ""),
    gallery: [],
    coordinates: [0, 0],
    budget: Number(data.budget ?? 0),
    duration: String(data.duration ?? ""),
    highlights: String(data.highlights ?? "")
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean),
  };
}

export function safeParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
