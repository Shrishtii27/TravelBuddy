import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../ui/card";
import { Sparkles, MapPin, TrendingUp, Camera, Users, Shield, ArrowRight, Star, Heart } from "lucide-react";
import { Button } from "../ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const trips = [
  {
    title: "5 days in Goa",
    img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    price: "₹12,000",
    rating: 4.8,
  },
  {
    title: "6 days in Manali",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    price: "₹18,000",
    rating: 4.9,
  },
  {
    title: "4 days in Jaipur",
    img: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&h=600&fit=crop",
    price: "₹10,000",
    rating: 4.7,
  },
  {
    title: "7 days in Kerala",
    img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=800&h=600&fit=crop",
    price: "₹22,000",
    rating: 4.9,
  },
  {
    title: "8 days in Leh–Ladakh",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    price: "₹35,000",
    rating: 5.0,
  },
  {
    title: "3 days in Rishikesh",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=600&fit=crop",
    price: "₹8,000",
    rating: 4.6,
  },
  {
    title: "4 days in Udaipur",
    img: "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&h=600&fit=crop",
    price: "₹15,000",
    rating: 4.8,
  },
  {
    title: "3 days in Varanasi",
    img: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop",
    price: "₹9,000",
    rating: 4.7,
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Planning",
    description: "Get personalized itineraries created by advanced AI in seconds",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: TrendingUp,
    title: "Smart Budgeting",
    description: "Track expenses and save money with intelligent budget recommendations",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: MapPin,
    title: "Interactive Maps",
    description: "Navigate with offline maps and discover hidden gems along the way",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Camera,
    title: "Travel Journal",
    description: "Capture and share your memorable moments with the community",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Users,
    title: "Community Connect",
    description: "Join 50,000+ travelers sharing tips and experiences",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your data is encrypted and protected with industry-leading security",
    color: "from-slate-600 to-slate-800"
  },
];

export default function PopularTripsSection() {
  return (
    <>
      {/* Features Section */}
      <motion.section
        id="features"
        className="py-24 bg-slate-50"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              className="inline-flex items-center gap-2 bg-rose-100 px-4 py-2 rounded-full text-rose-600 mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Why Choose TravelBUDDY</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
              Everything You Need to Travel Smart
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From AI-powered planning to community insights, we've got your journey covered
            </p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={fadeUp}>
                <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-rose-200 group">
                  <CardContent className="p-8">
                    <div className={`bg-gradient-to-br ${feature.color} rounded-2xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-16">
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 shadow-xl font-bold text-lg px-10 py-6 h-auto">
                Get Started for Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Popular Trips Section */}
      <motion.section
        id="popular"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-24"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-14">
          <motion.div
            className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full text-orange-600 mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">Trending Now</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
            Popular Trips in India
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Handpicked destinations with AI-curated itineraries, hotels, and local experiences
          </p>
        </div>

        {/* Category Icons */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16">
          {[
            ["🏝️", "Beaches"],
            ["🏔️", "Mountains"],
            ["🏛️", "Heritage"],
            ["🧘", "Spiritual"],
            ["🌄", "Adventure"],
          ].map(([icon, label]) => (
            <motion.div 
              key={label} 
              className="text-center cursor-pointer group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="bg-white rounded-2xl p-4 shadow-md group-hover:shadow-xl transition-all mb-2">
                <div className="text-4xl">{icon}</div>
              </div>
              <div className="text-sm font-medium text-slate-700">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Trips Grid */}
        <motion.div 
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {trips.map((trip, index) => (
            <motion.div key={trip.title} variants={fadeUp}>
              <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer hover:-translate-y-2">
                <div className="relative">
                  <img
                    src={trip.img}
                    alt={trip.title}
                    className="h-64 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Wishlist Heart */}
                  <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </button>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-slate-900">{trip.rating}</span>
                  </div>

                  {/* Trip Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-bold text-xl mb-2">{trip.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold">{trip.price}</span>
                      <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        AI-Curated
                      </span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      Itinerary Included
                    </span>
                    <Link to="/signup">
                      <span className="text-rose-600 font-semibold hover:text-rose-700 flex items-center gap-1">
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Link to="/signup">
            <Button size="lg" variant="outline" className="border-2 border-rose-500 text-rose-600 hover:bg-rose-50 font-bold">
              View All Destinations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.section>
    </>
  );
}