import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';
import { sendChatMessage, buildPetContext, ChatMessage } from '../services/aiService';
import { useData } from '../context/DataContext';
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
  const { isPro } = useSubscription();
  const { pets, vaccinations, treatments } = useData();

  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!isPro) {
      navigation.replace('Paywall', { feature: 'ai_assistant' });
    }
  }, [isPro, navigation]);

  if (!isPro) {
    return <View style={{ flex: 1, backgroundColor: colors.surface }} />;
  }

  const quickActions: string[] = [
    ...(pets.length > 0 ? [`Fragen zu ${pets[0].name}`] : []),
    'Impfplan erklären',
    'Symptome einschätzen',
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
      const petContext = buildPetContext(pets, vaccinations, treatments);
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

  function showInfo() {
    Alert.alert(
      'Hinweis',
      'Ich bin ein KI-Assistent und kein Ersatz für professionellen tierärztlichen Rat. Bei ernsten Symptomen bitte immer einen Tierarzt aufsuchen.',
      [{ text: 'Verstanden' }]
    );
  }

  const hasUserMessages = messages.length > 0;

  // Disclaimer always shown at bottom of inverted list (appears at top visually)
  const disclaimerItem: LocalMessage = {
    id: '__disclaimer__',
    role: 'assistant',
    content:
      'Hinweis: Ich bin ein KI-Assistent und kein Ersatz für tierärztlichen Rat. Bei medizinischen Notfällen wende dich bitte sofort an einen Tierarzt.',
  };

  const invertedData: LocalMessage[] = [
    ...[...messages].reverse(),
    disclaimerItem,
  ];

  function renderMessage({ item }: { item: LocalMessage }) {
    if (item.id === '__disclaimer__') {
      return (
        <View style={styles.disclaimerBubble}>
          <Ionicons name="warning-outline" size={14} color={colors.warning} style={styles.disclaimerIcon} />
          <Text style={[typography.caption, styles.disclaimerText]}>{item.content}</Text>
        </View>
      );
    }

    if (item.isTyping) {
      return (
        <View style={styles.aiBubbleWrapper}>
          <Ionicons name="sparkles-outline" size={14} color={colors.primary} style={styles.aiIcon} />
          <View style={styles.aiBubble}>
            <Text style={[typography.body, { color: colors.textLight, letterSpacing: 2 }]}>...</Text>
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
            <TouchableOpacity style={styles.errorRow} onPress={() => handleRetry(item)}>
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
        <Ionicons name="sparkles-outline" size={14} color={colors.primary} style={styles.aiIcon} />
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
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back-outline" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[typography.h3, styles.headerTitle]}>KI-Assistent</Text>
          <TouchableOpacity style={styles.headerButton} onPress={showInfo}>
            <Ionicons name="information-circle-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Chat */}
        <View style={styles.chatContainer}>
          {!hasUserMessages && (
            <View style={styles.emptyContainer}>
              <Ionicons name="sparkles-outline" size={48} color={colors.primary} />
              <Text style={[typography.h3, styles.emptyTitle]}>Wie kann ich helfen?</Text>
              <Text style={[typography.bodySmall, styles.emptySubtitle]}>
                Ich kenne deine Tiere und beantworte Gesundheitsfragen.
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsContainer}
              >
                {quickActions.map((action) => (
                  <TouchableOpacity key={action} style={styles.chip} onPress={() => doSend(action)}>
                    <Text style={[typography.label, styles.chipText]}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <FlatList
            ref={flatListRef}
            data={hasUserMessages ? invertedData : [disclaimerItem]}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            inverted={hasUserMessages}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          />
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[typography.body, styles.textInput]}
            value={input}
            onChangeText={setInput}
            placeholder="Frage stellen..."
            placeholderTextColor={colors.textLight}
            multiline
            editable={!loading}
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.text,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  emptyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptySubtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  chipsContainer: {
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipText: {
    color: colors.primary,
  },
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '80%',
  },
  aiBubbleWrapper: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  aiIcon: {
    marginBottom: 4,
    marginLeft: 2,
  },
  aiBubble: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomLeftRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  disclaimerBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E1',
    borderLeftWidth: 3,
    borderLeftColor: '#D4A020',
    borderRadius: borderRadius.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  disclaimerIcon: {
    marginRight: spacing.xs,
    marginTop: 1,
  },
  disclaimerText: {
    color: colors.text,
    flex: 1,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    color: colors.text,
    maxHeight: 100,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.textLight,
  },
});
