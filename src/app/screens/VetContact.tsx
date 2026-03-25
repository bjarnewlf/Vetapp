import { Phone, Mail, MapPin } from 'lucide-react';
import { usePets } from '../context/PetContext';
import BottomNav from '../components/BottomNav';

export default function VetContact() {
  const { pets } = usePets();

  // Get veterinarian info from the first pet (assuming all pets share the same vet)
  const vet = pets[0]?.veterinarian || {
    name: 'Dr. Sarah Johnson',
    phone: '+1 555-0123',
    email: 'sarah.j@vetclinic.com',
    address: '123 Pet Care Lane, Springfield',
  };

  return (
    <div className="min-h-screen bg-[#F5EFE6] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 shadow-sm">
        <h1 className="text-2xl text-gray-900">Vet Contact</h1>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Vet Info Card */}
        <div className="bg-white rounded-[14px] shadow-sm p-6 border border-gray-100">
          <div className="mb-6">
            <h2 className="text-2xl text-gray-900 font-semibold mb-2">{vet.name}</h2>
            <p className="text-gray-600">Veterinary Clinic</p>
          </div>

          <div className="space-y-4">
            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="bg-[#1A6B6B]/10 p-3 rounded-xl">
                <Phone className="w-5 h-5 text-[#1A6B6B]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">Phone</p>
                <a
                  href={`tel:${vet.phone}`}
                  className="text-[#1A6B6B] hover:underline font-medium"
                >
                  {vet.phone}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="bg-[#1A6B6B]/10 p-3 rounded-xl">
                <Mail className="w-5 h-5 text-[#1A6B6B]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">Email</p>
                <a
                  href={`mailto:${vet.email}`}
                  className="text-[#1A6B6B] hover:underline break-all font-medium"
                >
                  {vet.email}
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="bg-[#1A6B6B]/10 p-3 rounded-xl">
                <MapPin className="w-5 h-5 text-[#1A6B6B]" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1 font-medium">Address</p>
                <p className="text-gray-900">{vet.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call Button */}
        <a
          href={`tel:${vet.phone}`}
          className="block w-full bg-[#E8734A] text-white py-4 rounded-[14px] text-lg text-center hover:bg-[#D5633A] transition-all shadow-md hover:shadow-lg font-medium"
        >
          Call Vet
        </a>

        {/* Emergency Notice */}
        <div className="bg-[#FFC107]/10 border border-[#FFC107]/30 rounded-[14px] p-4">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">Emergency?</span> For after-hours emergencies, 
            please call the emergency hotline at +1 555-EMERGENCY
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}