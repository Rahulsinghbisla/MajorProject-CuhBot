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


// 2. The Tool Definition
export const studentDetailsTool = tool(
  async ({ queryType, queryValue }) => {
    console.log(`STUDENT TOOL CALLED - Type: ${queryType}, Value: ${queryValue}`);
    
    try {
      // Initialize an array to hold the matched students
      let results: string | any[] = [];
      console.log("Searching in students database...");

      // Search logic based on whether the LLM extracted a name or a roll number
      if (queryType === "roll") {
        // Exact match for roll number (case insensitive)
        results = studentsDatabase.filter(
          (student) => student.roll.toLowerCase() === queryValue.toLowerCase()
        );
      } else if (queryType === "name") {
        // Partial match for student name (case insensitive)
        results = studentsDatabase.filter(
          (student) => student.student_name.toLowerCase().includes(queryValue.toLowerCase())
        );
      }

      // Handle no results found
      if (results.length === 0) {
        return { 
          success: false, 
          message: `No student found with ${queryType} matching '${queryValue}'.` 
        };
      }

      // Return the found student(s)
      return {
        success: true,
        count: results.length,
        students: results,
      };

    } catch (error: any) {
      console.error("Error fetching student details:", error);
      return { success: false, error: "Failed to load student details." };
    }
  },
  {
    name: "getStudentDetails",
    description: "Search and retrieve a student's academic and administrative details. This includes their pending fees, library books issued, exam marks, and assignment marks. Always call this tool when a user asks about a specific student's information, grades, fees, or library dues.",
    schema: z.object({
      queryType: z.enum(["name", "roll"]).describe("Whether the user is searching by the student's name or their roll number."),
      queryValue: z.string().describe("The actual name or roll number to search for. e.g., 'Aarav Sharma' or 'CS202601'."),
    }),
  }
);



import { getStore } from "@/lib/store";
import { cuhFacilitiesData, cuhLocations, mcaFourthSemSchedule, studentsDatabase } from "./Data";
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



export const getMcaTimetableTool = tool(
  async ({ day, time }) => {
    const normalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

    // 1. Handle Weekend/Empty Days
    if (!mcaFourthSemSchedule[normalizedDay]) {
      return JSON.stringify({
        day: normalizedDay,
        schedule: []
      });
    }

    const dailySchedule = mcaFourthSemSchedule[normalizedDay];

    // 2. Helper function to format the data into the UI Component's shape
    const createSessionObject = (timeKey: string, subject: string) => {
      // Creates a range like "09:00 - 10:00"
      const startHour = parseInt(timeKey.split(':')[0], 10);
      const endHour = startHour + 1;
      const timeRange = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
      
      return {
        time: timeRange,
        subject: subject,
        isBreak: subject.toLowerCase() === "lunch"
      };
    };

    // 3. If no specific time is asked, return the ENTIRE day's timetable
    if (!time) {
      const scheduleArray = Object.entries(dailySchedule).map(([timeKey, subject]) => {
        return createSessionObject(timeKey, subject);
      });

      return JSON.stringify({
        day: normalizedDay,
        schedule: scheduleArray
      });
    }

    // 4. Extract just the hour for a specific time query
    const hourPrefix = time.split(":")[0];
    const normalizedTimeKey = `${hourPrefix}:00`;
    const scheduledClass = dailySchedule[normalizedTimeKey];

    // 5. Return a single class if a specific time was requested
    if (scheduledClass) {
      return JSON.stringify({
        day: normalizedDay,
        schedule: [createSessionObject(normalizedTimeKey, scheduledClass)]
      });
    } else {
      // Time is outside of campus hours
      return JSON.stringify({
        day: normalizedDay,
        schedule: []
      });
    }
  },
  {
    name: "get_mca_timetable",
    description: "Fetches the MCA 4th Semester class schedule. Returns a JSON string formatted for the UI. If no time is provided, it returns the whole day's schedule.",
    schema: z.object({
      day: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        .describe("The day of the week the user is asking about."),
      time: z.string().optional()
        .describe("Optional. The requested time in 24-hour format (e.g., '09:00', '14:00'). Convert AM/PM to 24-hour time before calling.")
    }),
  }
);


export const getBusLocationTool = tool(
  async () => {
    // 1. Generate a random index based on the length of the locations array
    const randomIndex = Math.floor(Math.random() * cuhLocations.length);
    
    // 2. Fetch the random location
    const currentLocation = cuhLocations[randomIndex];

    // 3. Format the location slightly for better readability (capitalizing if needed)
    const formattedLocation = currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1);

    // 4. Return the string to the LLM
    return `The live location of the CUH campus bus is currently near: ${formattedLocation}.`;
  },
  {
    name: "get_bus_location",
    description: "Fetches the real-time, live location of the CUH university campus bus. Use this tool whenever the user asks 'where is the bus', 'track the bus', or asks for the bus location.",
    // We use an empty object schema because the LLM doesn't need to extract any parameters from the user to check the bus.
    schema: z.object({}), 
  }
);

export const getCuhFacilitiesTool = tool(
  async ({ facility_category }) => {
    // If the LLM asks for 'all', we combine all the data into one big summary
    if (facility_category === "all") {
      const allFacilities = Object.values(cuhFacilitiesData).join("\n- ");
      return `Here is an overview of the facilities at Central University of Haryana (CUH):\n- ${allFacilities}`;
    }

    // Fetch the specific category requested
    const facilityInfo = cuhFacilitiesData[facility_category];

    if (facilityInfo) {
      return facilityInfo;
    } else {
      // Fallback if the LLM passes an unrecognized category
      return `I couldn't find specific details for "${facility_category}". However, CUH generally provides Hostels, a Central Library, a Dispensary, Transport (Buses), Wi-Fi, and a Cafeteria. Ask about any of these specifically!`;
    }
  },
  {
    name: "get_cuh_facilities",
    description: "Fetches detailed information about the facilities available at the Central University of Haryana (CUH), Jant-Pali, Mahendergarh. Use this when the user asks about hostels, library, food, transport, medical, or general campus amenities.",
    schema: z.object({
      facility_category: z.enum([
        "hostel", 
        "library", 
        "medical", 
        "transport", 
        "food", 
        "it_infrastructure", 
        "sports", 
        "admin", 
        "general", 
        "all"
      ]).describe("The category of the facility the user is asking about. Use 'all' if the user asks for a general overview of all facilities.")
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
  [studentDetailsTool.name]: studentDetailsTool,
  [getMcaTimetableTool.name]: getMcaTimetableTool,
  [getBusLocationTool.name]: getBusLocationTool,
  [getCuhFacilitiesTool.name]: getCuhFacilitiesTool,
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
  "get_mca_timetable",
  "getStudentDetails",
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