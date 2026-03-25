import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, Brain, Heart } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function PremiumAI() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/app/profile')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl text-gray-900">Premium Features</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* Coming Soon Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm">
            <Sparkles className="w-4 h-4" />
            Coming Soon
          </span>
        </div>

        {/* AI Illustration */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="text-9xl">🐕‍🦺</div>
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full p-3 shadow-lg">
              <Brain className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-10">
          <h2 className="text-3xl text-gray-900 mb-3">AI Pet Health Assistant</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Get AI-powered guidance for your pet's health, symptoms, and care.
          </p>
        </div>

        {/* Features List */}
        <div className="space-y-4 mb-10">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Smart Health Analysis</h3>
                <p className="text-sm text-gray-600">
                  AI analyzes your pet's symptoms and provides instant guidance
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">Personalized Care Tips</h3>
                <p className="text-sm text-gray-600">
                  Get customized health recommendations based on your pet's profile
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-gray-900 mb-1">24/7 Availability</h3>
                <p className="text-sm text-gray-600">
                  Get answers to your pet health questions anytime, anywhere
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 text-center">
          <p className="text-purple-900 mb-2">
            🔔 Be the first to know when we launch
          </p>
          <p className="text-sm text-purple-700">
            This feature is currently in development and will be available soon!
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
