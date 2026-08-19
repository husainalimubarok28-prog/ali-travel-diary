"use client";

import { useEffect, useState } from "react";

type CMSMap = Record<string, string>;

let cachedCMS: CMSMap | null = null;

export function useCMS(category?: string) {
  const [cms, setCMS] = useState<CMSMap>(cachedCMS || {});
  const [loading, setLoading] = useState(!cachedCMS);

  useEffect(() => {
    if (cachedCMS) {
      setCMS(cachedCMS);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetch("/api/cms")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        const map: CMSMap = {};
        const groups = json.data || json;
        for (const [_cat, items] of Object.entries(groups) as [string, { key: string; value: string }[]][]) {
          for (const item of items) {
            map[item.key] = item.value;
          }
        }
        cachedCMS = map;
        setCMS(map);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const get = (key: string, fallback = ""): string => cms[key] ?? fallback;

  const getJSON = <T = any>(key: string, fallback: T): T => {
    const val = cms[key];
    if (!val) return fallback;
    try { return JSON.parse(val) as T; } catch { return fallback; }
  };

  const filtered = category
    ? Object.fromEntries(Object.entries(cms).filter(([k]) => k.startsWith(category)))
    : cms;

  return { cms: filtered, get, getJSON, loading };
}
