import api from "./api";

// Cache for storing news data to avoid unnecessary API calls
const newsCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get news articles for a specific stock symbol
 * @param {string} symbol - Stock symbol (e.g., 'AAPL')
 * @param {number} limit - Number of articles to fetch (default: 3)
 * @returns {Promise<Object>} Response object with success status and data
 */
export const getStockNews = async (symbol: any, limit = 3) => {
  try {
    const cacheKey = `${symbol.toUpperCase()}_${limit}`;
    const cached = newsCache.get(cacheKey);

    // Return cached data if it's still fresh
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return {
        cached: true,
        data: cached.data,
        success: true,
      };
    }

    const res = await api.get(`/api/stocks/${symbol.toUpperCase()}/news`, {
      params: { limit },
      timeout: 8000, // 8 second timeout for news requests
    });

    const newsData = res.data || [];

    // Cache the response
    newsCache.set(cacheKey, {
      data: newsData,
      timestamp: Date.now(),
    });

    return {
      cached: false,
      data: newsData,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error fetching stock news:", error);

    // Return different error messages based on the error type
    let errorMessage = "Failed to fetch news";

    if (error.code === "ECONNABORTED") {
      errorMessage = "News request timed out";
    } else if (error.response?.status === 429) {
      errorMessage = "Too many requests. Please try again later.";
    } else if (error.response?.status === 404) {
      errorMessage = "No news available for this stock";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    return {
      data: [],
      error: errorMessage,
      success: false,
    };
  }
};

/**
 * Clear the news cache
 */
export const clearNewsCache = () => {
  newsCache.clear();
};

/**
 * Get cache statistics for debugging
 */
export const getNewsCacheStats = () => {
  return {
    keys: Array.from(newsCache.keys()),
    size: newsCache.size,
  };
};
