// Mock Itinerary Generator - Returns realistic sample data without OpenAI
export function generateMockItinerary(requestData) {
  const { destination, startDate, endDate, totalDays, travelers, budget, themes } = requestData;
  
  // Generate dates for each day
  const start = new Date(startDate);
  const dates = [];
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  // Sample itinerary structure
  const mockItinerary = {
    trip_overview: {
      destination: destination || "Goa",
      total_days: totalDays || 5,
      starting_city: requestData.startingCity || "Mumbai",
      total_estimated_budget: budget || "₹25,000 - ₹35,000",
      best_time_to_visit: "October to March (Pleasant weather, ideal for beach activities)",
      travel_summary: `Experience the best of ${destination || 'Goa'} with this ${totalDays}-day itinerary covering beaches, culture, adventure, and local cuisine. Perfect for ${travelers} travelers seeking ${themes || 'adventure and relaxation'}.`
    },
    daily_itinerary: [],
    budget_breakdown: {
      accommodation: {
        total: "₹12,000",
        per_day_avg: `₹${Math.round(12000 / totalDays)}`
      },
      food: {
        total: "₹8,000",
        per_day_avg: `₹${Math.round(8000 / totalDays)}`
      },
      activities: {
        total: "₹6,000",
        per_day_avg: `₹${Math.round(6000 / totalDays)}`
      },
      transport: {
        intercity: "₹4,000",
        local: "₹2,000"
      },
      miscellaneous: "₹3,000",
      total_estimated: "₹35,000"
    },
    packing_list: {
      essentials: [
        "Sunscreen (SPF 50+)",
        "Insect repellent",
        "Basic first-aid kit",
        "Power bank and chargers",
        "Reusable water bottle"
      ],
      clothing: [
        "Light cotton clothes",
        "Swimwear",
        "Comfortable walking shoes",
        "Sunglasses and hat",
        "Light jacket for evenings"
      ],
      accessories: [
        "Camera/Phone with good storage",
        "Waterproof bag",
        "Beach towel",
        "Flip-flops",
        "Day backpack"
      ],
      documents: [
        "ID proof (Aadhar/Passport)",
        "Hotel booking confirmations",
        "Travel insurance",
        "Emergency contacts list",
        "COVID vaccination certificate"
      ]
    },
    local_tips: {
      language: "Konkani, Hindi, and English are widely spoken",
      currency: "Indian Rupee (₹)",
      best_transport: "Rent a scooter for flexibility, or use app-based cabs",
      safety_tips: [
        "Avoid isolated beaches after dark",
        "Bargain at local markets",
        "Stay hydrated in the tropical climate",
        "Be cautious of beach vendors",
        "Keep valuables secured"
      ],
      cultural_notes: [
        "Dress modestly when visiting temples",
        "Remove footwear before entering religious sites",
        "Respect local customs and traditions",
        "Portuguese influence is evident in architecture and cuisine",
        "Beach shacks close during monsoon season"
      ],
      emergency_contacts: {
        police: "100",
        ambulance: "108",
        tourist_helpline: "1363"
      }
    },
    weather_forecast: {
      average_temperature: "25°C - 32°C",
      conditions: "Sunny with occasional sea breeze",
      what_to_expect: "Pleasant weather perfect for beach activities. Mornings are cooler, afternoons can be warm. Evenings bring a refreshing sea breeze."
    }
  };

  // Generate daily itineraries
  for (let day = 1; day <= totalDays; day++) {
    const dailyPlan = generateDayPlan(day, totalDays, dates[day - 1], destination);
    mockItinerary.daily_itinerary.push(dailyPlan);
  }

  return mockItinerary;
}

