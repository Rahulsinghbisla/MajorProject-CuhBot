import * as z from "zod";
import { getJson } from "serpapi";
import { tool } from "@langchain/core/tools";

import { delay } from "@/lib/utils";

export const cryptoPriceTool = tool(
  async ({ symbol }) => {
    // 1. Normalize symbol for Yahoo Finance (BTC -> BTC-USD)
    let formattedSymbol = symbol.toUpperCase();
    if (!formattedSymbol.endsWith("-USD")) {
      formattedSymbol = `${formattedSymbol}-USD`;
    }
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?range=1d&interval=1d`
      );
      const data = await response.json();

      // Check if data exists
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error("Symbol not found");
      }

      const result = data.chart.result[0];
      const meta = result.meta;

      const currentPrice = meta.regularMarketPrice;
      const currency = meta.currency;
      const previousClose = meta.chartPreviousClose; // Useful for calculating 24h change

      return {
        symbol: formattedSymbol.replace("-USD", ""), // Return clean symbol (BTC)
        price: currentPrice,
        currency,
        previousClose,
        logoUrl: `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${symbol.toLowerCase()}.png`, // Fallback logic for logos often works with standard tickers
      };
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      return {
        symbol: symbol.toUpperCase(),
        price: 0,
        error: "Failed to fetch price",
      };
    }
  },
  {
    name: "displayCryptoPrice",
    description:
      "Get the current price for a cryptocurrency (e.g., Bitcoin, Ethereum, SOL).",
    schema: z.object({
      symbol: z
        .string()
        .describe(
          "The cryptocurrency ticker symbol (e.g., BTC, ETH, SOL, DOGE)."
        ),
    }),
  }
);

export const cryptoChartTool = tool(
  async ({ symbol, range = "1mo" }) => {
    // 1. Normalize symbol (BTC -> BTC-USD) for Yahoo API
    let formattedSymbol = symbol.toUpperCase();
    if (!formattedSymbol.endsWith("-USD")) {
      formattedSymbol = `${formattedSymbol}-USD`;
    }

    // 2. Determine appropriate interval based on range to avoid oversized payloads
    let interval = "1d";
    if (range === "1d" || range === "5d") {
      interval = "60m"; // Higher resolution for short timeframes
    }
    try {
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${formattedSymbol}?range=${range}&interval=${interval}`
      );
      const data = await response.json();

      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        throw new Error(`No chart data found for ${symbol}`);
      }

      const result = data.chart.result[0];
      const quote = result.indicators.quote[0];
      const meta = result.meta;

      // Basic validation
      if (!result.timestamp || !quote.close) {
        throw new Error("Incomplete data received");
      }

      return {
        symbol: formattedSymbol.replace("-USD", ""), // Return clean symbol to UI (BTC)
        prices: quote.close as (number | null)[],
        timestamp: result.timestamp as number[],
        currentPrice: meta.regularMarketPrice,
        currency: meta.currency,
        rangeUsed: range,
      };
    } catch (error) {
      console.error("Error fetching crypto chart:", error);
      // Return structured error info so the UI can display a nice message
      return {
        symbol: symbol.toUpperCase(),
        prices: [],
        timestamp: [],
        currentPrice: 0,
        error: "Failed to load historical data.",
      };
    }
  },
  {
    name: "displayCryptoChart",
    description:
      "Display a historical price chart for a cryptocurrency over a specific period of time.",
    schema: z.object({
      symbol: z
        .string()
        .describe(
          "The cryptocurrency ticker symbol (e.g., BTC, ETH, SOL, DOGE)."
        ),
      range: z
        .string()
        .optional()
        .describe(
          "The time range for the chart. Valid options: 1d, 5d, 1mo, 3mo, 6mo, 1y, ytd, max. Default is '1mo' if not specified."
        ),
    }),
  }
);

export const newsTool = tool(
  async ({ query }) => {
    try {
      // Yahoo Finance Search API returns news alongside quotes
      const response = await fetch(
        `https://query2.finance.yahoo.com/v1/finance/search?q=${query}`
      );
      const data = await response.json();

      if (!data.news || data.news.length === 0) {
        return { query, news: [] };
      }

      // Format the news items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newsItems = data.news.slice(0, 5).map((item: any) => ({
        uuid: item.uuid,
        title: item.title,
        publisher: item.publisher,
        link: item.link,
        // Convert unix timestamp to readable date
        publishTime: new Date(item.providerPublishTime * 1000).toLocaleString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }
        ),
        thumbnail: item.thumbnail?.resolutions?.[0]?.url || null, // Get first available thumbnail
      }));

      return {
        query,
        news: newsItems,
      };
    } catch (error) {
      console.error("Error fetching news:", error);
      return { query, news: [], error: "Failed to fetch news." };
    }
  },
  {
    name: "displayNews",
    description:
      "Get the latest news headlines for a specific stock, cryptocurrency, or company.",
    schema: z.object({
      query: z
        .string()
        .describe(
          "The stock symbol, crypto ticker, or company name to search for (e.g., AAPL, Bitcoin, Tesla)."
        ),
    }),
  }
);

