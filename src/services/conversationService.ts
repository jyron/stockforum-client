import api from "./api";

// Get all conversations
export const getAllConversations = async () => {
  try {
    const res = await api.get("/api/conversations");
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error fetching conversations:", error);
    return {
      error: error.response?.data?.message || "Failed to fetch conversations",
      success: false,
    };
  }
};

// Get a single conversation
export const getConversation = async (id: any) => {
  try {
    const res = await api.get(`/api/conversations/${id}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to fetch conversation",
      success: false,
    };
  }
};

// Create a new conversation
export const createConversation = async (conversationData: any) => {
  try {
    const res = await api.post("/api/conversations", conversationData);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to create conversation",
      success: false,
    };
  }
};

// Get comments for a conversation
export const getConversationComments = async (id: any) => {
  try {
    const res = await api.get(`/api/conversations/${id}/comments`);
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

// Add a comment to a conversation
export const addComment = async (id: any, commentData: any) => {
  try {
    const res = await api.post(
      `/api/conversations/${id}/comments`,
      commentData
    );
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to add comment",
      success: false,
    };
  }
};

// Like a conversation
export const likeConversation = async (id: any) => {
  try {
    const res = await api.post(`/api/conversations/${id}/like`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to like conversation",
      success: false,
    };
  }
};

// Unlike a conversation
export const unlikeConversation = async (id: any) => {
  try {
    const res = await api.post(`/api/conversations/${id}/unlike`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error.response?.data?.message || "Failed to unlike conversation",
      success: false,
    };
  }
};
