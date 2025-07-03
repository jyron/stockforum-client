import api from "./api";

// Get all stocks
export const getAllStocks = async (searchTerm = "") => {
  try {
    console.log("Search term in service:", searchTerm);
    // Always include the search parameter, even if empty
    const params = { search: searchTerm };
    const res = await api.get("/api/stocks", { params });
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in getAllStocks:", error);
    return {
      error: error.response?.data?.message || "Failed to fetch stocks",
      success: false,
    };
  }
};

// Get stock by ID
export const getStockById = async (id: any) => {
  try {
    const res = await api.get(`/api/stocks/${id}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to fetch stock",
      success: false,
    };
  }
};

// Get stock by symbol
export const getStockBySymbol = async (symbol: any) => {
  try {
    const res = await api.get(`/api/stocks/symbol/${symbol}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to fetch stock",
      success: false,
    };
  }
};

// Create a new stock
export const createStock = async (stock: any) => {
  try {
    const res = await api.post("/api/stocks", stock);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to create stock",
      success: false,
    };
  }
};

// Update a stock
export const updateStock = async (id: any, stock: any) => {
  try {
    const res = await api.put(`/api/stocks/${id}`, stock);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to update stock",
      success: false,
    };
  }
};

// Delete a stock
export const deleteStock = async (id: any) => {
  try {
    const res = await api.delete(`/api/stocks/${id}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to delete stock",
      success: false,
    };
  }
};

// Like a stock
export const likeStock = async (id: any) => {
  try {
    const res = await api.post(`/api/stocks/${id}/like`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to like stock",
      success: false,
    };
  }
};

// Dislike a stock
export const dislikeStock = async (id: any) => {
  try {
    const res = await api.post(`/api/stocks/${id}/dislike`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to dislike stock",
      success: false,
    };
  }
};
