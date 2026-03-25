import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePets } from '../context/PetContext';
import { addMonths, addYears, format } from 'date-fns';

export default function AddVaccination() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { addVaccination, getPetById } = usePets();

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<'once' | 'monthly' | 'yearly' | 'every-3-years' | 'custom'>('yearly');
  const [customInterval, setCustomInterval] = useState('6');

  const pet = getPetById(petId || '');

  // Calculate next due date based on recurrence type
  const calculateNextDueDate = () => {
    if (!date) return '';
    const givenDate = new Date(date);
    
    switch (recurrenceType) {
      case 'once':
        return ''; // No next due date for one-time vaccinations
      case 'monthly':
        return format(addMonths(givenDate, 1), 'yyyy-MM-dd');
      case 'yearly':
        return format(addYears(givenDate, 1), 'yyyy-MM-dd');
      case 'every-3-years':
        return format(addYears(givenDate, 3), 'yyyy-MM-dd');
      case 'custom':
        return format(addMonths(givenDate, parseInt(customInterval) || 6), 'yyyy-MM-dd');
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (petId) {
      const nextDueDate = calculateNextDueDate();
      addVaccination(petId, {
        name,
        date,
        nextDueDate,
        recurrenceType,
        recurrenceInterval: recurrenceType === 'custom' ? parseInt(customInterval) : undefined,
      });
      navigate(`/app/pet/${petId}`);
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
          onClick={() => navigate(`/app/pet/${petId}`)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl text-gray-900">Add Vaccination</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        <p className="text-sm text-gray-600 font-medium">Adding vaccination for {pet.name}</p>

        {/* Vaccination Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Vaccination Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="e.g., Rabies, Distemper"
            required
          />
        </div>

        {/* Date Given */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Date Given
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

        {/* Recurrence Type */}
        <div>
          <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700 mb-2">
            Recurrence
          </label>
          <select
            id="recurrenceType"
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value as any)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
          >
            <option value="once">One-time only</option>
            <option value="monthly">Every month</option>
            <option value="yearly">Every year</option>
            <option value="every-3-years">Every 3 years</option>
            <option value="custom">Custom interval</option>
          </select>
        </div>

        {/* Custom Interval */}
        {recurrenceType === 'custom' && (
          <div>
            <label htmlFor="customInterval" className="block text-sm font-medium text-gray-700 mb-2">
              Repeat every (months)
            </label>
            <input
              type="number"
              id="customInterval"
              value={customInterval}
              onChange={(e) => setCustomInterval(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
              placeholder="e.g., 6"
              min="1"
              required
            />
          </div>
        )}

        {/* Next Due Date Preview */}
        {date && recurrenceType !== 'once' && (
          <div className="bg-[#28A745]/5 border border-[#28A745]/20 rounded-[14px] p-4">
            <p className="text-sm text-gray-900">
              <span className="font-semibold">Next due date:</span>{' '}
              {calculateNextDueDate() && format(new Date(calculateNextDueDate()), 'MMM d, yyyy')}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {recurrenceType === 'monthly' && 'Repeats every month'}
              {recurrenceType === 'yearly' && 'Repeats every year'}
              {recurrenceType === 'every-3-years' && 'Repeats every 3 years'}
              {recurrenceType === 'custom' && `Repeats every ${customInterval} months`}
            </p>
          </div>
        )}

        {recurrenceType === 'once' && (
          <div className="bg-white border border-gray-200 rounded-[14px] p-4">
            <p className="text-sm text-gray-600">
              This is a one-time vaccination with no recurring schedule
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg font-medium"
        >
          Save Vaccination
        </button>
      </form>
    </div>
  );
}