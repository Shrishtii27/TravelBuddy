export function buildUserPrompt(data) {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  return `
Starting City: ${data.startingCity || 'Delhi'}
Destination: ${data.destination}
Start Date: ${data.startDate}
End Date: ${data.endDate}
Total Days: ${daysDiff}
Travelers: ${data.travelers || 2}
Budget Range: ${data.budget || '₹20,000 - ₹30,000'}
Themes: ${data.themes || 'Culture, Nature'}
Pace: ${data.pace || 'Balanced'}
Weather Preference: ${data.weather || 'Any'}
Accommodation Type: ${data.accommodation || 'Mid-Range'}
Food Preference: ${data.food || 'All types'}
Transport Preference: ${data.transport || 'Mixed'}
Additional Preferences: ${data.additional || 'None'}

Generate full structured trip plan for ${data.destination}, India.

IMPORTANT:
- Each day cost must differ based on activities
- Vary activities throughout the trip
- Suggest REAL places in ${data.destination}, India
- Optimize routes logically
- Follow required JSON structure EXACTLY
- Use only Indian Rupees (₹)
- All locations must be in India
`;
}

export function enrichWithIndianContext(destination) {
  return `
Use authentic attractions from ${destination}, India.
Include temples, beaches, forts, palaces, markets, cafes, and local experiences.
Suggest real restaurant names and hotel names.
Consider Indian travel context (monsoon, festivals, local transport).
`;
}
