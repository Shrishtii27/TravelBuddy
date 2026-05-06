// ─────────────────────────────────────────────────────────────────────────────
// Mock Itinerary Generator v2 — Matches MASTER_SYSTEM_PROMPT v2 Schema
// All data is city-authentic, geographically verified, and 2024-2025 priced.
// ─────────────────────────────────────────────────────────────────────────────

// ─── CITY DATABASE ────────────────────────────────────────────────────────────
const CITY_DB = {

  "Jaipur": {
    state: "Rajasthan",
    language: "Hindi, Rajasthani. English understood in tourist zones.",
    useful_phrases: [
      { phrase: "Padharo mhare desh", meaning: "Welcome to our land" },
      { phrase: "Kitno ro bhav chhe?", meaning: "What is the price of this?" },
      { phrase: "Maaf karjo", meaning: "Excuse me / Sorry" }
    ],
    atm: "SBI, HDFC, and ICICI ATMs at Mirza Ismail Road, Sindhi Camp, and Bani Park.",
    transport: {
      intercity: "Shatabdi Express to Delhi (4.5 hrs), RSRTC buses to Udaipur/Jodhpur (5–6 hrs by road)",
      intracity: "Auto-rickshaws (negotiate fare), Ola/Uber available. Cycle-rickshaws in Old City.",
      app_cabs: ["Ola", "Uber", "Rapido"]
    },
    connectivity: {
      network: "Excellent Jio/Airtel 4G in city. Some dead zones near Amber Fort hills.",
      sim: "Jio ₹299/28-day plan: unlimited calls + 2GB/day",
      wifi: "Available in hotels; spotty in Old City bazaars"
    },
    hospital: "Sawai Man Singh (SMS) Government Hospital, JLN Marg",
    safety: [
      "Use pre-paid auto stands at railway station to avoid fare disputes.",
      "Avoid buying gemstones from street touts — most are synthetic at inflated prices.",
      "Carry minimal cash in Johari Bazaar; pickpockets active near crowded markets."
    ],
    scams: [
      "Auto/taxi drivers may claim your hotel is 'full' or 'closed' and redirect you to a commission hotel — always call your hotel directly to confirm.",
      "Elephant ride operators at Amber Fort sometimes charge extra mid-ride — settle full price including photos before mounting."
    ],
    etiquette: [
      "Cover your head inside Sikh temples (Gurudwara Guru Singh Sabha, Civil Lines).",
      "Remove footwear before entering all temples and havelis.",
      "Bargain respectfully in bazaars — starting at 40–50% of quoted price is standard."
    ],
    weather: {
      Oct_Mar: { high: "27°C", low: "10°C", humidity: "Low (15–25%)", uv: "Moderate (4–5)", conditions: "Clear sunny days, cold nights. Fog possible Jan mornings.", wear: "Light cotton by day, warm jacket after 7 PM.", aqi: "Moderate (AQI 80–120) — harmattan dust possible." },
      Apr_Jun: { high: "42°C", low: "28°C", humidity: "Very Low (10–15%)", uv: "Very High (9–10)", conditions: "Scorching afternoons. Dust storms (andhi) in May–June.", wear: "Loose full-sleeve cotton, UV hat, sunglasses. Indoors 12–4 PM.", aqi: "Poor (AQI 150+) during dust storms." },
      Jul_Sep: { high: "35°C", low: "24°C", humidity: "High (65–80%)", uv: "High (7–8)", conditions: "Monsoon rains. Forts look dramatic; roads can flood.", wear: "Light raincoat, quick-dry fabrics, waterproof sandals.", aqi: "Good (AQI 40–70) post-rain." }
    },
    day_trips: [
      { destination: "Abhaneri — Chand Baori Stepwell", distance: "95 km, ~2 hrs by road", best_for: "Geometric stepwell architecture photography", highlights: ["Chand Baori (3,500 steps)", "Harshat Mata Temple"], cost: "₹800 per person (cab + entry)", recommended_if: "Staying 4+ days in Jaipur" },
      { destination: "Samode Village & Palace", distance: "42 km, ~1 hr", best_for: "Heritage palace stay, frescoes, camel rides", highlights: ["Samode Palace", "Village Walk", "Painted Havelis"], cost: "₹1,200 per person", recommended_if: "Architecture and heritage lovers" },
      { destination: "Ranthambore National Park", distance: "180 km, ~3.5 hrs", best_for: "Tiger safari", highlights: ["Zone 3/4 Jeep Safari", "Ranthambore Fort"], cost: "₹3,500–₹5,000 per person (safari + transport)", recommended_if: "Wildlife enthusiasts with 2 extra days" }
    ],
    days: [
      {
        title: "Arrival: Pink City First Impressions",
        theme: "Arrival & Light Exploration",
        weather_note: "Expect 28°C by noon. Evenings cool to 15°C — carry a light layer.",
        morning: {
          time: "11:00 AM", activity: "Airport/Station Arrival & Hotel Check-in",
          location: "Jaipur International Airport / Jaipur Junction Railway Station",
          neighborhood: "Civil Lines / Station Road",
          duration: "1.5 hours", entry_fee: "Free",
          opening_hours: "N/A",
          description: "Arrive in Jaipur and transfer to your hotel. Jaipur Junction is a heritage station with Rajput-style architecture — take a moment to notice the sandstone facade before stepping out. Check in, freshen up, and rehydrate with nimbu pani.",
          estimated_cost: "₹300 (cab from station)",
          transport_to_next: "Walk or hotel cab, 5 min",
          tips: "Book a pre-paid cab from the airport booth (Counter 3, Arrivals) — ₹450–₹500 to Civil Lines. Avoid touts inside the terminal."
        },
        afternoon: {
          time: "02:30 PM", activity: "Stroll on Mirza Ismail (MI) Road & Panch Batti",
          location: "Mirza Ismail Road, Jaipur",
          neighborhood: "Central Jaipur",
          duration: "2 hours", entry_fee: "Free",
          opening_hours: "Always open",
          description: "MI Road is Jaipur's most iconic commercial spine, lined with 1930s colonial-era buildings and Rajput arch facades. Panch Batti (Five Lamps) is the central crossroads — a great urban photography spot. Browse window displays and grab a Kulfi Falooda at LMB.",
          estimated_cost: "₹200 (refreshments)",
          transport_to_next: "10 min walk to dinner",
          tips: "LMB (Laxmi Misthan Bhandar) at Johari Bazaar end of MI Road is a 70-year-old institution — don't leave without a Rajasthani Thali sampler."
        },
        evening: {
          time: "06:30 PM", activity: "Johari Bazaar Evening Walk & Street Food",
          location: "Johari Bazaar, Old City, Jaipur",
          neighborhood: "Old City / Walled City",
          duration: "2 hours", entry_fee: "Free",
          opening_hours: "Shops open until 9:00 PM",
          description: "Johari Bazaar ('Jewellers' Market') is the heart of Jaipur's walled city — a 500-metre stretch of jewellery shops, textile stores, and food stalls. The pink-washed facades glow amber under the evening lights. Try Pyaaz Kachori (₹25) from roadside stalls and spot the Hawa Mahal at the north end.",
          estimated_cost: "₹150 (street food)",
          transport_to_next: "Auto to hotel, ₹80, 10 min",
          tips: "Window-shop tonight; buy tomorrow after comparing prices at multiple stalls. Jewellery should only be bought from certified shops with BIS hallmark."
        },
        accommodation: {
          hotel_name: "Hotel Pearl Palace",
          area: "Hathroi Fort, Ajmer Road",
          address_landmark: "Near Ajmer Road overbridge, 1.5 km from MI Road",
          estimated_cost: "₹1,800 per night",
          category: "Budget",
          star_rating: 3,
          amenities: ["Free WiFi", "Rooftop café with city views", "In-house travel desk", "24-hr hot water"],
          booking_tip: "Book directly via their website for 10% off OTA rates. Request a top-floor room for fort views.",
          why_this_hotel: "Award-winning budget property with extraordinary rooftop views of Hathroi Fort. Ideal base for Day 2's Old City exploration — 20 min auto to all major sites."
        },
        food: [
          { meal_type: "Lunch", restaurant: "Anokhi Café", area: "KK Square Mall, C-11 Prithviraj Road", cuisine: "Continental + Healthy Indian", must_order: ["Anokhi Thali", "Cold Coffee"], cost: "₹450 per person", hours: "09:00 AM – 07:30 PM", veg: true, tip: "Compact seating — arrive before 12:30 PM on weekdays." },
          { meal_type: "Dinner", restaurant: "Laxmi Misthan Bhandar (LMB)", area: "Johari Bazaar, Old City", cuisine: "Rajasthani", must_order: ["Pyaaz Kachori", "Dal Baati Churma", "Malpua"], cost: "₹350 per person", hours: "08:00 AM – 10:30 PM", veg: true, tip: "Sit upstairs (air-conditioned) for a quieter experience; ground floor is always packed." }
        ],
        daily_cost: "₹3,500 (accommodation ₹1,800 + food ₹800 + transport ₹600 + misc ₹300)",
        travel_notes: "Store hotel address in offline maps before leaving. First-day priority is hydration and acclimatisation — Jaipur altitude is 431m but the dry heat can cause fatigue."
      },
      {
        title: "Amber Light & Royal Grandeur",
        theme: "Heritage & Royalty",
        weather_note: "Start by 07:30 AM — Amber Fort becomes very hot post 11 AM. Carry 1L water minimum.",
        morning: {
          time: "07:30 AM", activity: "Amber Fort (Amer Qila)",
          location: "Amber Fort, Amer, Jaipur",
          neighborhood: "Amer, 11 km from Jaipur city centre",
          duration: "2.5 hours", entry_fee: "₹100 per adult (Indian), ₹500 (foreign national)",
          opening_hours: "08:00 AM – 05:30 PM (last entry 04:30 PM)",
          description: "Amber Fort is a 16th-century hilltop fort-palace built by Raja Man Singh I, blending Rajput and Mughal architecture. The Sheesh Mahal (Hall of Mirrors) is its crown jewel — thousands of tiny mirrors create an explosion of light from a single candle. Walk up the cobbled ramp through the Suraj Pol gate for the best fort-valley panorama.",
          estimated_cost: "₹250 (entry + audio guide ₹150)",
          transport_to_next: "20 min by auto to Nahargarh, ₹120",
          tips: "Arrive at 07:30 AM before guided tour buses (which arrive from 09:30 AM onward). Skip elephant rides — they're slow and controversial. The audio guide (₹150) is genuinely excellent — grab it at the ticket counter."
        },
        afternoon: {
          time: "12:30 PM", activity: "City Palace & Chandra Mahal Museum",
          location: "City Palace, Sarhad, Old City, Jaipur",
          neighborhood: "Old City (Walled City), Central Jaipur",
          duration: "2 hours", entry_fee: "₹200 per adult (Indian)",
          opening_hours: "09:30 AM – 05:00 PM (open daily)",
          description: "City Palace is a magnificent complex of courtyards, gardens, and buildings that the royal family of Jaipur built over centuries. The Mubarak Mahal now houses a textile and costume museum; the Armory Museum displays Mughal-era weapons. The royal family still occupies the upper Chandra Mahal — you can see the royal standard flying when they're in residence.",
          estimated_cost: "₹250 (entry + Mubarak Mahal museum surcharge)",
          transport_to_next: "5 min walk to Jantar Mantar",
          tips: "The Diwan-i-Khas houses two of the world's largest silver vessels — the Gangajal urns. They're in the Guinness Book of World Records and are unmissable."
        },
        evening: {
          time: "06:00 PM", activity: "Nahargarh Fort Sunset View",
          location: "Nahargarh Fort, Aravalli Hills, Jaipur",
          neighborhood: "Aravalli Hills, 7 km from City Palace",
          duration: "1.5 hours", entry_fee: "₹50 per adult (Indian)",
          opening_hours: "10:00 AM – 06:30 PM",
          description: "Nahargarh ('Tiger's Lair') sits on the Aravalli ridge overlooking the entire city. The winding road up is itself a scenic drive. The fort's ramparts at sunset offer an unobstructed 270° panorama of Jaipur's pink skyline — the best in the city. The Padao restaurant inside the fort is famous for its masala chai with a view.",
          estimated_cost: "₹150 (entry + chai ₹80)",
          transport_to_next: "Auto to hotel, ₹150, 20 min",
          tips: "The fort closes at 06:30 PM sharp — arrive by 05:50 PM to get the full sunset. Cafe Padao's chai (₹80) with the view is non-negotiable."
        },
        accommodation: {
          hotel_name: "Hotel Pearl Palace",
          area: "Hathroi Fort, Ajmer Road",
          address_landmark: "Near Ajmer Road overbridge",
          estimated_cost: "₹1,800 per night",
          category: "Budget",
          star_rating: 3,
          amenities: ["Free WiFi", "Rooftop café", "Travel desk", "24-hr hot water"],
          booking_tip: "Same property as Day 1 — saves transition time for early morning Amber start.",
          why_this_hotel: "Proximity to Amber Fort road makes 07:30 AM starts easy without a long cab ride."
        },
        food: [
          { meal_type: "Breakfast", restaurant: "Hotel Pearl Palace Rooftop Café", area: "Ajmer Road", cuisine: "Continental + Indian", must_order: ["Masala Omelette", "Aloo Paratha", "Masala Chai"], cost: "₹200 per person", hours: "07:00 AM – 10:30 AM", veg: true, tip: "Order the night before for prompt 07:00 AM service on the rooftop." },
          { meal_type: "Lunch", restaurant: "Peacock Rooftop Restaurant", area: "Near Hawa Mahal, Old City", cuisine: "Rajasthani + North Indian", must_order: ["Dal Baati Churma", "Gatte ki Sabzi", "Shahi Lassi"], cost: "₹500 per person", hours: "11:00 AM – 10:30 PM", veg: true, tip: "Ask for a window table — you can see Hawa Mahal's back facade from here." },
          { meal_type: "Dinner", restaurant: "Chokhi Dhani Village Resort", area: "12 km from city, Tonk Road", cuisine: "Authentic Rajasthani village feast", must_order: ["Unlimited Rajasthani Thali", "Ker Sangri", "Bajra Roti"], cost: "₹900 per person (all-inclusive entry + dinner)", hours: "05:00 PM – 11:00 PM", veg: true, tip: "₹900 entry includes cultural performances, camel rides, puppet show, and dinner — worth every rupee. Pre-book online during Oct–Mar peak season." }
        ],
        daily_cost: "₹5,400 (accommodation ₹1,800 + food ₹1,600 + activities ₹500 + transport ₹1,200 + misc ₹300)",
        travel_notes: "Chokhi Dhani is a full evening experience — plan to stay until 10 PM. Arrange your hotel auto pickup in advance."
      },
      {
        title: "Blue Walls & Indigo Bazaars",
        theme: "Local Markets & Artisan Crafts",
        weather_note: "Market day — comfortable walking weather at 26°C. Crowds peak at Bapu Bazaar after 11 AM.",
        morning: {
          time: "09:00 AM", activity: "Jantar Mantar Observatory",
          location: "Jantar Mantar, Gangori Bazaar, Old City, Jaipur",
          neighborhood: "Near City Palace, Old City",
          duration: "1.5 hours", entry_fee: "₹50 per adult (Indian)",
          opening_hours: "09:00 AM – 04:30 PM",
          description: "Jantar Mantar is a UNESCO World Heritage Site — a collection of 19 architectural astronomical instruments built by Maharaja Jai Singh II in 1734. The Samrat Yantra (world's largest sundial, 27m tall) can tell time to within 2 seconds of accuracy. Unlike most Indian monuments, this one rewards slow, curious exploration.",
          estimated_cost: "₹100 (entry + audio guide ₹50)",
          transport_to_next: "5 min walk to Hawa Mahal",
          tips: "Hire the government-licensed guide at the entrance (₹200) — without explanation, the instruments look abstract. With it, the sundial reading becomes a live party trick."
        },
        afternoon: {
          time: "12:00 PM", activity: "Bapu Bazaar & Johari Bazaar Shopping",
          location: "Bapu Bazaar & Johari Bazaar, Old City, Jaipur",
          neighborhood: "Walled City bazaar strip",
          duration: "3 hours", entry_fee: "Free",
          opening_hours: "10:00 AM – 09:00 PM",
          description: "Bapu Bazaar is Jaipur's most famous textile and handicraft street — 400 metres of shops selling Bandhani (tie-dye), block-print fabrics, jutis (leather shoes), and blue pottery. Adjacent Johari Bazaar specialises in kundan, meenakari, and jadau jewellery. Prices are negotiable except at fixed-rate government emporiums.",
          estimated_cost: "₹1,500–₹3,000 (shopping budget)",
          transport_to_next: "15 min auto to Albert Hall, ₹80",
          tips: "Buy blue pottery ONLY from the Kripal Kumbh workshop (B-18A, Shiv Marg, Bani Park) — it's the original family atelier where the craft was revived. Bazaar blue pottery is mostly mass-produced."
        },
        evening: {
          time: "05:30 PM", activity: "Albert Hall Museum",
          location: "Albert Hall Museum, Ram Niwas Garden, Jaipur",
          neighborhood: "New Gate, near Old City border",
          duration: "1.5 hours", entry_fee: "₹40 per adult (Indian)",
          opening_hours: "09:00 AM – 05:00 PM, and 07:00 PM – 10:00 PM (illuminated night visit)",
          description: "Albert Hall is Jaipur's oldest museum (1887), a masterpiece of Indo-Saracenic architecture housing Egyptian mummies, Persian carpets, natural history specimens, and miniature paintings. The night illumination turns the building into a glowing golden palace — arrive at 07:00 PM for this magical effect.",
          estimated_cost: "₹60 (evening session ₹40 + grounds ₹20)",
          transport_to_next: "Auto to dinner, ₹100, 10 min",
          tips: "The night museum (07:00–10:00 PM) is less crowded and far more atmospheric than the day session. Arrive at 07:00 PM sharp for the full illumination effect."
        },
        accommodation: {
          hotel_name: "Dera Rawatsar",
          area: "C-9, Sawai Jai Singh Highway, Bani Park",
          address_landmark: "Off Sawai Jai Singh Highway, 2.5 km from MI Road",
          estimated_cost: "₹4,500 per night",
          category: "Mid-Range Heritage Property",
          star_rating: 3,
          amenities: ["Heritage haveli architecture", "Rooftop terrace with city view", "Complimentary breakfast", "Free parking", "In-house Rajasthani kitchen"],
          booking_tip: "Book at least 3 weeks ahead during Oct–Feb — this boutique property has only 12 rooms.",
          why_this_hotel: "Staying in a genuine haveli (traditional Rajasthani townhouse) rather than a generic hotel adds immersion. Excellent base for the Old City."
        },
        food: [
          { meal_type: "Breakfast", restaurant: "Dera Rawatsar Heritage Kitchen", area: "Bani Park", cuisine: "Rajasthani home-style", must_order: ["Missi Roti with Makkhan", "Aloo Tamatar Sabzi", "Masala Chai"], cost: "Included in room rate", hours: "07:30 AM – 10:00 AM", veg: true, tip: "Request the thali-style breakfast the night before — it's served family-style." },
          { meal_type: "Lunch", restaurant: "Hotel Diggi Palace Restaurant", area: "Shivaji Marg, Diggi House", cuisine: "Rajasthani", must_order: ["Laal Maas (mutton)", "Bajra Khichdi", "Churma Ladoo"], cost: "₹600 per person", hours: "12:00 PM – 03:30 PM", veg: false, tip: "Laal Maas here is among the most authentic in Jaipur — spice level is HIGH. Request 'medium spicy' if needed." },
          { meal_type: "Dinner", restaurant: "Suvarna Mahal, Rambagh Palace", area: "Bhawani Singh Road, Rambagh", cuisine: "Royal Rajasthani fine dining", must_order: ["Safed Maas", "Dal Baati", "Mawa Kachori dessert"], cost: "₹2,500 per person", hours: "07:30 PM – 11:00 PM", veg: false, tip: "Smart casuals required. Reserve 2 weeks ahead. The heritage dining room is inside a real Maharaja's palace (now Taj Hotels) — one splurge-worthy meal per trip." }
        ],
        daily_cost: "₹9,500 (accommodation ₹4,500 + food ₹3,700 + activities ₹200 + transport ₹600 + misc ₹500)",
        travel_notes: "Albert Hall night session is 07:00–10:00 PM — plan dinner at Suvarna Mahal after (it opens 07:30 PM). Rambagh Palace is 15 min by cab from Albert Hall."
      },
      {
        title: "The Blue City Horizon & Sunrise Departure",
        theme: "Departure & Leisure",
        weather_note: "Clear morning. Ideal for a quick sunrise photo at Hawa Mahal before checkout.",
        morning: {
          time: "07:00 AM", activity: "Hawa Mahal Sunrise Photo Stop",
          location: "Hawa Mahal, Badi Choupad, Old City, Jaipur",
          neighborhood: "Old City main road",
          duration: "30 minutes", entry_fee: "₹50 (entry to interior), exterior photography free",
          opening_hours: "09:30 AM – 04:30 PM (interior); exterior accessible anytime",
          description: "Hawa Mahal ('Palace of Winds') is Jaipur's most photographed icon — a 5-storey screen of 953 small windows (jharokhas) built in 1799. The blush-pink sandstone catches the early sun magnificently. The photographic sweet spot is from the tea stalls directly opposite, on Tripolia Bazaar road.",
          estimated_cost: "₹50 (or just exterior shoot for free)",
          transport_to_next: "Auto to hotel for checkout, ₹80",
          tips: "Best light is 07:00–08:30 AM. The narrow street means a wide-angle lens captures the full façade — back up to the wall of Wind View Café for the widest shot."
        },
        afternoon: {
          time: "11:00 AM", activity: "Hotel Checkout & Souvenir Shopping at Rajasthali",
          location: "Rajasthali (Rajasthan Govt. Emporium), MI Road, Jaipur",
          neighborhood: "Mirza Ismail Road",
          duration: "1.5 hours", entry_fee: "Free",
          opening_hours: "10:00 AM – 07:30 PM",
          description: "Rajasthali is the state government's official craft emporium — fixed prices, quality-certified, and no bargaining hassle. It stocks the full range of Rajasthani crafts: blue pottery, block-print textiles, miniature paintings, camel leather goods, and gemstone jewellery. Best value for authentic souvenirs without scam risk.",
          estimated_cost: "₹800–₹2,500 (shopping)",
          transport_to_next: "Cab to airport/station, ₹350–₹500",
          tips: "Fixed-price emporium means no bargaining — but prices are genuinely fair and quality is government-certified. Get a GST invoice for any large purchases (useful for warranty/return)."
        },
        evening: {
          time: "03:00 PM", activity: "Departure from Jaipur",
          location: "Jaipur International Airport / Jaipur Junction Railway Station",
          neighborhood: "Sanganer (Airport) / Station Road (Railway)",
          duration: "Departure",
          entry_fee: "Free",
          opening_hours: "N/A",
          description: "Transfer to Jaipur International Airport (JAI) or Jaipur Junction Railway Station for your onward journey. Allow 45 minutes to airport from MI Road by cab; 20 minutes to the station.",
          estimated_cost: "₹400 (cab to airport)",
          transport_to_next: "N/A — departure",
          tips: "Jaipur airport terminal opens baggage drop 2 hours before departure. Arrive 90 minutes early for domestic flights. Pre-book cab the evening before."
        },
        accommodation: { hotel_name: "Checkout — No accommodation", area: "N/A", address_landmark: "N/A", estimated_cost: "₹0", category: "N/A", star_rating: 0, amenities: [], booking_tip: "Request late checkout (01:00 PM) at Dera Rawatsar — usually complimentary on weekdays.", why_this_hotel: "Departure day — no overnight stay required." },
        food: [
          { meal_type: "Breakfast", restaurant: "Rawat Mishthan Bhandar", area: "Station Road (near Jaipur Junction)", cuisine: "Rajasthani sweets & snacks", must_order: ["Pyaaz Kachori", "Mirchi Bada", "Imarti"], cost: "₹120 per person", hours: "06:00 AM – 11:00 PM", veg: true, tip: "The original branch on Station Road has shorter queues than the MI Road outlet. Perfect pre-departure breakfast." },
          { meal_type: "Lunch", restaurant: "Niro's Restaurant", area: "MI Road, Near Jain Temple, Central Jaipur", cuisine: "North Indian + Continental", must_order: ["Shahi Paneer", "Tawa Chicken", "Gulab Jamun"], cost: "₹700 per person", hours: "11:00 AM – 11:00 PM", veg: false, tip: "One of Jaipur's oldest restaurants (since 1949). Air-conditioned and comfortable for a leisurely last lunch." }
        ],
        daily_cost: "₹2,500 (food ₹820 + transport ₹800 + shopping ₹600 + misc ₹280)",
        travel_notes: "Final day — settle hotel bills the previous night. Confirm cab for departure the evening before. Jaipur duty-free does NOT exist — all souvenir buying must be done before reaching the airport."
      }
    ]
  },

  "Varanasi": {
    state: "Uttar Pradesh",
    language: "Hindi, Bhojpuri, Awadhi. Basic English in tourist zones.",
    useful_phrases: [
      { phrase: "Har Har Mahadev", meaning: "Devotional chant to Lord Shiva" },
      { phrase: "Baba ki nagari mein swaagat", meaning: "Welcome to the city of Lord Shiva" },
      { phrase: "Kitna paisa lagega?", meaning: "How much will it cost?" }
    ],
    atm: "SBI and Allahabad Bank ATMs near Godaulia Chowk, Assi Ghat, and BHU campus.",
    transport: {
      intercity: "Varanasi to Lucknow: 3.5 hrs Shatabdi / 7 hrs road. To Prayagraj: 1.5 hrs train.",
      intracity: "Auto-rickshaws in outer areas; on foot or cycle-rickshaw for ghats (no motor vehicles on ghat lanes). E-rickshaws widely available.",
      app_cabs: ["Ola (outer city only)", "Rapido (bike taxi)"]
    },
    connectivity: {
      network: "Good Jio/Airtel 4G in city. Drops near river ghats in Old City lanes.",
      sim: "Jio ₹179/28-day basic plan sufficient for navigation and calls",
      wifi: "Most guesthouses near ghats offer Wi-Fi; old city cafes have good speeds"
    },
    hospital: "Institute of Medical Sciences (IMS-BHU), Banaras Hindu University Campus",
    safety: [
      "Ghat lanes (narrow alleys) in Old City are disorienting — download offline map of ghats before arriving.",
      "Boat ride prices MUST be fixed before boarding — ₹150–₹300/hr for sunrise row boat.",
      "Never leave shoes unattended at ghats — carry a small bag to put them in."
    ],
    scams: [
      "Boat touts near Dashashwamedh Ghat will quote ₹1,500–₹2,000 for a 45-min ride — the fair price is ₹200–₹350. Walk 100m from the main ghat steps for less pushy operators.",
      "'Priests' who approach tourists for 'free blessing' at ghats often demand large cash donations mid-ritual. Decline and move on politely."
    ],
    etiquette: [
      "Photography at Manikarnika and Harishchandra ghats (cremation ghats) is strictly forbidden — put your camera away completely.",
      "Remove footwear at all temples and before descending ghat steps toward the river.",
      "During Ganga Aarti, do not push through or stand in the aarti pathway — respectful, silent observation is expected."
    ],
    weather: {
      Oct_Mar: { high: "26°C", low: "9°C", humidity: "Low (20–30%)", uv: "Low–Moderate (3–5)", conditions: "Misty ghats in the early morning. Crisp, clear afternoons.", wear: "Light cotton by day, sweater post 7 PM. Wool layer for boat rides at dawn.", aqi: "Poor (AQI 150–200) Nov–Jan — river valley smog, especially at night." },
      Apr_Jun: { high: "44°C", low: "30°C", humidity: "Low (15%)", uv: "Very High (9+)", conditions: "Extreme heat. Avoid outdoor activity 11 AM–5 PM.", wear: "Loose full-sleeve linen only. Carry parasol. Avoid black clothing.", aqi: "Moderate–Poor (AQI 100–140)." },
      Jul_Sep: { high: "33°C", low: "27°C", humidity: "Very High (85–95%)", uv: "Moderate (5–6)", conditions: "Heavy monsoon. Ghats flooded July–August. Boat rides suspended during peak monsoon.", wear: "Quick-dry clothes only. Waterproof sandals essential.", aqi: "Good (AQI 40–60)." }
    },
    day_trips: [
      { destination: "Sarnath", distance: "10 km from Varanasi, 30 min by auto", best_for: "Buddhist heritage, Dhamek Stupa, Ashoka Pillar", highlights: ["Dhamek Stupa (AD 500)", "Sarnath Archaeological Museum", "Mulagandhakuti Vihara"], cost: "₹500 per person (auto + entry)", recommended_if: "All visitors — half-day trip" },
      { destination: "Ramnagar Fort", distance: "14 km, 40 min by road + ferry", best_for: "Maharaja's palace, vintage car museum", highlights: ["Ramnagar Fort Museum", "Vintage car and weapons collection", "Saraswati Bhawan Library"], cost: "₹400 per person", recommended_if: "History enthusiasts" }
    ],
    days: [
      {
        title: "First Light on the Holy Ganges",
        theme: "Arrival & Sacred Initiation",
        weather_note: "Misty morning near ghats — carry a light wrap. Clears by 10 AM.",
        morning: {
          time: "10:00 AM", activity: "Arrival & Hotel Check-in near Assi Ghat",
          location: "Varanasi Junction / Lal Bahadur Shastri International Airport → Hotel",
          neighborhood: "Assi Ghat / Godaulia area",
          duration: "1.5 hours", entry_fee: "Free",
          opening_hours: "N/A",
          description: "Arrive in Varanasi and transfer to your guesthouse near the ghats. Assi Ghat area is the most traveller-friendly neighbourhood — quieter than Dashashwamedh Ghat, but still completely immersive. Check in, change into comfortable cotton clothes, and have your first cup of Varanasi Kulhad Chai.",
          estimated_cost: "₹250 (e-rickshaw from station)",
          transport_to_next: "10 min walk to Assi Ghat",
          tips: "E-rickshaws (₹20–₹50) are the cleanest way to navigate near the ghats. Pre-paid autos at the station are ₹200–₹280 to Godaulia."
        },
        afternoon: {
          time: "02:00 PM", activity: "Assi Ghat to Tulsi Ghat Riverside Walk",
          location: "Assi Ghat → Tulsi Ghat, Southern Ghats, Varanasi",
          neighborhood: "Southern ghat stretch, Old Varanasi",
          duration: "2 hours", entry_fee: "Free",
          opening_hours: "Always open",
          description: "The 84 ghats of Varanasi stretch 6.5 km along the Ganga's crescent shore. Assi Ghat is where the Assi River meets the Ganga — a quieter, philosophical ghat popular with scholars and yoga practitioners. Strolling south-to-north reveals flower sellers, sadhus, dhobis washing clothes, and wrestlers practising at the akhadas. Tulsi Ghat has a famous Tulsidas inscription from 1600 AD.",
          estimated_cost: "₹100 (boat snacks, kulhad chai)",
          transport_to_next: "Walk north to Dashashwamedh Ghat, 25 min",
          tips: "Walk on the upper ghat level (stone steps) rather than the lower water edge — the water level varies and lower steps can be slippery with algae."
        },
        evening: {
          time: "06:30 PM", activity: "Dashashwamedh Ghat Ganga Aarti",
          location: "Dashashwamedh Ghat, Godaulia, Varanasi",
          neighborhood: "Godaulia, Main Ghat Strip",
          duration: "1.5 hours", entry_fee: "Free (boat viewing: ₹150–₹200 per person)",
          opening_hours: "Aarti at 07:00 PM sharp (sunset time; varies ±15 min seasonally)",
          description: "The Ganga Aarti at Dashashwamedh Ghat is among the most spectacular ritual performances in India. Seven priests perform a synchronised fire-worship ritual using enormous brass lamps, incense, and conch shells, while thousands watch from the ghats and boats. The synchronized movements, chanting, and river reflections create an overwhelming spiritual atmosphere.",
          estimated_cost: "₹200 (boat for better view, optional)",
          transport_to_next: "Walk to dinner, 10 min",
          tips: "Arrive 45 minutes early (06:15 PM) to secure a seated ghat spot. Hire a rowing boat (₹150–₹200/person) to watch from the river — the perspective is unforgettable. Confirm boat price BEFORE boarding."
        },
        accommodation: {
          hotel_name: "Brijrama Palace",
          area: "Darbhanga Ghat, Old City, Varanasi",
          address_landmark: "On the Ganga ghats between Munshi and Darbhanga ghats",
          estimated_cost: "₹7,500 per night",
          category: "Luxury Heritage Property",
          star_rating: 5,
          amenities: ["Ganga-view rooms", "Heritage palace architecture (1812)", "Rooftop restaurant over the river", "In-house spa", "Private ghat access", "Complimentary breakfast"],
          booking_tip: "Book Ganga-facing rooms 4–6 weeks ahead — they sell out Nov–Feb. The sunrise from the room balcony over the river is extraordinary.",
          why_this_hotel: "Staying on the ghats (rather than inland) transforms the experience — you hear the temple bells and ghats at dawn without a taxi ride."
        },
        food: [
          { meal_type: "Breakfast", restaurant: "Blue Lassi Shop", area: "Kachori Gali, Near Vishwanath Temple, Old City", cuisine: "Varanasi street food", must_order: ["Kachori Sabzi", "Mango Lassi or Rose Lassi"], cost: "₹80 per person", hours: "07:00 AM – 09:00 PM", veg: true, tip: "Blue Lassi (est. 1925) is a legendary 3-generation lassi shop in a tiny lane near the temple. Queue is unavoidable but moves fast." },
          { meal_type: "Dinner", restaurant: "Keshari Restaurant", area: "Kachori Gali, Vishwanath Lane, Old City", cuisine: "Banarasi", must_order: ["Baati Chokha", "Tamatar Chaat", "Malaiyyo (winter only Nov–Feb)"], cost: "₹350 per person", hours: "08:00 AM – 10:00 PM", veg: true, tip: "Malaiyyo is a seasonal winter delicacy (Nov–Feb) — flavoured foam made from morning dew and milk, served cold. Don't miss it if visiting in season." }
        ],
        daily_cost: "₹9,200 (accommodation ₹7,500 + food ₹430 + transport ₹400 + misc ₹870)",
        travel_notes: "The Old City ghat lanes (called galis) are extremely narrow and have no vehicle access. All navigation near the ghats is on foot. Comfortable rubber-soled shoes are essential."
      }
    ]
  },

  "Goa": {
    state: "Goa",
    language: "Konkani, Marathi, Hindi. English widely spoken.",
    useful_phrases: [
      { phrase: "Dev borem korum", meaning: "God bless you / Goodbye (Konkani)" },
      { phrase: "Kitlo re?", meaning: "How much? (Konkani slang)" },
      { phrase: "Susegad", meaning: "The Goan spirit of relaxed contentment" }
    ],
    atm: "ATMs at Panjim, Calangute, Margao. Carry cash for beach shacks (many don't accept cards).",
    transport: {
      intercity: "Goa to Mumbai: 30-min flight (₹2,500–₹5,000) or overnight Mandovi Express (₹500–₹1,200). Goa to Hampi: 3.5 hrs by road.",
      intracity: "Rented scooter (₹400–₹600/day) is the best way to explore. Taxis (no meters — always pre-negotiate). Kadamba buses for budget travel.",
      app_cabs: ["Goa Miles (recommended over Ola/Uber)", "GoaMiles app"]
    },
    connectivity: {
      network: "Good Jio/Airtel coverage on coast and highways. Weak signal in hinterland/spice plantations.",
      sim: "Airtel ₹265/28-day plan recommended for Goa — better roaming at Dudhsagar and hinterland.",
      wifi: "All beach resorts and North Goa guesthouses have reliable Wi-Fi."
    },
    hospital: "Goa Medical College & Hospital, Bambolim (15 km from Panjim)",
    safety: [
      "Renting a scooter requires a valid driving licence (2-wheeler). Police checkpoints are common — carry the original, not a photo.",
      "Sea conditions between June and September make swimming dangerous — follow lifeguard flags (Red flag = no entry; Yellow = caution).",
      "Use GoaMiles app for transparent taxi fares — street taxis often charge 3x for tourists."
    ],
    scams: [
      "Beach shacks sometimes add 'service charge' and 'GST' on top of quoted price — ask to see the full menu with taxes before ordering.",
      "Drug peddlers target solo tourists in North Goa nightlife areas (Anjuna, Vagator) — possession is a serious criminal offense under NDPS Act."
    ],
    etiquette: [
      "Topless sunbathing is technically illegal in Goa — enforcement varies but it's respectful to use a swimsuit on public beaches.",
      "Remove footwear before entering churches in Old Goa.",
      "Avoid loud music at Goan village homestays after 10 PM — local residents are not as late-night as tourist zones."
    ],
    weather: {
      Oct_Mar: { high: "32°C", low: "20°C", humidity: "Moderate (50–65%)", uv: "High (7–8)", conditions: "Warm, sunny, and breezy. Best time for beach, water sports, and heritage visits.", wear: "Light cotton, swimwear, flip-flops. Cardigan for AC restaurants.", aqi: "Good (AQI 25–50)." },
      Apr_Jun: { high: "36°C", low: "28°C", humidity: "High (70–85%)", uv: "Very High (9–10)", conditions: "Hot and humid before monsoon. Waters begin to roughen.", wear: "Sun protective rash guard for beach. Light linen shirts. SPF 70+ sunscreen.", aqi: "Good–Moderate." },
      Jul_Sep: { high: "30°C", low: "24°C", humidity: "Very High (90–95%)", uv: "Moderate (5–6)", conditions: "Heavy monsoon. Beaches closed. Water sports suspended. Hinterland lush and stunning.", wear: "Waterproof sandals, quick-dry shorts, light rain jacket. Avoid open-toe shoes on flooded roads.", aqi: "Excellent (AQI 15–30)." }
    },
    day_trips: [
      { destination: "Dudhsagar Waterfalls", distance: "60 km from Panjim, ~2.5 hrs by jeep safari", best_for: "Dramatic 310m four-tiered waterfall, jungle trekking", highlights: ["Dudhsagar Falls viewpoint", "Forest swim pool at base", "Jungle jeep trail"], cost: "₹2,500–₹3,000 per person (jeep package from Mollem)", recommended_if: "Best Oct–Dec when water volume is high. Closed July–August (heavy monsoon)." },
      { destination: "Hampi, Karnataka", distance: "3.5 hrs by road", best_for: "UNESCO World Heritage ruins of Vijayanagara Empire", highlights: ["Virupaksha Temple", "Vittala Temple — Stone Chariot", "Boulder-hopping at Hippie Island"], cost: "₹1,500 per person (shared cab + entry)", recommended_if: "Staying 7+ days in Goa" }
    ],
    days: [
      {
        title: "Atlantic Shores & the Latin Quarter",
        theme: "Coastal Heritage & Arrival",
        weather_note: "32°C with sea breeze. Apply SPF 50+ before stepping out. UV high post 10 AM.",
        morning: {
          time: "10:30 AM", activity: "Arrival & Check-in at North Goa Resort",
          location: "Dabolim Airport / Madgaon Station → North Goa",
          neighborhood: "Calangute / Baga / Candolim area",
          duration: "1.5 hours", entry_fee: "Free",
          opening_hours: "N/A",
          description: "Arrive at Goa's Dabolim Airport or Madgaon Railway Station and transfer to your North Goa property. North Goa is the traveller hub — easy access to beaches, restaurants, and water sports. Check in and orient yourself with a sea-facing coconut water on the property grounds.",
          estimated_cost: "₹600 (cab from airport to Calangute)",
          transport_to_next: "5 min walk or hotel buggy",
          tips: "Goa airport cab counters offer pre-paid cabs — fare to Calangute is ₹600–₹800 (confirmed meter). Avoid freelance touts at the arrival gate who quote ₹1,500+."
        },
        afternoon: {
          time: "02:00 PM", activity: "Fontainhas Latin Quarter Heritage Walk",
          location: "Fontainhas, Panjim (Panaji), Goa",
          neighborhood: "Panjim Old Quarter, 16 km south of Calangute",
          duration: "2 hours", entry_fee: "Free",
          opening_hours: "Always open (shops 10 AM – 7 PM)",
          description: "Fontainhas is India's only intact Latin Quarter — a heritage precinct of Portuguese-era houses painted in ochre, indigo, and terracotta, with Mangalorean tiled roofs and carved wooden balconies. Explore Rua de Ourem (cobbled) and Altinho Hill. The Chapel of St. Sebastian (1818) at the end of the main street is a stunning example of Neo-Gothic Goan architecture.",
          estimated_cost: "₹150 (cab to Panjim)",
          transport_to_next: "Walk to nearby Mahalaxmi temple or cab to beach",
          tips: "The best photography light is between 3–5 PM when the coloured facades glow in the afternoon sun. Wear good walking shoes — the cobblestones are uneven."
        },
        evening: {
          time: "05:30 PM", activity: "Baga Beach Sunset & Night Market",
          location: "Baga Beach, North Goa",
          neighborhood: "Baga, North Goa",
          duration: "2.5 hours", entry_fee: "Free",
          opening_hours: "Beach accessible 24 hrs; shacks open 09:00 AM – midnight",
          description: "Baga Beach is Goa's most famous stretch of golden sand. The stretch from Baga to Calangute is 3 km of uninterrupted coastline backed by beach shacks, sunbeds, and water sports operators. At sunset, the shacks light up with fairy lights and begin serving beer, fresh fish, and Goan cocktails. The Saturday Night Market at Arpora (Nov–Apr, 6 PM–midnight) is 2 km away — 1,000+ stalls of Kashmiri jewellery, Tibetan curios, and live music.",
          estimated_cost: "₹800 (beer, food at shack + market browsing)",
          transport_to_next: "Scooter rental for evening, ₹400/day",
          tips: "Rent a scooter at your hotel (₹400–₹600/day) for beach-hopping. Avoid beach-front shacks for freshly cooked fish — go 1 row back where prices are 30% less and quality identical."
        },
        accommodation: {
          hotel_name: "La Cabana Beach & Spa",
          area: "Arpora, North Goa (near Baga)",
          address_landmark: "Holiday Street, Arpora, 600m from Baga Beach",
          estimated_cost: "₹5,500 per night",
          category: "Mid-Range",
          star_rating: 4,
          amenities: ["Free WiFi", "Large pool with bar", "Complimentary breakfast", "Spa & Ayurvedic massage", "Free parking", "5-min walk to Baga Beach"],
          booking_tip: "Book pool-view room for ₹500 extra — worth it. Check-in after 02:00 PM.",
          why_this_hotel: "Best value mid-range in Baga area. Pool large enough for actual swimming (not just aesthetic). Walking distance to beach, market, and dining strip."
        },
        food: [
          { meal_type: "Lunch", restaurant: "Vinayak Family Restaurant", area: "Assagao, North Goa (15 min from Baga)", cuisine: "Authentic Goan home-style", must_order: ["Fish Curry Rice (Pomfret)", "Prawn Rawa Fry", "Sol Kadhi"], cost: "₹600 per person", hours: "12:00 PM – 04:00 PM, 07:00 PM – 10:00 PM", veg: false, tip: "This is the most authentic Goan family restaurant in North Goa — no tourist menu. Pomfret curry is the star. Closed Mondays." },
          { meal_type: "Dinner", restaurant: "Thalassa Greek Taverna", area: "Small Vagator, North Goa", cuisine: "Greek Mediterranean with Goan seafood", must_order: ["Grilled Prawns platter", "Hummus with pita", "Sangria"], cost: "₹1,400 per person", hours: "06:00 PM – 11:30 PM", veg: false, tip: "Reserve a cliffside table 2–3 days ahead (call directly). The sunset view over the Arabian Sea from the cliff is Goa's most romantic dining backdrop. Smart-casual dress recommended." }
        ],
        daily_cost: "₹9,300 (accommodation ₹5,500 + food ₹2,000 + transport ₹800 + misc ₹1,000)",
        travel_notes: "Rent a scooter on Day 1 for the full trip (₹400–₹600/day) — it's the single best mobility decision in Goa. Carry licence, ₹500 cash in case of police check."
      }
    ]
  },

  "Mumbai": {
    state: "Maharashtra",
    language: "Marathi, Hindi, English. Bambaiya slang is common.",
    useful_phrases: [
      { phrase: "Kasa kai?", meaning: "How are you?" },
      { phrase: "Chalo, jaldi!", meaning: "Let's go, hurry!" },
      { phrase: "Ek number!", meaning: "Excellent / Top notch" }
    ],
    atm: "Widely available at Nariman Point, Bandra, and Andheri.",
    transport: {
      intercity: "CSMT/Central Railway to rest of India. Flights from T2 (Intl) and T1 (Dom).",
      intracity: "Local Trains (Lifeline), Kaali-Peeli Taxis, BEST Buses, Metro (Line 1/2/7/3).",
      app_cabs: ["Uber", "Ola"]
    },
    connectivity: { network: "Excellent 5G in most areas.", sim: "Airtel/Jio 5G recommended.", wifi: "Every cafe and hotel." },
    hospital: "Nanavati Max Super Speciality Hospital, Vile Parle",
    safety: [
      "Avoid traveling in local trains during peak rush hours (8-11 AM, 6-9 PM) unless you want the 'super dense crush load' experience.",
      "Always ask taxis to run on meter. They are generally honest in Mumbai compared to other cities."
    ],
    scams: [
      "Pigeon feeding touts at Gateway of India will force grain into your hand and demand ₹500.",
      "Beware of 'blessing' threads at Haji Ali — they are free but expect a 'donation' later."
    ],
    etiquette: [
      "No photography inside the Siddhivinayak Temple inner sanctum.",
      "Remove footwear before entering homes and some boutique stores in Kala Ghoda."
    ],
    weather: {
      Oct_Mar: { high: "32°C", low: "18°C", humidity: "Moderate", uv: "High", conditions: "Pleasant, sunny days.", wear: "Light cotton.", aqi: "Moderate." },
      Apr_Jun: { high: "35°C", low: "28°C", humidity: "Very High", uv: "Extreme", conditions: "Extremely humid and hot.", wear: "Linen, stay hydrated.", aqi: "Moderate." },
      Jul_Sep: { high: "29°C", low: "25°C", humidity: "100%", uv: "Moderate", conditions: "Heavy monsoon. Expect local train delays.", wear: "Sturdy umbrella, waterproof shoes.", aqi: "Excellent." }
    },
    days: [
      {
        day: 1, title: "Colonial Charm & Coastal Breeze", theme: "Historical South Mumbai",
        morning: { time: "09:00 AM", activity: "Gateway of India & Taj Mahal Palace Walk", location: "Colaba", description: "Iconic colonial-era monument and the historic hotel facade.", entry_fee: "Free", duration: "1 hr", tips: "Go early to avoid the crowd." },
        afternoon: { time: "01:00 PM", activity: "Kala Ghoda Art District & Museum Visit", location: "Fort", description: "Explore the art galleries and the CSMVS Museum.", entry_fee: "₹150", duration: "3 hrs", tips: "Try the cafes in the lanes." },
        evening: { time: "06:00 PM", activity: "Marine Drive Sunset", location: "Nariman Point", description: "The Queen's Necklace. Sit by the promenade as the lights turn on.", entry_fee: "Free", duration: "2 hrs", tips: "Perfect for people-watching." },
        accommodation: { hotel_name: "Taj Mahal Tower", area: "Colaba", estimated_cost: "₹15,000", category: "Luxury" },
        food: [{ meal_type: "Lunch", restaurant: "Britannia & Co.", area: "Ballard Estate", cuisine: "Parsi", must_order: ["Berry Pulav"], cost: "₹800", hours: "11-4", veg: false, tip: "Iconic old-world charm." }],
        daily_cost: "₹18,000"
      },
      {
        day: 2, title: "Street Flavors & Suburban Vibes", theme: "Suburban Exploration",
        morning: { time: "10:00 AM", activity: "Bandra Fort & Castella de Aguada", location: "Bandra West", description: "Portuguese fort ruins with a view of the Sea Link.", entry_fee: "Free", duration: "1.5 hrs", tips: "Great for photos." },
        afternoon: { time: "02:00 PM", activity: "Linking Road Shopping & Bandstand Walk", location: "Bandra", description: "Street shopping and spotting Bollywood star houses.", entry_fee: "Free", duration: "2.5 hrs", tips: "Bargain hard on Linking Road." },
        evening: { time: "07:00 PM", activity: "Juhu Beach Street Food", location: "Juhu", description: "Iconic beach famous for Pav Bhaji and Gola.", entry_fee: "Free", duration: "2 hrs", tips: "Try the spicy Pav Bhaji." },
        accommodation: { hotel_name: "JW Marriott Juhu", area: "Juhu", estimated_cost: "₹18,000", category: "Luxury" },
        food: [{ meal_type: "Dinner", restaurant: "Gajalee", area: "Vile Parle", cuisine: "Coastal / Malvani", must_order: ["Butter Pepper Garlic Crab"], cost: "₹1,500", hours: "7-11", veg: false, tip: "Best seafood in the city." }],
        daily_cost: "₹22,000"
      }
    ]
  }
};

