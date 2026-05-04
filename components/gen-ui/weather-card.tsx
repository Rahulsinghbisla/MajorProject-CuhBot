import { Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react";

export interface WeatherCardProps {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  weatherCode: number;
  error?: string;
}

export function WeatherCard({
  location,
  temperature,
  feelsLike,
  humidity,
  windSpeed,
  isDay,
  weatherCode,
  error,
}: WeatherCardProps) {
  if (error) {
    return <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">{error}</div>;
  }

  // Basic WMO weather code mapping to icons
  const getWeatherIcon = (code: number, isDay: boolean) => {
    if (code <= 3) return isDay ? <Sun className="size-10 text-yellow-500" /> : <Cloud className="size-10 text-slate-400" />;
    if (code >= 51 && code <= 67) return <CloudRain className="size-10 text-blue-400" />;
    return <Cloud className="size-10 text-gray-400" />;
  };

  return (
    <div className="flex flex-col gap-4 p-5 my-4 max-w-sm rounded-2xl bg-card border shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{location}</h3>
          <p className="text-sm text-muted-foreground">{isDay ? "Daytime" : "Nighttime"}</p>
        </div>
        {getWeatherIcon(weatherCode, isDay)}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold tracking-tighter">{Math.round(temperature)}°</span>
        <span className="text-muted-foreground text-sm">Feels like {Math.round(feelsLike)}°</span>
      </div>

      <div className="flex gap-4 pt-4 mt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Droplets className="size-4 text-blue-500" />
          <span>{humidity}% Humidity</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wind className="size-4 text-slate-500" />
          <span>{windSpeed} mph</span>
        </div>
      </div>
    </div>
  );
}