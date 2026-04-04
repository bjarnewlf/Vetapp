import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { SkeletonCard } from '../components';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { sendChatMessage, buildPetContext, ChatMessage } from '../services/aiService';
import { usePets } from '../context/PetContext';
import { useMedical } from '../context/MedicalContext';
import { useSubscription } from '../context/SubscriptionContext';

interface AIAssistantScreenProps {
  navigation: any;
}

interface LocalMessage extends ChatMessage {
  id: string;
  error?: boolean;
  isTyping?: boolean;
}

export function AIAssistantScreen({ navigation }: AIAssistantScreenProps) {
  const { isPro, loading: subscriptionLoading } = useSubscription();
  const { pets } = usePets();
  const { medicalEvents } = useMedical();

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const paywallShown = useRef(false);
  useFocusEffect(
    useCallback(() => {
      if (!subscriptionLoading && !isPro && !paywallShown.current) {
        paywallShown.current = true;
        navigation.navigate('Paywall', { feature: 'ai_assistant' });
      }
      return () => { paywallShown.current = false; };
    }, [subscriptionLoading, isPro, navigation])
  );

  if (subscriptionLoading) {
    return (
      <View style={styles.loadingScreen}>
        <SkeletonCard />
        <View style={{ height: spacing.md }} />
        <SkeletonCard />
        <View style={{ height: spacing.md }} />
        <SkeletonCard />
      </View>
    );
  }

  if (!isPro) {
    return <View style={styles.loadingScreen} />;
  }

  const quickActions: string[] = [
    ...(pets.length > 0 ? [`Was sollte ich bei ${pets[0].name} beachten?`] : []),
    'Impfplan erklären',
    'Symptome einschätzen',
    'Ernährungsempfehlungen',
  ];

  async function doSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsgId = String(Date.now());
    const userMsg: LocalMessage = { id: userMsgId, role: 'user', content: trimmed };
    const typingMsg: LocalMessage = { id: '__typing__', role: 'assistant', content: '', isTyping: true };

    setMessages((prev) => [...prev, userMsg, typingMsg]);
    setInput('');
    setLoading(true);

    try {
      const petContext = buildPetContext(pets, medicalEvents);
      const history: ChatMessage[] = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
      const response = await sendChatMessage(history, petContext);
      const aiMsg: LocalMessage = { id: String(Date.now() + 1), role: 'assistant', content: response };
      setMessages((prev) => {
        const withoutTyping = prev.filter((m) => m.id !== '__typing__');
        return [...withoutTyping, aiMsg];
      });
    } catch {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== '__typing__')
          .map((m) => (m.id === userMsgId ? { ...m, error: true } : m))
      );
    } finally {
      setLoading(false);
    }
  }

  function handleRetry(msg: LocalMessage) {
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, error: false } : m)));
    doSend(msg.content);
  }

  function handleClearChat() {
    setMessages([]);
  }

  const hasChat = messages.length > 0;
  const invertedData: LocalMessage[] = [...messages].reverse();

  function renderMessage({ item }: { item: LocalMessage }) {
    if (item.isTyping) {
      return (
        <View style={styles.aiBubbleWrapper}>
          <View style={styles.aiAvatarBadge}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
          </View>
          <View style={styles.aiBubble}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        </View>
      );
    }

    if (item.role === 'user') {
      return (
        <View style={styles.userMsgGroup}>
          <View style={styles.userBubble}>
            <Text style={[typography.body, { color: colors.textOnPrimary }]}>{item.content}</Text>
          </View>
          {item.error && (
            <TouchableOpacity
              style={[styles.errorRow, loading && { opacity: 0.5 }]}
              onPress={() => handleRetry(item)}
              disabled={loading}
            >
              <Ionicons name="refresh-outline" size={14} color={colors.error} />
              <Text style={[typography.caption, styles.errorText]}>
                Fehler beim Senden. Erneut versuchen.
              </Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.aiBubbleWrapper}>
        <View style={styles.aiAvatarBadge}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
        </View>
        <View style={styles.aiBubble}>
          <Text style={[typography.body, { color: colors.text }]}>{item.content}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <View style={styles.headerTitleGroup}>
            <Ionicons name="sparkles" size={16} color={colors.primary} style={styles.headerTitleIcon} />
            <Text style={[typography.h3, styles.headerTitle]}>KI-Assistent</Text>
          </View>
          <View style={styles.headerButtonSlot}>
            {hasChat && (
              <TouchableOpacity style={styles.headerButton} onPress={handleClearChat}>
                <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Inhalt: Empty-State oder Chat */}
        {!hasChat ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.emptyScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Hero */}
            <View style={styles.heroBlock}>
              <View style={styles.heroBadge}>
                <Ionicons name="sparkles" size={36} color={colors.primary} />
              </View>
              <Text style={[typography.h2, styles.heroTitle]}>Wie kann ich helfen?</Text>
              <Text style={[typography.body, styles.heroSubtitle]}>
                Ich kenne deine Tiere und beantworte Gesundheitsfragen persönlich für dich.
              </Text>
            </View>

            {/* Feature-Cards */}
            <View style={styles.featureRow}>
              <View style={styles.featureCard}>
                <Ionicons name="medical-outline" size={22} color={colors.primary} style={styles.featureIcon} />
                <Text style={[typography.caption, styles.featureLabel]}>Gesundheit</Text>
              </View>
              <View style={styles.featureCard}>
                <Ionicons name="nutrition-outline" size={22} color={colors.primary} style={styles.featureIcon} />
                <Text style={[typography.caption, styles.featureLabel]}>Ernährung</Text>
              </View>
              <View style={styles.featureCard}>
                <Ionicons name="pulse-outline" size={22} color={colors.primary} style={styles.featureIcon} />
                <Text style={[typography.caption, styles.featureLabel]}>Vorsorge</Text>
              </View>
            </View>

            {/* Quick-Actions */}
            <Text style={[typography.caption, styles.quickActionsLabel]}>DIREKT LOSLEGEN</Text>
            <View style={styles.quickActionsColumn}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action}
                  style={styles.quickActionChip}
                  onPress={() => doSend(action)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} style={styles.chipLeadIcon} />
                  <Text style={[typography.label, styles.chipLabel]}>{action}</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color={colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={invertedData}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            inverted
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.messageSeparator} />}
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* Disclaimer-Strip */}
        <View style={styles.disclaimerStrip}>
          <Text style={[typography.caption, styles.disclaimerText]}>
            KI-Antworten sind keine tierärztliche Beratung.
          </Text>
        </View>

        {/* Input-Bar */}
        <View style={styles.inputContainer}>
          <View style={styles.inputInner}>
            <TextInput
              style={[typography.body, styles.textInput]}
              value={input}
              onChangeText={setInput}
              placeholder="Frage stellen..."
              placeholderTextColor={colors.textLight}
              multiline
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]}
            onPress={() => doSend(input)}
            disabled={!input.trim() || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.textOnPrimary} />
            ) : (
              <Ionicons name="send" size={18} color={colors.textOnPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  // --- Header ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  headerSpacer: {
    width: 44,
  },
  headerTitleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleIcon: {
    marginRight: spacing.xs,
  },
  headerTitle: {
    color: colors.text,
  },
  headerButtonSlot: {
    width: 44,
    alignItems: 'flex-end',
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Empty State ---
  emptyScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 32,
  },
  heroBlock: {
    alignItems: 'center',
  },
  heroBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTitle: {
    marginTop: spacing.md,
    textAlign: 'center',
    color: colors.text,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  featureRow: {
    flexDirection: 'row',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  featureCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  featureIcon: {
    marginBottom: spacing.xs,
  },
  featureLabel: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  quickActionsLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    color: colors.textLight,
    letterSpacing: 0.5,
  },
  quickActionsColumn: {
    gap: spacing.sm,
  },
  quickActionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  chipLeadIcon: {
    marginRight: spacing.sm,
  },
  chipLabel: {
    flex: 1,
    color: colors.text,
  },

  // --- Chat-Liste ---
  listContent: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },

  // --- User-Bubble ---
  userMsgGroup: {
    alignItems: 'flex-end',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 24,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    maxWidth: '80%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 3,
  },

  // --- AI-Bubble ---
  aiBubbleWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  aiAvatarBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
    marginBottom: 2, // visuelle Ausrichtung auf Bubble-Unterkante
  },
  aiBubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 8,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },

  // --- Fehler ---
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },

  // --- Disclaimer-Strip ---
  disclaimerStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  disclaimerText: {
    flex: 1,
    color: colors.textLight,
  },

  // --- Input-Bar ---
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  inputInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    minHeight: 40,
    maxHeight: 120,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },

  // --- Loading / Non-Pro ---
  loadingScreen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Chat Separator ---
  messageSeparator: {
    height: spacing.md,
  },
});