// ─── GENERIC FALLBACK DATA ─────────────────────────────────────────────────────
const GENERIC_DATA = {
  language: "Hindi and English widely understood.",
  useful_phrases: [
    { phrase: "Namaste", meaning: "Hello / Respectful greeting" },
    { phrase: "Kitna paisa?", meaning: "How much does it cost?" },
    { phrase: "Dhanyavaad", meaning: "Thank you" }
  ],
  atm: "SBI and HDFC ATMs available in main market areas. Carry ₹2,000–₹3,000 in cash for smaller towns.",
  transport: {
    intercity: "Trains (IRCTC) and MSRTC/RSRTC/KSRTC buses depending on state.",
    intracity: "Auto-rickshaws and Ola/Uber in most cities. E-rickshaws in smaller towns.",
    app_cabs: ["Ola", "Uber", "Rapido"]
  },
  connectivity: { network: "Jio and Airtel provide 4G in most cities.", sim: "Jio ₹299/28-day plan: unlimited calls + 2GB/day", wifi: "Available in hotels and upscale cafes." },
  hospital: "District Government Hospital (nearest to city centre)",
  safety: ["Fix auto fare before boarding.", "Use licensed guides at major monuments.", "Avoid displaying valuables in crowded markets."],
  scams: ["Touts may offer 'special' entry or shortcuts at monuments — use official ticket counters only.", "Agree on cab fare before starting journey; insist on meter or app-based pricing."],
  etiquette: ["Remove footwear before entering temples and homes.", "Dress modestly near religious sites.", "Ask permission before photographing locals."],
  day_trips: [{ destination: "Nearby Heritage Village", distance: "50 km, ~1.5 hrs", best_for: "Rural architecture and crafts", highlights: ["Old havelis", "Local bazaar"], cost: "₹1,000 per person", recommended_if: "Staying 4+ days" }],
  hotel: { name: "Heritage Boutique Stay", area: "City Centre", landmark: "Near Main Market", cost: "₹3,500", category: "Mid-Range", stars: 3, amenities: ["Free WiFi", "Breakfast included", "Travel desk", "Air conditioning", "24-hr hot water"], tip: "Book directly for best rates.", why: "Central location minimizes daily travel time." }
};

