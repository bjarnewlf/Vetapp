import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme';
import { FloatingTabBar } from '../components/FloatingTabBar';
import { useAuth } from '../context/AuthContext';
import { usePets } from '../context/PetContext';
import type { RootStackParamList, TabParamList } from '../types/navigation';
import {
  LoginScreen,
  RegisterScreen,
  HomeScreen,
  MyPetsScreen,
  AddPetScreen,
  PetDetailScreen,
  RemindersScreen,
  AddReminderScreen,
  VetContactScreen,
  ProfileScreen,
  PaywallScreen,
  AddEventScreen,
  EventDetailScreen,
  ReminderSettingsScreen,
  OnboardingScreen,
  AddVetContactScreen,
  AIAssistantScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Start' }} />
      <Tab.Screen name="My Pets" component={MyPetsScreen} options={{ tabBarLabel: 'Tiere' }} />
      <Tab.Screen name="AI" component={AIAssistantScreen} options={{ tabBarLabel: 'KI' }} />
      <Tab.Screen name="Reminders" component={RemindersScreen} options={{ tabBarLabel: 'Erinnern' }} />
      <Tab.Screen name="Vet Contact" component={VetContactScreen} options={{ tabBarLabel: 'Tierarzt' }} />
    </Tab.Navigator>
  );
}

function AuthScreens() {
  const [isLogin, setIsLogin] = useState(true);

  if (isLogin) {
    return <LoginScreen onSwitchToRegister={() => setIsLogin(false)} />;
  }
  return <RegisterScreen onSwitchToLogin={() => setIsLogin(true)} />;
}

export function AppNavigator() {
  const { session, loading } = useAuth();
  const { pets, loading: dataLoading } = usePets();
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Reset when user logs out
  useEffect(() => {
    if (!session) {
      setOnboardingDismissed(false);
      setInitialDataLoaded(false);
    }
  }, [session]);

  // Track when initial data load completes
  useEffect(() => {
    if (session && !dataLoading && !initialDataLoaded) {
      setInitialDataLoaded(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- initialDataLoaded bewusst ausgelassen: Effect soll nur einmal feuern wenn Daten erstmals geladen sind, nicht bei jedem Reset
  }, [session, dataLoading]);

  if (loading || (session && !initialDataLoaded)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Show onboarding if logged in, no pets, and not yet dismissed
  if (session && pets.length === 0 && !onboardingDismissed) {
    return (
      <OnboardingScreen
        onComplete={() => setOnboardingDismissed(true)}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!session ? (
          <Stack.Screen name="Auth" component={AuthScreens} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="AddPet" component={AddPetScreen} />
            <Stack.Screen name="PetDetail" component={PetDetailScreen} />
            <Stack.Screen name="AddReminder" component={AddReminderScreen} />
            <Stack.Screen name="AddEvent" component={AddEventScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen} />
            <Stack.Screen name="AddVetContact" component={AddVetContactScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="Paywall"
              component={PaywallScreen}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
