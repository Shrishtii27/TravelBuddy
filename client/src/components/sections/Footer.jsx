import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Heart } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg p-2 shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">TravelBUDDY</span>
            </Link>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Your AI-powered travel companion for unforgettable journeys across India. Plan smarter, travel better.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="bg-slate-700 hover:bg-rose-600 rounded-full p-2 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="bg-slate-700 hover:bg-rose-600 rounded-full p-2 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="bg-slate-700 hover:bg-rose-600 rounded-full p-2 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="bg-slate-700 hover:bg-rose-600 rounded-full p-2 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Features
                </a>
              </li>
              <li>
                <a href="#popular" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Destinations
                </a>
              </li>
              <li>
                <Link to="/signup" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Get Started
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-rose-400 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Email</p>
                  <a href="mailto:support@travelbuddy.com" className="text-slate-200 hover:text-rose-400 transition-colors">
                    support@travelbuddy.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Phone</p>
                  <a href="tel:+911234567890" className="text-slate-200 hover:text-rose-400 transition-colors">
                    +91 123 456 7890
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-slate-400 mb-1">Address</p>
                  <p className="text-slate-200">
                    Mumbai, Maharashtra<br />India 400001
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-slate-700 pt-8 mt-8"
          initial="hidden"
          whileInView="visible"
          variants={fadeUp}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} TravelBUDDY. All rights reserved.
            </p>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> for travelers
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
