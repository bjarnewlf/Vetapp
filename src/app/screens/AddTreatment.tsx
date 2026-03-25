import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePets } from '../context/PetContext';

export default function AddTreatment() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { addTreatment, getPetById } = usePets();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const pet = getPetById(petId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (petId) {
      addTreatment(petId, {
        name,
        date,
        notes,
      });
      navigate(`/app/pet/${petId}/treatments`);
    }
  };

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center">
        <p className="text-gray-600">Pet not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(`/app/pet/${petId}/treatments`)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl text-gray-900">Add Treatment</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        <p className="text-sm text-gray-600 font-medium">Adding treatment for {pet.name}</p>

        {/* Treatment Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Treatment Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="e.g., Dental Cleaning, Surgery"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="Add any notes about the treatment..."
            rows={4}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg font-medium"
        >
          Save Treatment
        </button>
      </form>
    </div>
  );
}