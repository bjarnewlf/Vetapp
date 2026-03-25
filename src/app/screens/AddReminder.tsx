import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePets } from '../context/PetContext';

export default function AddReminder() {
  const navigate = useNavigate();
  const { addReminder, pets } = usePets();

  const [petId, setPetId] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [recurrenceType, setRecurrenceType] = useState<'once' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('once');
  const [recurrenceDay, setRecurrenceDay] = useState<number>(1);
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [recurrenceUnit, setRecurrenceUnit] = useState<'days' | 'weeks' | 'months'>('days');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReminder({
      petId: petId || undefined,
      title,
      date,
      description,
      status: 'pending',
      recurrenceType,
      recurrenceDay: recurrenceType === 'weekly' || recurrenceType === 'monthly' ? recurrenceDay : undefined,
      recurrenceInterval: recurrenceType === 'custom' ? recurrenceInterval : undefined,
      recurrenceUnit: recurrenceType === 'custom' ? recurrenceUnit : undefined,
    });
    navigate('/app/reminders');
  };

  const weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate('/app/reminders')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl text-gray-900">Add Reminder</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        {/* Pet Selection (Optional) */}
        <div>
          <label htmlFor="petId" className="block text-sm font-medium text-gray-700 mb-2">
            Pet (Optional)
          </label>
          <select
            id="petId"
            value={petId}
            onChange={(e) => setPetId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
          >
            <option value="">General reminder</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Reminder Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Reminder Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="e.g., Vet appointment, Buy food"
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

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            placeholder="Add any details..."
            rows={4}
            required
          />
        </div>

        {/* Recurrence */}
        <div>
          <label htmlFor="recurrenceType" className="block text-sm font-medium text-gray-700 mb-2">
            Recurrence
          </label>
          <select
            id="recurrenceType"
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value as 'once' | 'weekly' | 'monthly' | 'yearly' | 'custom')}
            className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
          >
            <option value="once">Once</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Recurrence Day (for weekly and monthly) */}
        {recurrenceType === 'weekly' || recurrenceType === 'monthly' ? (
          <div>
            <label htmlFor="recurrenceDay" className="block text-sm font-medium text-gray-700 mb-2">
              {recurrenceType === 'weekly' ? 'Day of the Week' : 'Day of the Month'}
            </label>
            <select
              id="recurrenceDay"
              value={recurrenceDay}
              onChange={(e) => setRecurrenceDay(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
            >
              {recurrenceType === 'weekly' ? (
                weekDays.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))
              ) : (
                Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))
              )}
            </select>
          </div>
        ) : null}

        {/* Recurrence Interval and Unit (for custom) */}
        {recurrenceType === 'custom' ? (
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="recurrenceInterval" className="block text-sm font-medium text-gray-700 mb-2">
                Interval
              </label>
              <input
                type="number"
                id="recurrenceInterval"
                value={recurrenceInterval}
                onChange={(e) => setRecurrenceInterval(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
                min="1"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="recurrenceUnit" className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                id="recurrenceUnit"
                value={recurrenceUnit}
                onChange={(e) => setRecurrenceUnit(e.target.value as 'days' | 'weeks' | 'months')}
                className="w-full px-4 py-3 border border-gray-300 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#1A6B6B] bg-white"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        ) : null}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg font-medium"
        >
          Save Reminder
        </button>
      </form>
    </div>
  );
}