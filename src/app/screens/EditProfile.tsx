import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Camera } from 'lucide-react';
import { usePets } from '../context/PetContext';

export default function EditProfile() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = usePets();

  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [photo, setPhoto] = useState(userProfile.photo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      photo,
    });
    navigate('/app/profile');
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate('/app/profile')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl text-gray-900">Edit Profile</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-[#1A6B6B]/10 border-4 border-white shadow-lg">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-[#1A6B6B]">
                  👤
                </div>
              )}
            </div>
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-[#E8734A] text-white p-2.5 rounded-full shadow-lg hover:bg-[#D5633A] transition-all"
            >
              <Camera className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">Tap to change photo</p>
        </div>

        {/* Photo URL */}
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
            Photo URL
          </label>
          <input
            type="url"
            id="photo"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="John Doe"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="john.doe@example.com"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="+1 555-1234"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg font-medium"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}