"use client";

import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Clock3, Moon, Sun, type LucideIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useLocalTime, useWeather, type WeatherKey } from "@/lib/tizimin";

const ICONS: Record<WeatherKey, LucideIcon> = {
  clear: Sun,
  mostlyClear: CloudSun,
  partlyCloudy: CloudSun,
  overcast: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  showers: CloudRain,
  storm: CloudLightning,
  snow: CloudSnow,
};

/** Local time + current weather in Tizimín. Degrades to time only if Open-Meteo is unreachable. */
export function LocalConditions() {
  const t = useTranslations("footer");
  const tw = useTranslations("weather");
  const locale = useLocale();
  const time = useLocalTime(locale);
  const weather = useWeather();
  const Icon = weather ? (weather.key === "clear" && !weather.isDay ? Moon : ICONS[weather.key]) : Cloud;

  return (
    <div className="inline-flex items-center gap-3 rounded-full bg-surface px-3.5 py-2 text-[13px] text-body shadow-pill ring-1 ring-line/60">
      <span className="flex items-center gap-1.5 tabular-nums">
        <Clock3 size={14} aria-hidden className="text-muted" />
        <span className="sr-only">{t("time")}:</span>
        <span className="min-w-[4.6em]">{time ?? "--:--"}</span>
      </span>
      <span aria-hidden className="h-3.5 w-px bg-line" />
      <span className="flex items-center gap-1.5">
        <Icon size={14} aria-hidden className="text-muted" />
        {weather === undefined ? (
          <span className="inline-block h-3 w-16 animate-pulse rounded bg-chip" />
        ) : weather ? (
          <span>
            {weather.temp}°C · {tw(weather.key)}
          </span>
        ) : (
          <span className="text-muted">{t("weatherUnavailable")}</span>
        )}
      </span>
      <span aria-hidden className="hidden h-3.5 w-px bg-line sm:block" />
      <span className="hidden text-muted sm:inline">{t("weatherIn")}</span>
    </div>
  );
}
