import { useNavigate } from 'react-router';
import { Plus, ChevronRight } from 'lucide-react';
import { usePets } from '../context/PetContext';
import { differenceInYears, differenceInMonths } from 'date-fns';
import BottomNav from '../components/BottomNav';

export default function MyPets() {
  const navigate = useNavigate();
  const { pets } = usePets();

  const getAge = (birthDate: string) => {
    const years = differenceInYears(new Date(), new Date(birthDate));
    const months = differenceInMonths(new Date(), new Date(birthDate)) % 12;
    
    if (years === 0) {
      return `${months} month${months !== 1 ? 's' : ''} old`;
    }
    return `${years} year${years !== 1 ? 's' : ''} old`;
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 shadow-sm">
        <h1 className="text-2xl text-gray-900">My Pets</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Add Pet Button */}
        <button
          onClick={() => navigate('/app/add-pet')}
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add Pet
        </button>

        {/* Pets Grid */}
        {pets.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => navigate(`/app/pet/${pet.id}`)}
                className="bg-white rounded-[14px] shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-all hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4 p-5">
                  <img
                    src={pet.photo}
                    alt={pet.name}
                    className="w-20 h-20 rounded-[14px] object-cover border-2 border-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-900 font-semibold mb-1">{pet.name}</h3>
                    <p className="text-gray-600 mb-1">{pet.breed}</p>
                    <p className="text-sm text-gray-500">{getAge(pet.birthDate)}</p>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400" strokeWidth={1.5} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[14px] shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4 font-medium">No pets added yet</p>
            <p className="text-sm text-gray-400">
              Tap the "Add Pet" button to get started
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}