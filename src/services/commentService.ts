import api from "./api";

// Get all comments for a stock
export const getStockComments = async (stockId: any) => {
  try {
    const res = await api.get(`/api/comments/stock/${stockId}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error fetching comments:", error);
    return {
      error: error.response?.data?.message || "Failed to fetch comments",
      success: false,
    };
  }
};

// Create a new comment
export const createComment = async (commentData: any) => {
  try {
    const dataToSend = {
      content: commentData.content,
      isAnonymous: commentData.isAnonymous || false,
      stockId: commentData.stockId,
    };

    // Add parentCommentId if it's a reply
    if (commentData.parentCommentId) {
      dataToSend.parentCommentId = commentData.parentCommentId;
    }

    const res = await api.post("/api/comments", dataToSend);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error creating comment:", error);
    return {
      error: error.response?.data?.message || "Failed to create comment",
      success: false,
    };
  }
};

// Update a comment
export const updateComment = async (id: any, content: any) => {
  try {
    const res = await api.put(`/api/comments/${id}`, { content });
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error updating comment:", error);
    return {
      error: error.response?.data?.message || "Failed to update comment",
      success: false,
    };
  }
};

// Delete a comment
export const deleteComment = async (id: any) => {
  try {
    const res = await api.delete(`/api/comments/${id}`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error deleting comment:", error);
    return {
      error: error.response?.data?.message || "Failed to delete comment",
      success: false,
    };
  }
};

// Like a comment
export const likeComment = async (id: any) => {
  try {
    const res = await api.post(`/api/comments/${id}/like`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error liking comment:", error);
    return {
      error: error.response?.data?.message || "Failed to like comment",
      success: false,
    };
  }
};

// Dislike a comment
export const dislikeComment = async (id: any) => {
  try {
    const res = await api.post(`/api/comments/${id}/dislike`);
    return {
      data: res.data,
      success: true,
    };
  } catch (error: unknown) {
    console.error("Error disliking comment:", error);
    return {
      error: error.response?.data?.message || "Failed to dislike comment",
      success: false,
    };
  }
};
