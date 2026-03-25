import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to the app
    navigate('/app');
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-[#F5EFE6]">
      <div className="flex-1 flex flex-col px-6 pt-16">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 bg-[#1A6B6B] rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-10 h-10 text-white" fill="currentColor" strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-3xl text-center text-gray-900 mb-2">Welcome to VetApp</h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to manage your pets' health
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent transition-all"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] font-medium hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg mt-6"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          New to VetApp?{' '}
          <button className="text-[#1A6B6B] font-medium hover:underline">Create Account</button>
        </p>
      </div>
    </div>
  );
}