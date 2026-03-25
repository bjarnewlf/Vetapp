import { useNavigate, useLocation } from 'react-router';
import { Home, PawPrint, Bell, Stethoscope, User } from 'lucide-react';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/app', icon: Home, label: 'Home' },
    { path: '/app/pets', icon: PawPrint, label: 'My Pets' },
    { path: '/app/reminders', icon: Bell, label: 'Reminders' },
    { path: '/app/vet-contact', icon: Stethoscope, label: 'Vet Contact' },
    { path: '/app/profile', icon: User, label: 'Profile' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe shadow-lg">
      <div className="flex items-center justify-around px-2 py-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 py-2 px-1 transition-all relative ${
                active ? 'text-[#1A6B6B]' : 'text-gray-500'
              }`}
            >
              {active && (
                <div className="absolute -top-1 w-12 h-1 bg-[#E8734A] rounded-full" />
              )}
              <Icon className={`w-6 h-6 mb-1 ${active ? 'stroke-[2]' : 'stroke-[1.5]'}`} strokeWidth={active ? 2 : 1.5} />
              <span className={`text-xs transition-all ${active ? 'font-medium' : 'font-normal'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}