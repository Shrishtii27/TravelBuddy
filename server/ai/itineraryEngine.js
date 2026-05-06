export function buildUserPrompt(data) {
  const startDate = new Date(data.startDate);
  const endDate = new Date(data.endDate);
  const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  return `
USER TRIP CONFIGURATION:
- Starting City (Origin): ${data.startingCity || 'Not specified'}
- Destination State: ${data.destination}
- Specific Cities to Visit: ${data.selectedCities || 'Major cities in ' + data.destination}
- Duration: ${daysDiff} days (${data.startDate} to ${data.endDate})
- Group Size: ${data.travelers || 2} travelers
- Budget Category: ${data.budget || 'Mid-Range (₹35k - ₹50k)'}
- Primary Themes: ${data.themes || 'Culture, Heritage, Local Food'}
- Preferred Pace: ${data.pace || 'Balanced'}
- Food Preference: ${data.food || 'All types'}
- Transport Mode: ${data.transport || 'Mixed (Cabs, Trains, Local)'}
- Weather Expectation: ${data.weather || 'Pleasant'}
- Special Requests: ${data.additional || 'None'}

TASK:
Create a high-fidelity, day-by-day travel plan. 
You must identify a logical 'Arrival City' and 'Departure City' within the destination state.
Every single field in the MASTER SYSTEM PROMPT's JSON schema must be filled with factual, real-world data.

VARIETY REQUIREMENT (CRITICAL):
- Do NOT repeat the "Morning/Afternoon/Evening" template for every day.
- Vary the start times and activity types (e.g., mix walking tours, culinary trails, and site visits).
- Ensure Day 1 is strictly for arrival and low-energy local exploration.
- Absolutely NO repetition of locations, restaurants, or cafes across the entire trip.

GEOGRAPHIC CONSTRAINTS:
The trip is strictly for ${data.destination}. Do NOT include attractions outside of this state.
Focus specifically on the cities of: ${data.selectedCities}.

Ensure the total costs align with the "${data.budget}" budget category.
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