export const sentimentTool = tool(
  async () => {
    try {
      const response = await fetch("https://api.alternative.me/fng/?limit=1");
      const data = await response.json();

      await delay(5000);
      
      if (!data.data || data.data.length === 0) {
        throw new Error("No data received");
      }

      const result = data.data[0];

      return {
        value: parseInt(result.value),
        classification: result.value_classification,
        timestamp: parseInt(result.timestamp),
        timeUntilUpdate: parseInt(result.time_until_update),
      };
    } catch (error) {
      console.error("Error fetching sentiment:", error);
      return {
        value: 50,
        classification: "Neutral",
        error: "Failed to fetch sentiment",
      };
    }
  },
  {
    name: "displayCryptoSentiment",
    description:
      "Get the current 'Fear & Greed' sentiment index for the crypto market. Score ranges from 0 (Extreme Fear) to 100 (Extreme Greed).",
    schema: z.object({
      // Input is optional since this is a global market index
      dummy: z
        .string()
        .optional()
        .describe(
          "Ignored parameter, just to satisfy schema requirements if needed."
        ),
    }),
  }
);

export const weatherTool = tool(
  async ({ location }) => {
    try {
      // 1. Geocode the location name to get latitude and longitude
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Location '${location}' not found.`);
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Fetch current weather using coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&wind_speed_unit=mph&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      if (!weatherData.current) {
        throw new Error("Weather data unavailable.");
      }

      const current = weatherData.current;

      return {
        location: `${name}, ${country}`,
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        isDay: current.is_day === 1,
        weatherCode: current.weather_code, // standard WMO weather code
      };
    } catch (error: any) {
      console.error("Error fetching weather:", error);
      return {
        location,
        error: error.message || "Failed to fetch weather data.",
      };
    }
  },
  {
    name: "displayWeather",
    description: "Get the current real-time weather for a specific city or location.",
    schema: z.object({
      location: z.string().describe("The name of the city, e.g., 'New York', 'London', 'Tokyo'."),
    }),
  }
);

export const productsTool = tool(
  async ({ query }) => {
    console.log("PRODUCT TOOL CALLED",query)
    try {
      // Fetch data using the Promise-based getJson method
      const response = await getJson({
        engine: "google_shopping",
        q: query,
        location: "India",
        api_key: process.env.SERPAPI_API_KEY
      });

      if (!response.shopping_results || response.shopping_results.length === 0) {
        return { query, products: [] };
      }

      const products = response.shopping_results.slice(0, 6).map((item: any, index: number) => ({
        id: item.product_id || String(index),
        title: item.title,
        description: item.source || "Google Shopping",
        price: item.extracted_price || 0,
        rating: item.rating || 0,
        thumbnail: item.thumbnail,
        product_link:item.product_link
      }));

      return {
        query,
        products,
      };
    } catch (error: any) {
      console.error("Error fetching products from SerpApi:", error);
      return { query, products: [], error: "Failed to load real products." };
    }
  },
  {
    name: "displayProducts",
    description: "Search for real e-commerce products and display a carousel of prices and details. always call this tool whenever user searhes for any kind of products ",
    schema: z.object({
      query: z.string().describe("The product to search for, e.g., 'iPhone 15', 'MacBook Pro'."),
    }),
  }
);

import { getStore } from "@/lib/store";
const store = await getStore()

export const searchMemoryTool = tool(
  async ({ query }, config) => {
    const userId = config.configurable?.user_id;
    if (!userId) return "User ID not found.";
    
    const namespace = [userId, "memories"];
    // Using the store instance you've already initialized
    const memories = await store.search(namespace, {
      query: query,
      limit: 3,
    });
    
    if (!memories || memories.length === 0) {
      return "No relevant memories found.";
    }
    return memories.map((d) => d.value.data).join("\n");
  },
  {
    name: "search_user_memory",
    description: "Call this tool ONLY when you need to recall specific past preferences, details, or context about the user that isn't in the current conversation.",
    schema: z.object({
      query: z.string().describe("The search query to find in the user's memory database"),
    }),
  }
);


export const toolsByName = {
  [newsTool.name]: newsTool,
  [sentimentTool.name]: sentimentTool,
  [cryptoPriceTool.name]: cryptoPriceTool,
  [cryptoChartTool.name]: cryptoChartTool,
  [weatherTool.name]: weatherTool,
  [productsTool.name]: productsTool,
  [searchMemoryTool.name]: searchMemoryTool,
};

export type ToolName = keyof typeof toolsByName;

export const tools = Object.values(toolsByName);

export const UI_TOOL_NAMES = [
  "displayCryptoChart",
  "displayNews",
  "displayCryptoPrice",
  "displayCryptoSentiment",
  "displayWeather",
  "displayProducts",
];


// Add this custom helper:
export type InferLangChainUITools<T> = {
  [K in keyof T]: {
    // Extract the inferred type safely from LangChain's Zod schema
    input: T[K] extends { schema: z.ZodType<infer U> } ? U : never;
    // Output is generally handled by LangGraph/Adapters, so `unknown` or `any` is safe for UI
    output: unknown; 
  };
};

// Now infer your UI tools correctly!
export type MyUITools = InferLangChainUITools<typeof toolsByName>;