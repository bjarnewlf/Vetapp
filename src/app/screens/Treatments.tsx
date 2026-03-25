import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Plus, Calendar } from 'lucide-react';
import { usePets } from '../context/PetContext';
import { format } from 'date-fns';
import BottomNav from '../components/BottomNav';

export default function Treatments() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { getPetById } = usePets();

  const pet = getPetById(petId || '');

  if (!pet) {
    return (
      <div className="min-h-screen bg-[#F5EFE6] flex items-center justify-center pb-20">
        <p className="text-gray-600">Pet not found</p>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate(`/app/pet/${petId}`)}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <h1 className="text-xl text-gray-900">Treatments - {pet.name}</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Add Treatment Button */}
        <button
          onClick={() => navigate(`/app/pet/${petId}/add-treatment`)}
          className="w-full bg-[#E8734A] text-white py-4 rounded-[14px] hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add Treatment
        </button>

        {/* Treatments List */}
        {pet.treatments.length > 0 ? (
          <div className="space-y-3">
            {pet.treatments.map((treatment) => (
              <div
                key={treatment.id}
                className="bg-white rounded-[14px] shadow-sm p-5 border border-gray-100"
              >
                <h3 className="text-lg text-gray-900 font-semibold mb-2">{treatment.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" strokeWidth={1.5} />
                  <span>{format(new Date(treatment.date), 'MMM d, yyyy')}</span>
                </div>
                {treatment.notes && (
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    <span className="font-semibold">Notes:</span> {treatment.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[14px] shadow-sm p-8 text-center">
            <p className="text-gray-500 font-medium">No treatments recorded yet</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}