function generateDayPlan(dayNum, totalDays, date, destination) {
  const isFirstDay = dayNum === 1;
  const isLastDay = dayNum === totalDays;
  
  const destinations = {
    "Goa": {
      themes: ["Beach Paradise", "Portuguese Heritage", "Water Sports", "Sunset Views", "Night Markets"],
      locations: [
        { name: "Baga Beach", activity: "Beach hopping and water sports" },
        { name: "Fort Aguada", activity: "Historic fort exploration" },
        { name: "Anjuna Flea Market", activity: "Shopping and local crafts" },
        { name: "Dudhsagar Falls", activity: "Waterfall trekking" },
        { name: "Old Goa Churches", activity: "Heritage walk" }
      ],
      restaurants: ["Fisherman's Wharf", "Pousada by the Beach", "Vinayak Family Restaurant", "Souza Lobo"]
    },
    "Kerala": {
      themes: ["Backwater Bliss", "Tea Gardens", "Ayurveda", "Wildlife", "Beach Relaxation"],
      locations: [
        { name: "Alleppey Backwaters", activity: "Houseboat cruise" },
        { name: "Munnar Tea Gardens", activity: "Tea plantation visit" },
        { name: "Periyar Wildlife Sanctuary", activity: "Wildlife safari" },
        { name: "Fort Kochi", activity: "Heritage walk" },
        { name: "Kovalam Beach", activity: "Beach relaxation" }
      ],
      restaurants: ["Dhe Puttu", "Paragon Restaurant", "Kayees Rahmathulla Hotel", "Villa Maya"]
    },
    "Rajasthan": {
      themes: ["Royal Heritage", "Desert Safari", "Colorful Bazaars", "Palaces & Forts", "Cultural Shows"],
      locations: [
        { name: "Amber Fort", activity: "Fort exploration" },
        { name: "City Palace", activity: "Royal palace tour" },
        { name: "Jal Mahal", activity: "Lake palace viewing" },
        { name: "Thar Desert", activity: "Camel safari" },
        { name: "Hawa Mahal", activity: "Palace photography" }
      ],
      restaurants: ["Chokhi Dhani", "LMB", "Rawat Mishthan Bhandar", "1135 AD"]
    }
  };

  const destData = destinations[destination] || destinations["Goa"];
  const theme = destData.themes[(dayNum - 1) % destData.themes.length];
  const loc1 = destData.locations[(dayNum * 2 - 2) % destData.locations.length];
  const loc2 = destData.locations[(dayNum * 2 - 1) % destData.locations.length];
  const loc3 = destData.locations[(dayNum * 2) % destData.locations.length];

  let title, morning, afternoon, evening;

  if (isFirstDay) {
    title = "Arrival and Local Exploration";
    morning = {
      time: "10:00 AM",
      activity: "Arrival and Check-in",
      location: "Hotel",
      duration: "2 hours",
      description: "Arrive at your destination, check into your hotel, freshen up and get ready for an amazing trip ahead. Take some time to relax after your journey.",
      estimated_cost: "₹500",
      tips: "Book airport/station transfer in advance for hassle-free arrival"
    };
  } else {
    title = theme;
    morning = {
      time: "08:00 AM",
      activity: loc1.activity,
      location: loc1.name,
      duration: "3 hours",
      description: `Start your day early with a visit to ${loc1.name}. Experience the authentic charm and take in the breathtaking views. This is one of the must-visit spots in ${destination}.`,
      estimated_cost: `₹${600 + (dayNum * 100)}`,
      tips: "Arrive early to avoid crowds and get the best experience"
    };
  }

  afternoon = {
    time: "01:00 PM",
    activity: loc2.activity,
    location: loc2.name,
    duration: "3-4 hours",
    description: `After lunch, head to ${loc2.name} for an unforgettable experience. This location offers unique attractions and plenty of photo opportunities. Don't miss the local specialties here.`,
    estimated_cost: `₹${800 + (dayNum * 150)}`,
    tips: "Carry water and wear comfortable shoes"
  };

  if (isLastDay) {
    evening = {
      time: "05:00 PM",
      activity: "Departure Preparation",
      location: "Hotel Area",
      duration: "2 hours",
      description: "Enjoy some last-minute shopping for souvenirs, pack your bags, and prepare for departure. Take a final stroll to soak in the memories of this wonderful trip.",
      estimated_cost: "₹400",
      tips: "Keep some buffer time for airport/station check-in"
    };
  } else {
    evening = {
      time: "06:00 PM",
      activity: loc3.activity,
      location: loc3.name,
      duration: "2-3 hours",
      description: `As the sun sets, visit ${loc3.name} for a magical evening experience. Witness the stunning sunset views and enjoy the local evening vibes. Perfect time for photography and relaxation.`,
      estimated_cost: `₹${500 + (dayNum * 120)}`,
      tips: "Sunset timing varies by season, check local timings"
    };
  }

  const baseCost = 2000 + (dayNum * 500);
  const variation = isFirstDay ? -500 : (isLastDay ? -300 : (dayNum % 2 === 0 ? 800 : 200));

  return {
    day: dayNum,
    date: date,
    title: title,
    theme: theme,
    morning: morning,
    afternoon: afternoon,
    evening: evening,
    accommodation: {
      hotel_name: `${destination} Beach Resort`,
      location: "Near Main Beach Area",
      estimated_cost: `₹${2500 + (dayNum * 200)}`,
      category: "Mid-Range",
      amenities: ["Free WiFi", "Swimming Pool", "Breakfast Included", "Air Conditioning", "Beach View"]
    },
    food_recommendations: [
      {
        meal_type: "Breakfast",
        restaurant: "Hotel Restaurant",
        dishes: ["Local breakfast platter", "Fresh fruits", "Coffee"],
        estimated_cost: "₹300",
        location: "Hotel"
      },
      {
        meal_type: "Lunch",
        restaurant: destData.restaurants[dayNum % destData.restaurants.length],
        dishes: ["Seafood curry", "Rice", "Local specialties"],
        estimated_cost: `₹${600 + (dayNum * 50)}`,
        location: "Near main attractions"
      },
      {
        meal_type: "Dinner",
        restaurant: destData.restaurants[(dayNum + 1) % destData.restaurants.length],
        dishes: ["Traditional thali", "Desserts", "Beverages"],
        estimated_cost: `₹${700 + (dayNum * 50)}`,
        location: "Beachside"
      }
    ],
    daily_estimated_cost: `₹${baseCost + variation}`,
    travel_notes: `Day ${dayNum} focuses on ${theme.toLowerCase()}. Start early to make the most of your day. Carry essentials and stay hydrated.`
  };
}
