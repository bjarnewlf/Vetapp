import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { AuthProvider } from './src/context/AuthContext';
import { PetProvider } from './src/context/PetContext';
import { MedicalProvider } from './src/context/MedicalContext';
import { VetContactProvider } from './src/context/VetContactContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { setupNotificationHandler, requestNotificationPermissions } from './src/services/notifications';

setupNotificationHandler();

export default function App() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