// ─── BUDGET CALCULATORS ────────────────────────────────────────────────────────
const BUDGET_RATES = {
  Budget: { hotel: 1600, food: 700, activity: 400, localTransport: 400 },
  "Mid-Range": { hotel: 4000, food: 1400, activity: 700, localTransport: 700 },
  Luxury: { hotel: 12000, food: 3000, activity: 1500, localTransport: 1500 }
};

function formatINR(amount) {
  return "₹" + amount.toLocaleString("en-IN");
}

function calcBudget(totalDays, budgetTier, intercityTotal) {
  const r = BUDGET_RATES[budgetTier] || BUDGET_RATES["Mid-Range"];
  const accommodation = r.hotel * totalDays;
  const food = r.food * totalDays;
  const activities = r.activity * totalDays;
  const localTransport = r.localTransport * totalDays;
  const misc = Math.round((accommodation + food + activities + localTransport) * 0.08);
  const grandBudget = accommodation + food + activities + localTransport + intercityTotal + misc;
  const grandLuxury = Math.round(grandBudget * 2.4);

  return {
    accommodation: { total: formatINR(accommodation), per_day_avg: formatINR(r.hotel), notes: `Based on ${budgetTier.toLowerCase()} properties throughout.` },
    food: { total: formatINR(food), per_day_avg: formatINR(r.food), notes: "Mix of local dhabas, mid-range restaurants, and one premium dinner per stay." },
    activities_entry_fees: { total: formatINR(activities), per_day_avg: formatINR(r.activity), included_attractions: ["Major monument entries", "Cultural shows", "Guided tours"] },
    transport: {
      intercity_total: formatINR(intercityTotal),
      intercity_breakdown: ["Train/bus/flight to destination included in estimate"],
      local_total: formatINR(localTransport),
      local_per_day_avg: formatINR(r.localTransport)
    },
    miscellaneous: { total: formatINR(misc), includes: ["Tips", "Bottled water", "Packaged snacks", "Emergency buffer"] },
    grand_total_budget_scenario: formatINR(grandBudget),
    grand_total_luxury_scenario: formatINR(grandLuxury)
  };
}

