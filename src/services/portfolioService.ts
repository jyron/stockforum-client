import api from "./api";

// Get all portfolios with optional filtering and sorting
export const getAllPortfolios = async (
  category = "",
  sort = "hot",
  page = 1,
  limit = 20
) => {
  try {
    const params = { limit, page };

    if (category && category !== "all") {
      params.category = category;
    }

    if (sort) {
      params.sort = sort;
    }

    const res = await api.get("/api/portfolios", { params });
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error in getAllPortfolios:", error);
    return {
      error: error.response?.data?.message || "Failed to fetch portfolios",
      success: false,
    };
  }
};

// Get portfolio by ID
export const getPortfolioById = async (id: any) => {
  try {
    const res = await api.get(`/api/portfolios/${id}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to fetch portfolio",
      success: false,
    };
  }
};

// Create a new portfolio (expects FormData with image upload)
export const createPortfolio = async (formData: any) => {
  try {
    const res = await api.post("/api/portfolios", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to create portfolio",
      success: false,
    };
  }
};

// Delete a portfolio
export const deletePortfolio = async (id: any) => {
  try {
    const res = await api.delete(`/api/portfolios/${id}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to delete portfolio",
      success: false,
    };
  }
};

// Vote on a portfolio (upvote/downvote)
export const votePortfolio = async (id: any, voteType: any) => {
  try {
    const res = await api.post(`/api/portfolios/${id}/vote`, { voteType });
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to vote on portfolio",
      success: false,
    };
  }
};

// Remove vote from a portfolio
export const removeVote = async (id: any) => {
  try {
    const res = await api.delete(`/api/portfolios/${id}/vote`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to remove vote",
      success: false,
    };
  }
};

// Get comments for a portfolio
export const getPortfolioComments = async (id: any) => {
  try {
    const res = await api.get(`/api/portfolios/${id}/comments`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to fetch comments",
      success: false,
    };
  }
};

// Create a comment on a portfolio
export const createPortfolioComment = async (data: any) => {
  console.log("data", data);
  try {
    const { portfolioId, ...commentData } = data;
    const res = await api.post(
      `/api/portfolios/${portfolioId}/comments`,
      commentData
    );
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to create comment",
      success: false,
    };
  }
};
