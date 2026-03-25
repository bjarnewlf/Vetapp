import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A6B6B] via-[#1A6B6B] to-[#145555] flex flex-col items-center justify-center px-6 text-white">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-full border-2 border-white/20">
            <Heart className="w-20 h-20" fill="currentColor" strokeWidth={1.5} />
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl tracking-tight">VetApp</h1>
        
        {/* Description */}
        <p className="text-xl leading-relaxed max-w-md mx-auto opacity-95">
          Your pet's health companion. Warm, trustworthy, always there.
        </p>
        
        <p className="text-base opacity-80 max-w-md mx-auto">
          Manage health records, vaccinations, and appointments with care — all in one beautiful place.
        </p>

        {/* Button */}
        <button
          onClick={() => navigate('/login')}
          className="mt-10 bg-[#E8734A] text-white px-10 py-4 rounded-[14px] text-lg font-medium hover:bg-[#D5633A] transition-all shadow-lg hover:shadow-xl hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}