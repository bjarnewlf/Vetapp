import { useNavigate } from 'react-router';
import { Plus, Calendar, Check, Repeat } from 'lucide-react';
import { usePets } from '../context/PetContext';
import { format, isPast, isFuture } from 'date-fns';
import BottomNav from '../components/BottomNav';

export default function Reminders() {
  const navigate = useNavigate();
  const { reminders, toggleReminderStatus } = usePets();

  const sortedReminders = [...reminders].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const getStatusColor = (reminder: any) => {
    if (reminder.status === 'completed') {
      return 'bg-white border-l-4 border-[#28A745]';
    }
    if (isPast(new Date(reminder.date))) {
      return 'bg-white border-l-4 border-[#DC3545]';
    }
    return 'bg-white border-l-4 border-[#FFC107]';
  };

  const getStatusBadge = (reminder: any) => {
    if (reminder.status === 'completed') {
      return (
        <span className="px-3 py-1 text-xs bg-[#28A745] text-white rounded-full font-medium">
          Up-to-date
        </span>
      );
    }
    if (isPast(new Date(reminder.date))) {
      return (
        <span className="px-3 py-1 text-xs bg-[#DC3545] text-white rounded-full font-medium">
          Overdue
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-xs bg-[#FFC107] text-white rounded-full font-medium">
        Upcoming
      </span>
    );
  };

  const getRecurrenceLabel = (reminder: any) => {
    if (!reminder.recurrenceType || reminder.recurrenceType === 'once') {
      return null;
    }

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    switch (reminder.recurrenceType) {
      case 'weekly':
        return `Every ${weekDays[reminder.recurrenceDay || 0]}`;
      case 'monthly':
        return `Monthly on day ${reminder.recurrenceDay || 1}`;
      case 'yearly':
        return 'Yearly';
      case 'custom':
        return `Every ${reminder.recurrenceInterval} ${reminder.recurrenceUnit}`;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 shadow-sm">
        <h1 className="text-2xl text-gray-900">Reminders</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Add Reminder Button */}
        <button
          onClick={() => navigate('/app/add-reminder')}
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add Reminder
        </button>

        {/* Reminders List */}
        {sortedReminders.length > 0 ? (
          <div className="space-y-3">
            {sortedReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`rounded-[14px] shadow-sm p-5 ${getStatusColor(reminder)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base text-gray-900 font-semibold flex-1">{reminder.title}</h3>
                  <button
                    onClick={() => toggleReminderStatus(reminder.id)}
                    className={`ml-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      reminder.status === 'completed'
                        ? 'bg-[#28A745] border-[#28A745]'
                        : 'border-gray-300 hover:border-[#28A745]'
                    }`}
                  >
                    {reminder.status === 'completed' && (
                      <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  <span>{format(new Date(reminder.date), 'MMM d, yyyy')}</span>
                </div>

                {getRecurrenceLabel(reminder) && (
                  <div className="flex items-center gap-2 text-sm text-[#1A6B6B] mb-3 bg-[#1A6B6B]/5 px-3 py-1.5 rounded-lg w-fit">
                    <Repeat className="w-4 h-4" strokeWidth={1.5} />
                    <span className="font-medium">{getRecurrenceLabel(reminder)}</span>
                  </div>
                )}

                <div className="mb-3">
                  {getStatusBadge(reminder)}
                </div>

                {reminder.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{reminder.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[14px] shadow-sm p-8 text-center">
            <p className="text-gray-500 font-medium">No reminders yet</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}