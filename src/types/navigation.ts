import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { Pet, MedicalEvent, RecurrenceType, MedicalEventType } from './index';

// ---- Stack Params ----

export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  AddPet: { pet?: Pet } | undefined;
  PetDetail: { petId: string };
  AddReminder: { petId?: string } | undefined;
  AddEvent: {
    petId?: string;
    eventType?: MedicalEventType;
    editEvent?: {
      id: string;
      title: string;
      date: string;
      description?: string;
      recurrence: RecurrenceType;
      type?: string;
    };
    editMedicalEvent?: MedicalEvent;
  } | undefined;
  EventDetail: { eventId: string };
  ReminderSettings: undefined;
  AddVetContact: { forceNew?: boolean } | undefined;
  Profile: undefined;
  Paywall: { feature: string };
};

// ---- Tab Params ----

export type TabParamList = {
  Home: undefined;
  'My Pets': undefined;
  AI: undefined;
  Reminders: undefined;
  'Vet Contact': undefined;
};

// ---- Navigation Prop Aliases ----

export type RootStackNavProp<Screen extends keyof RootStackParamList> =
  NativeStackNavigationProp<RootStackParamList, Screen>;

export type RootStackRouteProp<Screen extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, Screen>;

export type TabNavProp<Screen extends keyof TabParamList> =
  BottomTabNavigationProp<TabParamList, Screen>;

/** For screens in a tab that also need to push onto the root stack */
export type CompositeTabStackNavProp<Tab extends keyof TabParamList> =
  CompositeNavigationProp<
    BottomTabNavigationProp<TabParamList, Tab>,
    NativeStackNavigationProp<RootStackParamList>
  >;

/** For stack screens that also need to navigate to tabs (e.g. Profile → AI) */
export type CompositeStackTabNavProp<Screen extends keyof RootStackParamList> =
  CompositeNavigationProp<
    NativeStackNavigationProp<RootStackParamList, Screen>,
    BottomTabNavigationProp<TabParamList>
  >;
