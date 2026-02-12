export function enforceCostVariation(itinerary) {
  if (!itinerary.daily_itinerary || itinerary.daily_itinerary.length === 0) {
    return itinerary;
  }

  const totalDays = itinerary.daily_itinerary.length;
  
  // Add realistic variation to each day's cost
  itinerary.daily_itinerary.forEach((day, index) => {
    let baseVariation = 0;
    
    // First and last days typically lighter
    if (index === 0 || index === totalDays - 1) {
      baseVariation = -500;
    }
    // Middle days heavier
    else if (index >= Math.floor(totalDays / 3) && index <= Math.ceil(2 * totalDays / 3)) {
      baseVariation = 800;
    }
    // Other days moderate
    else {
      baseVariation = 200;
    }
    
    // Parse current cost
    const currentCost = parseInt(day.daily_estimated_cost.replace(/[^0-9]/g, ''));
    const newCost = currentCost + baseVariation + (index * 150);
    
    // Update with proper formatting
    day.daily_estimated_cost = `₹${newCost.toLocaleString('en-IN')}`;
  });

  return itinerary;
}
