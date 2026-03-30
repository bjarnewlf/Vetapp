import { StatusBar } from 'expo-status-bar';
import { SubscriptionProvider } from './src/context/SubscriptionContext';
import { DataProvider } from './src/context/DataContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <DataProvider>
      <SubscriptionProvider>
        <StatusBar style="light" />
        <AppNavigator />
      </SubscriptionProvider>
    </DataProvider>
  );
}
