import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { PetProvider } from './src/context/PetContext';
import { MedicalProvider } from './src/context/MedicalContext';
import { VetContactProvider } from './src/context/VetContactContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { setupNotificationHandler, requestNotificationPermissions } from './src/services/notifications';

setupNotificationHandler();

export default function App() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <SafeAreaProvider>
    <AuthProvider>
      <PetProvider>
        <MedicalProvider>
          <VetContactProvider>
            <SubscriptionProvider>
              <StatusBar style="light" />
              <AppNavigator />
            </SubscriptionProvider>
          </VetContactProvider>
        </MedicalProvider>
      </PetProvider>
    </AuthProvider>
    </SafeAreaProvider>
  );
}
