export interface Country {
  id: string;
  slug: string;
  name: string;
  nameId: string;
  flag: string;
  continent: string;
  description: string;
  heroImage: string;
  visited: string;
  duration: string;
  budget: number;
  cities: City[];
  gallery: Media[];
  video: string;
  coordinates: [number, number];
  story: string;
  transport: string[];
  visa: string;
  visaCost: number;
  documents: string[];
  tips: string[];
  budgetBreakdown: BudgetItem[];
  food: FoodItem[];
  accommodation: string[];
  internet: string;
  simCard: string;
  money: string;
  safety: string;
  mosque: string[];
  halalFood: string;
  bestExperience: string;
  worstExperience: string;
  travelTips: string[];
  mistakes: string[];
  hiddenGems: string[];
  ratings: {
    overall: number;
    safety: number;
    food: number;
    budget: number;
    culture: number;
  };
}

export interface City {
  id: string;
  slug: string;
  name: string;
  countrySlug: string;
  countryName: string;
  description: string;
  heroImage: string;
  gallery: Media[];
  coordinates: [number, number];
  budget: number;
  duration: string;
  highlights: string[];
}

export interface Media {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  category: MediaCategory;
  country?: string;
  city?: string;
}

export type MediaCategory = "drone" | "street" | "food" | "mosque" | "people" | "nature";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  author: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  featured: boolean;
}

export type BlogCategory =
  | "backpacking"
  | "budget"
  | "visa"
  | "tips"
  | "student-immersion"
  | "travel-story"
  | "review"
  | "food"
  | "culture"
  | "islam-around-the-world";

export interface JournalEntry {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  country: string;
  content: string;
  weather: string;
  temperature: number;
  mood: string;
  images: string[];
  coordinates: [number, number];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  platform: "youtube" | "instagram" | "tiktok";
  thumbnail: string;
  country: string;
  duration: string;
  views: number;
  publishedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  role: string;
  content: string;
  rating: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: "admin" | "editor" | "visitor";
  createdAt: string;
}

export interface BudgetItem {
  category: string;
  amount: number;
  icon: string;
}

export interface FoodItem {
  name: string;
  price: number;
  rating: number;
  description: string;
  image: string;
  isHalal: boolean;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
  country: string;
}

export interface TravelStatistic {
  label: string;
  value: string | number;
  icon: string;
  description: string;
}

export interface VisaInfo {
  country: string;
  flag: string;
  visaType: string;
  cost: number;
  duration: string;
  documents: string[];
  link: string;
  requirements: string[];
  tips: string[];
  processingTime: string;
}

export interface PackingItem {
  id: string;
  category: string;
  name: string;
  essential: boolean;
}

export interface CalculatorInput {
  country: string;
  duration: number;
  budget: number;
  style: "budget" | "midrange" | "luxury";
}

export interface CalculatorResult {
  accommodation: number;
  food: number;
  transport: number;
  activities: number;
  misc: number;
  total: number;
  breakdown: BudgetItem[];
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage: string;
  ogType: string;
  canonical: string;
}
