import api from "./api";

// Get all conversations
export const getAllConversations = async () => {
  try {
    const res = await api.get("/api/conversations");
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch conversations",
    };
  }
};

// Get a single conversation
export const getConversation = async (id) => {
  try {
    const res = await api.get(`/api/conversations/${id}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch conversation",
    };
  }
};

// Create a new conversation
export const createConversation = async (conversationData) => {
  try {
    const res = await api.post("/api/conversations", conversationData);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create conversation",
    };
  }
};

// Get comments for a conversation
export const getConversationComments = async (id) => {
  try {
    const res = await api.get(`/api/conversations/${id}/comments`);
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

// Add a comment to a conversation
export const addComment = async (id, commentData) => {
  try {
    const res = await api.post(
      `/api/conversations/${id}/comments`,
      commentData
    );
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to add comment",
    };
  }
};

// Like a conversation
export const likeConversation = async (id) => {
  try {
    const res = await api.post(`/api/conversations/${id}/like`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to like conversation",
    };
  }
};

// Unlike a conversation
export const unlikeConversation = async (id) => {
  try {
    const res = await api.post(`/api/conversations/${id}/unlike`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to unlike conversation",
    };
  }
};
