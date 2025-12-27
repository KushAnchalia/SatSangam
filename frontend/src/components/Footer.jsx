import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative z-10 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-t-2 border-orange-200 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          {/* Decorative Emojis */}
          <div className="flex justify-center gap-3 mb-4 animate-pulse">
            <span className="text-2xl">🕉️</span>
            <span className="text-2xl">🪔</span>
            <span className="text-2xl">🌸</span>
          </div>
          
          {/* Brand Name */}
          <h3 className="text-2xl font-bold font-serif text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
            Satsangam
          </h3>
          
          {/* Made with love */}
          <div className="flex items-center justify-center gap-2 text-gray-700">
            <span className="text-sm">Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" fill="currentColor" />
            <span className="text-sm">by</span>
            <a 
              href="https://www.linkedin.com/in/kush-anchalia-41678a228/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all"
            >
              Kush Anchalia
            </a>
          </div>
          
          {/* Spiritual Quote */}
          <p className="text-xs text-gray-600 italic max-w-md mx-auto">
            🙏 "In the company of truth seekers, hearts awaken to divine light" 🌟
          </p>
          
          {/* Copyright */}
          <p className="text-xs text-gray-500 pt-4 border-t border-orange-200 max-w-2xl mx-auto">
            © {new Date().getFullYear()} Satsangam. Connecting souls through sacred gatherings.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
