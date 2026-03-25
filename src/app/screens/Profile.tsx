import { useNavigate } from 'react-router';
import { Sparkles, Brain, Bell, Camera, TrendingUp, ArrowRight, Edit2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { usePets } from '../context/PetContext';

export default function Profile() {
  const navigate = useNavigate();
  const { userProfile } = usePets();

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 shadow-sm">
        <h1 className="text-2xl text-gray-900">Profile & Settings</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* User Info */}
        <div className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1A6B6B]/10 border-2 border-[#1A6B6B]/20">
                {userProfile.photo ? (
                  <img
                    src={userProfile.photo}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-[#1A6B6B]">
                    👤
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl text-gray-900 font-semibold mb-1">{userProfile.name}</h2>
                <p className="text-gray-600 text-sm mb-0.5">{userProfile.email}</p>
                <p className="text-gray-500 text-sm">{userProfile.phone}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/edit-profile')}
              className="text-[#1A6B6B] hover:text-[#145555] transition-colors p-2 hover:bg-[#1A6B6B]/5 rounded-lg"
            >
              <Edit2 className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Premium Section */}
        <div className="bg-gradient-to-br from-[#1A6B6B] to-[#145555] rounded-[14px] shadow-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" strokeWidth={1.5} />
                <h3 className="text-xl font-semibold">Premium Features</h3>
              </div>
              <p className="text-white/80 text-sm">
                Unlock AI-powered insights and advanced features
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl">
                <Brain className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm">AI Health Assistant</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl">
                <Camera className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm">Symptom Photo Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl">
                <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm">Health Trends & Reports</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm p-2.5 rounded-xl">
                <Bell className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-sm">Smart Reminder System</span>
            </div>
          </div>

          <button className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium">
            <span>Upgrade to Premium</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* AI Feature Preview */}
        <div 
          onClick={() => navigate('/app/premium-ai')}
          className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100 cursor-pointer hover:shadow-md transition-all hover:scale-[1.01]"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg text-gray-900">AI Pet Health Assistant</h3>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Coming soon: Get personalized health recommendations, early warning signs, 
            and expert advice powered by AI.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <p className="text-sm text-purple-900 font-medium">
                Preview Premium Features
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600" />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-200">
            <span className="text-gray-900">Notifications</span>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-200">
            <span className="text-gray-900">Privacy & Security</span>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-200">
            <span className="text-gray-900">Help & Support</span>
          </button>
          <button className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors">
            <span className="text-red-600">Sign Out</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}