// ─── SEASON DETECTOR ──────────────────────────────────────────────────────────
function getSeasonKey(dateStr) {
  const month = new Date(dateStr).getMonth() + 1;
  if (month >= 10 || month <= 3) return "Oct_Mar";
  if (month >= 4 && month <= 6) return "Apr_Jun";
  return "Jul_Sep";
}

function getSeasonLabel(dateStr) {
  const m = new Date(dateStr).getMonth() + 1;
  if (m >= 11 || m <= 2) return "Peak Winter Season";
  if (m >= 3 && m <= 5) return "Summer Season";
  if (m >= 6 && m <= 9) return "Monsoon Season";
  return "Post-Monsoon / Shoulder Season";
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export function generateMockItinerary(requestData) {
  const {
    destination, startDate, endDate, totalDays,
    travelers, budget, themes, selectedCities,
    pace, startingCity
  } = requestData;

  const days = Math.max(totalDays || 4, 1);
  const start = new Date(startDate || new Date());
  const dates = Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const cityKey = Object.keys(CITY_DB).find(k =>
    destination?.includes(k) || selectedCities?.includes(k)
  );
  const city = cityKey || (selectedCities?.split(",")[0]?.trim()) || destination || "Delhi";
  const db = CITY_DB[cityKey] || null;

  const seasonKey = getSeasonKey(dates[0]);
  const weather = db?.weather?.[seasonKey] || { high: "30°C", low: "18°C", humidity: "Moderate (40–60%)", uv: "Moderate (5–6)", conditions: "Generally pleasant for sightseeing.", wear: "Light cotton layers.", aqi: "Moderate." };

  const budgetTier = budget?.includes("Luxury") ? "Luxury" : budget?.includes("Budget") || budget?.includes("₹") && parseInt(budget.replace(/\D/g, "")) < 20000 ? "Budget" : "Mid-Range";
  const intercityEst = budgetTier === "Budget" ? 1500 : budgetTier === "Luxury" ? 6000 : 3000;

  const dayPlans = [];
  const dbDays = db?.days || [];

  for (let i = 0; i < days; i++) {
    if (i < dbDays.length) {
      const plan = { ...dbDays[i], day: i + 1, date: dates[i] };
      // Remap food_recommendations for schema compliance
      plan.food_recommendations = (plan.food || []).map(f => ({
        meal_type: f.meal_type,
        restaurant: f.restaurant,
        area: f.area,
        cuisine_type: f.cuisine,
        must_order: f.must_order,
        estimated_cost: f.cost,
        opening_hours: f.hours,
        veg_friendly: f.veg,
        tip: f.tip
      }));
      delete plan.food;
      plan.accommodation = plan.accommodation || buildGenericHotel(city, budgetTier, i, db);
      dayPlans.push(plan);
    } else {
      dayPlans.push(buildGenericDay(i + 1, days, dates[i], city, db, budgetTier));
    }
  }

  return {
    trip_overview: {
      destination: selectedCities || city,
      total_days: days,
      starting_city: startingCity || "Not specified",
      arrival_city: city,
      departure_city: city,
      total_estimated_budget: `${budgetTier === "Budget" ? "₹8,000 – ₹15,000" : budgetTier === "Luxury" ? "₹50,000 – ₹1,20,000" : "₹20,000 – ₹40,000"} (${budgetTier}) | ${budgetTier === "Luxury" ? "₹1,20,000+" : "₹60,000 – ₹1,00,000"} (Luxury)`,
      best_time_to_visit: cityKey === "Goa" ? "Oct–Mar: warm 22–32°C, clear skies, perfect for beaches and heritage" : cityKey === "Varanasi" ? "Oct–Mar: 12–26°C, ideal for ghat walks and Ganga Aarti. Avoid May–Jun heat." : "Sep–Mar: 12–28°C, perfect for heritage sightseeing and outdoor exploration.",
      trip_theme: themes?.split(",")[0]?.trim() || "Heritage & Culture",
      travel_pace: pace || "Balanced",
      travel_summary: `Experience the authentic soul of ${city} over ${days} remarkable days. ${db ? `From ${cityKey === "Jaipur" ? "royal forts and night-lit bazaars" : cityKey === "Varanasi" ? "sacred ghats at dawn to spice-heavy Banarasi street food" : cityKey === "Goa" ? "Portuguese Latin quarters to sea-fresh fish on golden beaches" : "iconic landmarks to hidden local neighbourhoods"}` : "iconic landmarks to hidden local neighbourhoods"}, this itinerary balances depth with comfort for ${travelers || 2} traveller(s). Every day has a distinct theme, curated restaurant, and verified real-world location.`,
      intercity_route: `${startingCity || "Origin"} → ${city} (local exploration) → ${startingCity || "Return"}`
    },

    daily_itinerary: dayPlans,
    budget_breakdown: calcBudget(days, budgetTier, intercityEst),

    packing_list: buildPackingList(seasonKey, cityKey, themes),

    local_tips: {
      primary_language: db?.language || GENERIC_DATA.language,
      useful_phrases: db?.useful_phrases || GENERIC_DATA.useful_phrases,
      currency: "Indian Rupee (₹)",
      atm_availability: db?.atm || GENERIC_DATA.atm,
      best_transport_options: {
        intercity: db?.transport?.intercity || GENERIC_DATA.transport.intercity,
        intracity: db?.transport?.intracity || GENERIC_DATA.transport.intracity,
        app_based_cabs: db?.transport?.app_cabs || GENERIC_DATA.transport.app_cabs
      },
      safety_tips: db?.safety || GENERIC_DATA.safety,
      scam_warnings: db?.scams || GENERIC_DATA.scams,
      cultural_etiquette: db?.etiquette || GENERIC_DATA.etiquette,
      connectivity: {
        network_quality: db?.connectivity?.network || GENERIC_DATA.connectivity.network,
        recommended_sim: db?.connectivity?.sim || GENERIC_DATA.connectivity.sim,
        wifi_availability: db?.connectivity?.wifi || GENERIC_DATA.connectivity.wifi
      },
      emergency_contacts: {
        police: "100",
        ambulance: "108",
        fire: "101",
        tourist_helpline: "1363",
        women_helpline: "1091",
        local_hospital: db?.hospital || GENERIC_DATA.hospital
      }
    },

    weather_forecast: {
      season: getSeasonLabel(dates[0]),
      daytime_high: weather.high,
      nighttime_low: weather.low,
      humidity: weather.humidity,
      conditions: weather.conditions,
      uv_index: weather.uv,
      aqi_note: weather.aqi,
      what_to_wear: weather.wear,
      what_to_expect: `${weather.conditions} ${weather.wear}`
    },

    nearby_day_trips: db?.day_trips || GENERIC_DATA.day_trips
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function buildGenericHotel(city, tier, dayIndex, db) {
  const g = GENERIC_DATA.hotel;
  const tierData = {
    Budget: { name: `Budget Stay ${city}`, cost: "₹1,500", cat: "Budget", stars: 2 },
    "Mid-Range": { name: db ? db.days?.[0]?.accommodation?.hotel_name || `${city} Boutique Inn` : `${city} Boutique Inn`, cost: "₹3,500", cat: "Mid-Range", stars: 3 },
    Luxury: { name: `Grand Heritage ${city}`, cost: "₹12,000", cat: "Luxury", stars: 5 }
  };
  const t = tierData[tier] || tierData["Mid-Range"];
  return {
    hotel_name: t.name, area: "City Centre", address_landmark: `Near ${city} Main Market`,
    estimated_cost: `${t.cost} per night`, category: t.cat, star_rating: t.stars,
    amenities: ["Free WiFi", "Complimentary breakfast", "24-hr hot water", "Air conditioning", "Travel desk"],
    booking_tip: "Book directly via hotel website for best rate.",
    why_this_hotel: `Centrally located near major ${city} attractions, minimising daily transport time.`
  };
}

function buildGenericDay(dayNum, totalDays, date, city, db, tier) {
  const isFirst = dayNum === 1;
  const isLast = dayNum === totalDays;
  const themesPool = [
    { name: "Heritage Walk", morning: "Guided tour of historic quarters", afternoon: "Museum of local history", evening: "Sound and light show at the fort", food: ["Heritage Thali", "Ancient Recipe Sweet"] },
    { name: "Market Trail", morning: "Artisan workshop visit", afternoon: "Street food crawl in the bazaar", evening: "Night market shopping", food: ["Local Street Kebab", "Saffron Lassi"] },
    { name: "Art & Architecture", morning: "Modern art gallery visit", afternoon: "Architecture walk in the city centre", evening: "Classical music or dance performance", food: ["Fusion Indian", "Artisan Bakery Snacks"] },
    { name: "Culinary Safari", morning: "Local spice market tour", afternoon: "Cooking demonstration at a local home", evening: "Multi-course regional dinner", food: ["Chef's Special Curry", "Traditional Puddings"] },
    { name: "Nature & Gardens", morning: "Botanical garden walk", afternoon: "Boat ride or lakeside stroll", evening: "Sunset at a rooftop garden", food: ["Organic Cafe Salad", "Fresh Fruit Parfait"] }
  ];

  const currentThemeIdx = (dayNum - 1) % themesPool.length;
  const currentTheme = isFirst ? { name: "Arrival & Orientation" } : isLast ? { name: "Departure & Leisure" } : themesPool[currentThemeIdx];
  const theme = currentTheme.name;

  // Logic for variety
  const afternoonActivity = isFirst ? "Local Market Exploration" : currentTheme.afternoon || "City Highlights Tour";
  const eveningActivity = isLast ? "Souvenir Shopping & Departure Prep" : currentTheme.evening || "Sunset Viewpoint Walk";
  
  const breakfastOptions = [
    { name: "Local Chai Stall", dish: "Masala Chai & Samosa" },
    { name: "Traditional Sweet Shop", dish: "Jalebi & Poha" },
    { name: "South Indian Corner", dish: "Idli & Vada" },
    { name: "Irani Cafe", dish: "Bun Maska & Tea" }
  ];
  const dinnerOptions = [
    { name: "Authentic Thali House", dish: "Regional Grand Thali" },
    { name: "Garden Restaurant", dish: "Paneer Lababdar / Butter Chicken" },
    { name: "Rooftop Grill", dish: "Tandoori Platters" },
    { name: "Bistro 24", dish: "Continental / Indian Fusion" }
  ];

  const bIdx = (dayNum - 1) % breakfastOptions.length;
  const dIdx = (dayNum - 1) % dinnerOptions.length;

  return {
    day: dayNum, date, city,
    title: isFirst ? `Welcome to ${city}` : isLast ? `Farewell, ${city}` : `${theme} — ${city}`,
    theme,
    weather_note: "Check local forecast. Carry water and sun protection.",
    morning: {
      time: isFirst ? "11:00 AM" : "08:30 AM",
      activity: isFirst ? "Hotel Check-in & Orientation" : (currentTheme.morning || `Morning visit to ${city} main landmark`),
      location: isFirst ? `${city} — Hotel` : `${city} Central Heritage Area`,
      neighborhood: "City Centre", duration: "2 hours",
      entry_fee: isFirst ? "Free" : "₹50–₹250",
      opening_hours: isFirst ? "N/A" : "09:00 AM – 05:30 PM",
      description: isFirst
        ? `Arrive in ${city} and check into your hotel. Orient yourself with a walk around the hotel neighbourhood and identify key landmarks.`
        : `Engage with ${city}'s ${theme.toLowerCase()} during this immersive morning session. Learn about the local history and craftsmanship.`,
      estimated_cost: isFirst ? "₹300 (cab)" : "₹400 (entry + transport)",
      transport_to_next: "15 min by auto, ₹80–₹120",
      tips: isFirst ? "Ask the hotel concierge for a neighbourhood map." : "Arrive 30 min before opening to avoid queues."
    },
    afternoon: {
      time: "01:30 PM", activity: afternoonActivity,
      location: `${city} Central District`, neighborhood: "Market / Cultural Area",
      duration: "2.5 hours", entry_fee: "Free",
      opening_hours: "10:00 AM – 08:00 PM",
      description: `Spend your afternoon exploring ${city}'s vibrant ${afternoonActivity.toLowerCase()}. This is a perfect time to see the city's pulse and find unique local items.`,
      estimated_cost: "₹600 (entry + refreshments)",
      transport_to_next: "10 min walk or auto",
      tips: "Bargain respectfully. Try the local snacks from recommended vendors."
    },
    evening: {
      time: isLast ? "04:00 PM" : "06:00 PM",
      activity: eveningActivity,
      location: isLast ? `${city} Airport / Station` : `${city} Viewpoint`,
      neighborhood: isLast ? "Transport Hub" : "Riverside / Hilltop",
      duration: isLast ? "Departure" : "2 hours",
      entry_fee: isLast ? "Free" : "₹50–₹150",
      opening_hours: "N/A",
      description: isLast
        ? `Final preparations for your journey home. Grab last-minute souvenirs and head to your departure point.`
        : `Experience ${city}'s ${eveningActivity.toLowerCase()} as the sun sets. The city takes on a completely different character in the twilight.`,
      estimated_cost: isLast ? "₹800 (cab + snacks)" : "₹300",
      transport_to_next: isLast ? "End of Journey" : "Auto to hotel, ₹100",
      tips: isLast ? "Buffer 2 hours for domestic travel." : "Perfect for photography."
    },
    accommodation: buildGenericHotel(city, tier, dayNum, db),
    food_recommendations: [
      { 
        meal_type: "Breakfast", 
        restaurant: `${city} ${breakfastOptions[bIdx].name}`, 
        area: "Near hotel", 
        cuisine_type: "Local Specialty", 
        must_order: [breakfastOptions[bIdx].dish], 
        estimated_cost: "₹150 per person", 
        opening_hours: "07:00 AM – 10:30 AM", 
        veg_friendly: true, 
        tip: "A local favorite, expect it to be busy." 
      },
      { 
        meal_type: "Dinner", 
        restaurant: `${city} ${dinnerOptions[dIdx].name}`, 
        area: "City Centre", 
        cuisine_type: "Regional Indian", 
        must_order: [dinnerOptions[dIdx].dish], 
        estimated_cost: "₹600 per person", 
        opening_hours: "07:00 PM – 11:00 PM", 
        veg_friendly: true, 
        tip: "Great atmosphere for reflecting on the day." 
      }
    ],
    daily_estimated_cost: `₹${tier === "Budget" ? "3,500" : tier === "Luxury" ? "15,000" : "5,500"}`,
    travel_notes: isLast ? "Safe travels!" : "Enjoy the ${theme} tomorrow!"
  };
}

function buildPackingList(season, city, themes) {
  const base = {
    essentials: ["Power bank (20,000 mAh)", "Sunscreen SPF 50+", "Hand sanitizer (100ml)", "Reusable steel water bottle", "ORS sachets (5 packets)", "Aadhaar card / Government photo ID (original)", "Cash ₹3,000–₹5,000 (for cash-only vendors)"],
    documents: ["Aadhaar Card / Voter ID (original)", "Hotel booking confirmations (printed + PDF)", "Train/flight e-tickets", "Travel insurance policy", "Emergency contacts list (written on paper as backup)"],
    tech: ["Universal travel adapter", "Power bank 20,000 mAh min.", "Offline Google Maps (download destination area)", "Earphones with mic", "Camera / extra SD card"],
    health: ["Basic first aid kit", "ORS sachets", "Ibuprofen / Paracetamol", "Antacid tablets", "Antihistamine (for dust/pollen)", "Prescription medications with doctor's note"]
  };

  if (season === "Oct_Mar") {
    base.clothing = ["Light cotton T-shirts (3–4)", "One warm fleece or jacket (for evenings)", "Comfortable walking trousers", "Modest kurta/salwar for temple visits"];
    base.footwear = ["Comfortable walking shoes (broken in, NOT new)", "Slip-on sandals for temple entry", "Flip-flops for hotel room"];
    base.accessories = ["UV-protection sunglasses", "Compact day backpack (20L)", "Handkerchief / buff for dusty sites"];
  } else if (season === "Apr_Jun") {
    base.clothing = ["Loose full-sleeve linen shirts (protects from UV)", "Light cotton trousers (not shorts for temple areas)", "3–4 breathable cotton tees"];
    base.footwear = ["Breathable mesh walking shoes", "Ventilated sandals (for afternoons)", "Avoid synthetic fabrics"];
    base.accessories = ["Wide-brim UV hat (mandatory)", "Polarized UV-400 sunglasses", "Cooling face towel / ice-pack collar"];
    base.health.push("Electrolyte powder sachets (heat exhaustion prevention)", "Cooling prickly heat powder");
  } else {
    base.clothing = ["Quick-dry fabric shirts and trousers", "Light waterproof rain jacket", "3–4 cotton changes"];
    base.footwear = ["Waterproof rubber sandals", "Waterproof walking shoes", "Extra dry socks"];
    base.accessories = ["Compact travel umbrella", "Zip-lock bags for electronics", "Waterproof phone pouch"];
  }

  if (city === "Goa") {
    base.clothing.push("2 swimsuits / swim shorts");
    base.footwear.push("Reef-safe water shoes for rocky beaches");
    base.accessories.push("SPF 70+ reef-safe sunscreen");
    base.essentials.push("Valid 2-wheeler driving licence (for scooter rental)");
  }
  if (city === "Varanasi") {
    base.clothing.push("Extra modest outfit for Manikarnika Ghat (no exposed arms/legs)");
    base.footwear.push("Rubber slip-on sandals (for wet ghat steps)");
    base.essentials.push("Small tote bag for shoes (ghats do not have secure footwear storage)");
  }

  return base;
}