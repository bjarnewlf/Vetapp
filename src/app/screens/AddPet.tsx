import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Upload } from 'lucide-react';
import { usePets } from '../context/PetContext';

export default function AddPet() {
  const navigate = useNavigate();
  const { addPet } = usePets();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [breed, setBreed] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [microchipCode, setMicrochipCode] = useState('');
  const [photo, setPhoto] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPet({
      name,
      type,
      breed,
      birthDate,
      microchipCode,
      photo: photo || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400',
    });
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate('/app')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl text-gray-900">Add Pet</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Pet Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-[14px] p-8 text-center bg-white">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-sm text-gray-600">Click or drag to upload</p>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] text-sm bg-white"
              placeholder="Or paste image URL"
            />
          </div>
        </div>

        {/* Pet Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Pet Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="e.g., Max"
            required
          />
        </div>

        {/* Animal Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Animal Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            required
          >
            <option value="">Select type</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Breed */}
        <div>
          <label htmlFor="breed" className="block text-sm font-medium text-gray-700 mb-2">
            Breed
          </label>
          <input
            type="text"
            id="breed"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="e.g., Golden Retriever"
            required
          />
        </div>

        {/* Birth Date */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
            Birth Date
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            required
          />
        </div>

        {/* Microchip Code */}
        <div>
          <label htmlFor="microchipCode" className="block text-sm font-medium text-gray-700 mb-2">
            Microchip Code
          </label>
          <input
            type="text"
            id="microchipCode"
            value={microchipCode}
            onChange={(e) => setMicrochipCode(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="e.g., 982000123456789"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg font-medium"
        >
          Save Pet
        </button>
      </form>
    </div>
  );
}