import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          switch (route.name) {
            case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
            case 'My Pets': iconName = focused ? 'paw' : 'paw-outline'; break;
            case 'AI': iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'; break;
            case 'Reminders': iconName = focused ? 'notifications' : 'notifications-outline'; break;
            case 'Vet Contact': iconName = focused ? 'medkit' : 'medkit-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.borderLight,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Start' }} />
      <Tab.Screen name="My Pets" component={MyPetsScreen} options={{ tabBarLabel: 'Tiere' }} />
      <Tab.Screen name="AI" component={AIAssistantScreen} options={{ tabBarLabel: 'KI-Assistent' }} />
      <Tab.Screen name="Reminders" component={RemindersScreen} options={{ tabBarLabel: 'Erinnerungen' }} />
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
  const { pets, loading: dataLoading } = useData();
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
  }, [session, dataLoading]); // eslint-disable-line react-hooks/exhaustive-deps

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
