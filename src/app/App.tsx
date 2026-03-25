import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PetProvider, usePets } from './context/PetContext';
import Toast from './components/Toast';
import { useState } from 'react';

function AppContent() {
  const { successMessage, showSuccessToast } = usePets();

  return (
    <>
      <RouterProvider router={router} />
      {successMessage && (
        <Toast
          message={successMessage}
          onClose={() => showSuccessToast('')}
        />
      )}
    </>
  );
}

function App() {
  return (
    <PetProvider>
      <AppContent />
    </PetProvider>
  );
}

export default App;