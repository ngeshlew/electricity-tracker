// AI Chat API - This would typically be a backend endpoint
// For now, we'll simulate AI responses based on user data

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  readings: any[];
}

export const generateAIResponse = async (request: ChatRequest): Promise<string> => {
  const { messages, readings } = request;
  const lastMessage = messages[messages.length - 1];
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  // Simple AI-like responses based on keywords and data
  const userInput = lastMessage.content.toLowerCase();
  const recentReadings = readings?.slice(-10) || [];
  const avgConsumption = recentReadings.length > 0 
    ? recentReadings.reduce((sum: number, r: any) => sum + (r.consumption || 0), 0) / recentReadings.length
    : 0;
  
  // Generate contextual responses
  if (userInput.includes('trend') || userInput.includes('trending')) {
    return `Based on your recent data, your energy consumption is ${avgConsumption > 20 ? 'above' : 'below'} average. Your usage shows ${avgConsumption > 20 ? 'room for improvement' : 'good energy management'}. 

${avgConsumption > 20 ? 'Consider these optimizations:' : 'Keep up the great work! Here are some additional tips:'}
• Monitor peak usage hours (typically 6-8 PM)
• Use energy-efficient appliances
• Consider time-of-use tariffs if available
• Regular maintenance of heating/cooling systems`;
  }
  
  if (userInput.includes('peak') || userInput.includes('hours')) {
    return `Your peak usage analysis shows:
• Highest consumption: Evening hours (6-8 PM)
• Lowest consumption: Night hours (12-6 AM)
• Weekend usage: Typically 15-20% higher

💡 **Optimization Tips:**
• Shift energy-intensive tasks to off-peak hours
• Use timers for washing machines and dishwashers
• Consider smart home automation for better control
• Check if your tariff offers off-peak rates`;
  }
  
  if (userInput.includes('reduce') || userInput.includes('save') || userInput.includes('bill')) {
    const potentialSavings = avgConsumption > 20 ? 25 : 15;
    return `Here are proven ways to reduce your electricity bill:

💰 **Immediate Actions (Save £${potentialSavings-10}/month):**
• Turn off standby appliances
• Use LED bulbs throughout your home
• Lower thermostat by 1°C (saves 10% on heating)
• Wash clothes at 30°C

🔧 **Medium-term Improvements (Save £${potentialSavings}/month):**
• Install smart thermostats
• Upgrade to energy-efficient appliances
• Improve home insulation
• Use time-of-use tariffs

📊 **Your current average: ${avgConsumption.toFixed(1)} kWh/day**
Target: Reduce to ${Math.max(15, avgConsumption * 0.8).toFixed(1)} kWh/day for maximum savings`;
  }
  
  if (userInput.includes('average') || userInput.includes('daily')) {
    return `Your daily consumption analysis:

📈 **Current Average:** ${avgConsumption.toFixed(1)} kWh/day
📊 **UK Average:** ~12-15 kWh/day
🏠 **Your Status:** ${avgConsumption > 15 ? 'Above average' : 'Below average - great job!'}

${avgConsumption > 15 ? 'You\'re using more than the UK average. Focus on:' : 'You\'re doing well! To maintain efficiency:'}
• Peak hour management
• Appliance efficiency
• Home insulation
• Smart energy habits

💡 **Quick wins:** Small changes can save 10-20% on your bill!`;
  }
  
  if (userInput.includes('pattern') || userInput.includes('unusual')) {
    return `Pattern analysis of your energy usage:

🔍 **Detected Patterns:**
• Consistent daily consumption: ${avgConsumption.toFixed(1)} kWh
• Peak usage: Evening hours
• Weekend spike: Normal (15-20% increase)
• Seasonal variation: Minimal data available

⚠️ **Unusual Patterns to Watch:**
• Sudden spikes (check for faulty appliances)
• Continuous high usage (possible energy leaks)
• Inconsistent patterns (lifestyle changes)

✅ **Your patterns look normal!** Keep monitoring for any sudden changes.`;
  }
  
  if (userInput.includes('compare') || userInput.includes('month')) {
    return `Monthly comparison analysis:

📊 **This Month vs Previous:**
• Current average: ${avgConsumption.toFixed(1)} kWh/day
• Trend: ${avgConsumption > 20 ? 'Increasing' : 'Stable'}
• Cost impact: £${(avgConsumption * 0.25).toFixed(2)}/day

📈 **Key Insights:**
• Usage consistency: ${avgConsumption < 20 ? 'Good' : 'Needs improvement'}
• Peak management: ${avgConsumption > 20 ? 'Consider optimization' : 'Well managed'}
• Seasonal factors: Monitor for winter increases

💡 **Recommendations:**
• Track weekly patterns for better insights
• Compare with previous months
• Set monthly consumption targets`;
  }
  
  // Default response
  return `I'd be happy to help you analyze your energy usage! 

Based on your recent data:
• Daily average: ${avgConsumption.toFixed(1)} kWh
• Recent readings: ${recentReadings.length} entries
• Data quality: ${recentReadings.length > 5 ? 'Good' : 'Limited'}

What specific aspect would you like me to analyze? I can help with:
• Consumption trends and patterns
• Cost optimization strategies  
• Peak usage analysis
• Energy-saving recommendations
• Monthly comparisons
• Anomaly detection

Just ask me anything about your energy usage! 🔌`;
};
