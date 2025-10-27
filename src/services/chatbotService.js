import api from './api';

/**
 * Send message to chatbot
 * @param {string} message - User message
 * @returns {Promise} - Response from chatbot API
 */
export const sendMessage = async (message) => {
  try {
    const response = await api.post('/chatbot/message', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message to chatbot:', error);
    throw error;
  }
};


