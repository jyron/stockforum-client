import api from "./api";

// Get all portfolios with optional filtering and sorting
export const getAllPortfolios = async (
  category = "",
  sort = "hot",
  page = 1,
  limit = 20
) => {
  try {
    const params = { page, limit };

    if (category && category !== "all") {
      params.category = category;
    }

    if (sort) {
      params.sort = sort;
    }

    const res = await api.get("/api/portfolios", { params });
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error in getAllPortfolios:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch portfolios",
    };
  }
};

// Get portfolio by ID
export const getPortfolioById = async (id) => {
  try {
    const res = await api.get(`/api/portfolios/${id}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch portfolio",
    };
  }
};

// Create a new portfolio (expects FormData with image upload)
export const createPortfolio = async (formData) => {
  try {
    const res = await api.post("/api/portfolios", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create portfolio",
    };
  }
};

// Delete a portfolio
export const deletePortfolio = async (id) => {
  try {
    const res = await api.delete(`/api/portfolios/${id}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete portfolio",
    };
  }
};

// Vote on a portfolio (upvote/downvote)
export const votePortfolio = async (id, voteType) => {
  try {
    const res = await api.post(`/api/portfolios/${id}/vote`, { voteType });
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to vote on portfolio",
    };
  }
};

// Remove vote from a portfolio
export const removeVote = async (id) => {
  try {
    const res = await api.delete(`/api/portfolios/${id}/vote`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to remove vote",
    };
  }
};

// Get comments for a portfolio
export const getPortfolioComments = async (id) => {
  try {
    const res = await api.get(`/api/portfolios/${id}/comments`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch comments",
    };
  }
};

// Create a comment on a portfolio
export const createPortfolioComment = async (data) => {
  try {
    const { portfolioId, ...commentData } = data;
    const res = await api.post(
      `/api/portfolios/${portfolioId}/comments`,
      commentData
    );
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create comment",
    };
  }
};
