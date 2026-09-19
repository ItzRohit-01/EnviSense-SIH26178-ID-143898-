export const getChatbotResponse = async (message) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const lowerMessage = message.toLowerCase();

  // Basic mock responses based on keywords
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! How can I help you today?";
  } else if (lowerMessage.includes('help')) {
    return "I can help you navigate the app, find resources, or report an issue. What do you need?";
  } else if (lowerMessage.includes('report') || lowerMessage.includes('issue')) {
    return "To report an issue, please go to the 'Emergency' or 'Alerts' tab from the sidebar.";
  } else if (lowerMessage.includes('map')) {
    return "The interactive map is available in the 'Map' section. It shows active alerts and safe zones.";
  } else {
    return "I'm a simple assistant. I might not understand everything yet, but I'm learning! How else can I assist you?";
  }
};
