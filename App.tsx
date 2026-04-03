import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { setupNotificationHandler, requestNotificationPermissions } from './src/services/notifications';

setupNotificationHandler();

export default function App() {
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <SubscriptionProvider>
          <StatusBar style="light" />
          <AppNavigator />
        </SubscriptionProvider>
      </DataProvider>
    </AuthProvider>
  );
}
