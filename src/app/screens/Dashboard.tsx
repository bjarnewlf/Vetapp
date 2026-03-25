import { useNavigate } from 'react-router';
import { Plus, Calendar, Bell } from 'lucide-react';
import { usePets } from '../context/PetContext';
import { format, differenceInYears, isFuture, isPast } from 'date-fns';
import BottomNav from '../components/BottomNav';

export default function Dashboard() {
  const navigate = useNavigate();
  const { pets, reminders } = usePets();

  const getAge = (birthDate: string) => {
    return differenceInYears(new Date(), new Date(birthDate));
  };

  // Get next upcoming reminder
  const getNextReminder = () => {
    const upcoming = reminders
      .filter((r) => r.status === 'pending' && isFuture(new Date(r.date)))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
    return upcoming;
  };

  const nextReminder = getNextReminder();

  // Get pet name for reminder
  const getPetNameForReminder = (reminder: any) => {
    if (reminder.petId) {
      const pet = pets.find(p => p.id === reminder.petId);
      return pet?.name;
    }
    return null;
  };

  // Empty State when no pets
  if (pets.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] pb-24">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#1A6B6B] to-[#145555] text-white px-6 pt-12 pb-10 rounded-b-[32px]">
          <h1 className="text-3xl mb-2">Hello! 👋</h1>
          <p className="text-white/80">Welcome to VetApp</p>
        </div>

        {/* Empty State */}
        <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
          <div className="text-8xl mb-6">🐾</div>
          <h2 className="text-2xl text-gray-900 mb-3">No pets yet</h2>
          <p className="text-gray-600 mb-8 max-w-sm">
            Add your first pet to start tracking health information, treatments, and reminders.
          </p>
          <button
            onClick={() => navigate('/app/add-pet')}
            className="bg-[#E8734A] text-white px-8 py-3 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Pet
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#1A6B6B] to-[#145555] text-white px-6 pt-12 pb-10 rounded-b-[32px]">
        <h1 className="text-3xl mb-2">Hello! 👋</h1>
        <p className="text-white/80">Welcome back to VetApp</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Next Reminder Card */}
        {nextReminder && (
          <div className="bg-white rounded-[14px] shadow-sm p-5 border-l-4 border-[#FFC107]">
            <div className="flex items-start gap-3">
              <div className="bg-[#FFF3CD] p-2.5 rounded-xl mt-0.5">
                <Bell className="w-5 h-5 text-[#FFC107]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1 font-medium">Next Reminder</p>
                <h3 className="text-base text-gray-900 mb-1">
                  {getPetNameForReminder(nextReminder) && (
                    <span className="font-semibold">{getPetNameForReminder(nextReminder)} – </span>
                  )}
                  {nextReminder.title.replace(`${getPetNameForReminder(nextReminder)} - `, '')}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  <span>{format(new Date(nextReminder.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pets Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-900">My Pets</h2>
            <button
              onClick={() => navigate('/app/add-pet')}
              className="text-[#1A6B6B] hover:text-[#145555] text-sm font-medium flex items-center gap-1 transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Add Pet
            </button>
          </div>

          {/* Pet Cards */}
          {pets.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  onClick={() => navigate(`/app/pet/${pet.id}`)}
                  className="bg-white rounded-[14px] shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-gray-900 font-semibold mb-1">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.type}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[14px] shadow-sm p-8 text-center">
              <p className="text-gray-500 mb-3">No pets yet</p>
              <button
                onClick={() => navigate('/app/add-pet')}
                className="text-[#1A6B6B] hover:text-[#145555] font-medium"
              >
                Add your first pet
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {pets.length > 0 && (
          <div className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100">
            <h3 className="text-gray-900 font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl text-[#1A6B6B] font-semibold mb-1">{pets.length}</p>
                <p className="text-xs text-gray-600">Pets</p>
              </div>
              <div>
                <p className="text-2xl text-[#28A745] font-semibold mb-1">
                  {pets.reduce((acc, pet) => acc + pet.vaccinations.length, 0)}
                </p>
                <p className="text-xs text-gray-600">Vaccinations</p>
              </div>
              <div>
                <p className="text-2xl text-[#E8734A] font-semibold mb-1">
                  {pets.reduce((acc, pet) => acc + pet.treatments.length, 0)}
                </p>
                <p className="text-xs text-gray-600">Treatments</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}