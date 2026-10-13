"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/content";

export type WeatherKey =
  | "clear"
  | "mostlyClear"
  | "partlyCloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "showers"
  | "storm"
  | "snow";

export type Weather = { temp: number; key: WeatherKey; isDay: boolean };

/** WMO weather interpretation codes → message keys. */
export function weatherKey(code: number): WeatherKey {
  if (code === 0) return "clear";
  if (code === 1) return "mostlyClear";
  if (code === 2) return "partlyCloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 80 && code <= 82) return "showers";
  if (code >= 95) return "storm";
  return "snow";
}

/** Local wall-clock time in Tizimín, refreshed every 15 s. Null until mounted (no SSR mismatch). */
export function useLocalTime(locale: string) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: profile.timeZone,
    });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [locale]);
  return now;
}

const CACHE_KEY = "tizimin-weather";
const CACHE_MS = 30 * 60 * 1000;
let inflight: Promise<Weather | null> | null = null;

function fetchWeather(): Promise<Weather | null> {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const { at, data } = JSON.parse(cached) as { at: number; data: Weather };
      if (Date.now() - at < CACHE_MS) return Promise.resolve(data);
    }
  } catch {
    /* ignore unreadable cache */
  }
  if (inflight) return inflight;
  const { lat, lon } = profile.coords;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day&timezone=${encodeURIComponent(profile.timeZone)}`;
  inflight = fetch(url)
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((json: { current?: { temperature_2m: number; weather_code: number; is_day: number } }) => {
      if (!json.current) return null;
      const data: Weather = {
        temp: Math.round(json.current.temperature_2m),
        key: weatherKey(json.current.weather_code),
        isDay: json.current.is_day === 1,
      };
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
      } catch {
        /* storage blocked */
      }
      return data;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Current weather in Tizimín from Open-Meteo (no key). `undefined` while loading, `null` on failure. */
export function useWeather() {
  const [weather, setWeather] = useState<Weather | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    fetchWeather().then((w) => alive && setWeather(w));
    return () => {
      alive = false;
    };
  }, []);
  return weather;
}
