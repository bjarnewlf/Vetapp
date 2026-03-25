import { Outlet } from 'react-router';

export default function Root() {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50">
      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}