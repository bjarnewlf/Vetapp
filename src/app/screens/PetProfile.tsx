import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Phone, Mail, Calendar, Repeat, MapPin, Syringe, Pill, Bell } from 'lucide-react';
import { usePets } from '../context/PetContext';
import { format, differenceInYears, differenceInMonths, isFuture } from 'date-fns';
import BottomNav from '../components/BottomNav';

export default function PetProfile() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { getPetById, reminders } = usePets();

  const pet = getPetById(petId || '');

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center pb-20">
        <p className="text-gray-600">Pet not found</p>
        <BottomNav />
      </div>
    );
  }

  const getDetailedAge = (birthDate: string) => {
    const years = differenceInYears(new Date(), new Date(birthDate));
    const months = differenceInMonths(new Date(), new Date(birthDate)) % 12;
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    if (years === 1) {
      return `1 year`;
    }
    return `${years} years`;
  };

  const getRecurrenceLabel = (recurrenceType: string, customInterval?: number) => {
    switch (recurrenceType) {
      case 'once':
        return 'One-time';
      case 'monthly':
        return 'Monthly';
      case 'yearly':
        return 'Yearly';
      case 'every-3-years':
        return 'Every 3 years';
      case 'custom':
        return `Every ${customInterval} months`;
      default:
        return '';
    }
  };

  // Get upcoming reminders for this pet
  const petReminders = reminders
    .filter((r) => r.petId === petId && r.status === 'pending' && isFuture(new Date(r.date)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate('/app/pets')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl text-gray-900">{pet.name}</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Pet Information Section */}
        <div className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-4 uppercase tracking-wide font-semibold">Pet Information</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <img
              src={pet.photo}
              alt={pet.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#1A6B6B]/10"
            />
            <div>
              <h2 className="text-2xl text-gray-900 font-semibold mb-1">{pet.name}</h2>
              <p className="text-gray-600">{pet.breed}</p>
            </div>
          </div>
          
          {/* Pet Details */}
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Type</span>
              <span className="text-gray-900 font-medium">{pet.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Age</span>
              <span className="text-gray-900 font-medium">{getDetailedAge(pet.birthDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Birth Date</span>
              <span className="text-gray-900 font-medium">{format(new Date(pet.birthDate), 'MMM d, yyyy')}</span>
            </div>
            {pet.microchipCode && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Microchip</span>
                <span className="text-gray-900 font-mono text-sm">{pet.microchipCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Health Section */}
        <div className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100">
          <h3 className="text-sm text-gray-600 mb-4 uppercase tracking-wide font-semibold">Health</h3>
          
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => navigate(`/app/pet/${pet.id}/treatments`)}
              className="bg-[#E8734A]/10 hover:bg-[#E8734A]/20 border border-[#E8734A]/30 rounded-[14px] p-4 transition-all flex flex-col items-center gap-2"
            >
              <Pill className="w-6 h-6 text-[#E8734A]" strokeWidth={1.5} />
              <span className="text-sm text-gray-900 font-medium">Treatments</span>
              <span className="text-xs text-gray-600">{pet.treatments.length} recorded</span>
            </button>
            
            <button
              onClick={() => navigate(`/app/pet/${pet.id}/add-vaccination`)}
              className="bg-[#1A6B6B]/10 hover:bg-[#1A6B6B]/20 border border-[#1A6B6B]/30 rounded-[14px] p-4 transition-all flex flex-col items-center gap-2"
            >
              <Syringe className="w-6 h-6 text-[#1A6B6B]" strokeWidth={1.5} />
              <span className="text-sm text-gray-900 font-medium">Add Vaccination</span>
            </button>
          </div>

          {/* Treatments */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900 font-semibold">Recent Treatments</h4>
              <button
                onClick={() => navigate(`/app/pet/${pet.id}/treatments`)}
                className="text-[#1A6B6B] hover:text-[#145555] text-sm font-medium"
              >
                View All
              </button>
            </div>

            {pet.treatments.length > 0 ? (
              <div className="space-y-2">
                {pet.treatments.slice(0, 2).map((treatment) => (
                  <div
                    key={treatment.id}
                    className="bg-[#F5EFE6] rounded-[14px] p-3 border border-gray-200"
                  >
                    <h5 className="text-gray-900 text-sm font-medium mb-1">{treatment.name}</h5>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(treatment.date), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No treatments recorded yet</p>
            )}
          </div>

          {/* Vaccinations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-gray-900 font-semibold">Vaccinations</h4>
              <button
                onClick={() => navigate(`/app/pet/${pet.id}/add-vaccination`)}
                className="text-[#1A6B6B] hover:text-[#145555]"
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>

            {pet.vaccinations.length > 0 ? (
              <div className="space-y-3">
                {pet.vaccinations.map((vaccination) => (
                  <div
                    key={vaccination.id}
                    className="bg-[#28A745]/5 border border-[#28A745]/20 rounded-[14px] p-4"
                  >
                    <h5 className="text-gray-900 font-medium mb-2">{vaccination.name}</h5>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" strokeWidth={1.5} />
                      <span>Given: {format(new Date(vaccination.date), 'MMM d, yyyy')}</span>
                    </div>
                    {vaccination.nextDueDate && (
                      <div className="flex items-center gap-1 text-sm text-[#28A745] mb-2">
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        <span className="font-medium">Next: {format(new Date(vaccination.nextDueDate), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Repeat className="w-3 h-3" strokeWidth={1.5} />
                      <span>{getRecurrenceLabel(vaccination.recurrenceType, vaccination.recurrenceInterval)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No vaccinations recorded yet</p>
            )}
          </div>
        </div>

        {/* Reminders Section */}
        <div className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-gray-600 uppercase tracking-wide font-semibold">Reminders</h3>
            <button
              onClick={() => navigate('/app/add-reminder')}
              className="text-[#1A6B6B] hover:text-[#145555]"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>

          {petReminders.length > 0 ? (
            <div className="space-y-3">
              {petReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-[#FFC107]/5 border border-[#FFC107]/30 rounded-[14px] p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-[#FFC107]/20 p-2 rounded-xl">
                      <Bell className="w-4 h-4 text-[#FFC107]" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-gray-900 font-medium mb-1">{reminder.title}</h5>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        <span>{format(new Date(reminder.date), 'MMM d, yyyy')}</span>
                      </div>
                      {reminder.description && (
                        <p className="text-sm text-gray-600 mt-2">{reminder.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 text-sm mb-2">No upcoming reminders</p>
              <button
                onClick={() => navigate('/app/add-reminder')}
                className="text-[#1A6B6B] hover:text-[#145555] text-sm font-medium"
              >
                Add a reminder
              </button>
            </div>
          )}
        </div>

        {/* Vet Contact Section */}
        {pet.veterinarian && (
          <div className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-sm text-gray-600 mb-4 uppercase tracking-wide font-semibold">Vet Contact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-900 font-semibold text-lg">{pet.veterinarian.name}</p>
                <p className="text-gray-600 text-sm">Veterinary Clinic</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-[#1A6B6B]/10 p-2 rounded-xl">
                    <Phone className="w-4 h-4 text-[#1A6B6B]" strokeWidth={1.5} />
                  </div>
                  <a href={`tel:${pet.veterinarian.phone}`} className="text-[#1A6B6B] hover:underline text-sm font-medium">
                    {pet.veterinarian.phone}
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-[#1A6B6B]/10 p-2 rounded-xl">
                    <Mail className="w-4 h-4 text-[#1A6B6B]" strokeWidth={1.5} />
                  </div>
                  <a href={`mailto:${pet.veterinarian.email}`} className="text-[#1A6B6B] hover:underline text-sm break-all font-medium">
                    {pet.veterinarian.email}
                  </a>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-[#1A6B6B]/10 p-2 rounded-xl">
                    <MapPin className="w-4 h-4 text-[#1A6B6B]" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-700 text-sm">{pet.veterinarian.address}</p>
                </div>
              </div>

              <a
                href={`tel:${pet.veterinarian.phone}`}
                className="block w-full bg-[#E8734A] text-white py-4 rounded-[14px] text-center hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg font-medium mt-4"
              >
                Call Vet
              </a>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}