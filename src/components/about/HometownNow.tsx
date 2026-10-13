"use client";

import { Clock3, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Moon, Sun, type LucideIcon } from "lucide-react";
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

/** Live time and weather in Tizimín (Open-Meteo); the condition is an icon so the line never wraps. */
export function HometownNow() {
  const t = useTranslations("footer");
  const tw = useTranslations("weather");
  const locale = useLocale();
  const time = useLocalTime(locale);
  const weather = useWeather();
  const Icon = weather ? (weather.key === "clear" && !weather.isDay ? Moon : ICONS[weather.key]) : null;

  return (
    <p className="flex items-center gap-1.5 text-[12px] whitespace-nowrap text-muted tabular-nums">
      <Clock3 size={12} aria-hidden />
      <span className="sr-only">{t("time")}:</span>
      {time ?? "--:--"}
      {weather && Icon && (
        <>
          <span aria-hidden>·</span>
          <Icon size={13} aria-hidden />
          <span>{weather.temp}°C</span>
          <span className="sr-only">{tw(weather.key)}</span>
        </>
      )}
    </p>
  );
}
