import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  ScrollView,
  Linking,
} from 'react-native';
import { theme } from '../theme/theme';

export default function ApiKeysScreen({ navigation, route }: any) {
  const { assistantName, wakeWord, roles } = route.params;
  const [geminiKey, setGeminiKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const faqAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleFaq = () => {
    setShowFaq(prev => !prev);
    Animated.timing(faqAnim, {
      toValue: showFaq ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const canContinue = geminiKey.trim().length > 0 || claudeKey.trim().length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Step label */}
        <Text style={styles.stepLabel}>04 / 06</Text>

        {/* Heading */}
        <Text style={styles.preheading}>Your assistant runs on these.</Text>
        <Text style={styles.heading}>Drop in your API keys{'\n'}and we handle the rest.</Text>

        {/* Security note */}
        <View style={styles.securityBadge}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Stored only on your device. Always.
          </Text>
        </View>

        {/* Gemini Key */}
        <View style={styles.keyCard}>
          <View style={styles.keyCardHeader}>
            <Text style={styles.keyCardIcon}>⚡</Text>
            <View style={styles.keyCardInfo}>
              <Text style={styles.keyCardTitle}>Gemini</Text>
              <Text style={styles.keyCardDesc}>Fast, visual, free to start</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://aistudio.google.com/app/apikey')}
            >
              <Text style={styles.getKeyLink}>Get yours →</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.keyInput}
            placeholder="AIza..."
            placeholderTextColor={theme.colors.textDim}
            value={geminiKey}
            onChangeText={setGeminiKey}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </View>

        {/* Claude Key */}
        <View style={styles.keyCard}>
          <View style={styles.keyCardHeader}>
            <Text style={styles.keyCardIcon}>🧠</Text>
            <View style={styles.keyCardInfo}>
              <Text style={styles.keyCardTitle}>Claude</Text>
              <Text style={styles.keyCardDesc}>Deep thinking, complex tasks</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://console.anthropic.com/')}
            >
              <Text style={styles.getKeyLink}>Get yours →</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.keyInput}
            placeholder="sk-ant-..."
            placeholderTextColor={theme.colors.textDim}
            value={claudeKey}
            onChangeText={setClaudeKey}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
        </View>

        {/* FAQ */}
        <TouchableOpacity onPress={toggleFaq} style={styles.faqToggle}>
          <Text style={styles.faqToggleText}>
            {showFaq ? '▼' : '▶'} Why do I need these?
          </Text>
        </TouchableOpacity>

        {showFaq && (
          <Animated.View style={[styles.faqContent, { opacity: faqAnim }]}>
            <Text style={styles.faqText}>
              Forge uses AI APIs to power {assistantName}. Instead of billing you
              through the app, your key connects directly to the AI provider —
              so you're always in control of your usage and costs. Most providers
              offer a free tier that's more than enough to get started.
            </Text>
          </Animated.View>
        )}
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.button, !canContinue && styles.buttonDisabled]}
          onPress={() =>
            canContinue &&
            navigation.navigate('Vehicles', {
              assistantName,
              wakeWord,
              roles,
              geminiKey: geminiKey.trim(),
              claudeKey: claudeKey.trim(),
            })
          }
          activeOpacity={0.8}
          disabled={!canContinue}
        >
          <Text style={[styles.buttonText, !canContinue && styles.buttonTextDisabled]}>
            Lock it in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Vehicles', {
              assistantName,
              wakeWord,
              roles,
              geminiKey: '',
              claudeKey: '',
            })
          }
        >
          <Text style={styles.skipText}>I'll add these later</Text>
        </TouchableOpacity>

        {/* Progress dots */}
        <View style={styles.dots}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.dot, i === 3 && styles.dotActive]} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
  },
  stepLabel: {
    fontSize: 12,
    color: theme.colors.textDim,
    letterSpacing: 2,
    marginBottom: theme.spacing.lg,
  },
  preheading: {
    fontSize: 15,
    color: theme.colors.primary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 38,
    marginBottom: theme.spacing.lg,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    gap: 8,
  },
  securityIcon: {
    fontSize: 14,
  },
  securityText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  keyCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  keyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: 10,
  },
  keyCardIcon: {
    fontSize: 20,
  },
  keyCardInfo: {
    flex: 1,
  },
  keyCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  keyCardDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  getKeyLink: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  keyInput: {
    fontSize: 14,
    color: theme.colors.text,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
  },
  faqToggle: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  faqToggleText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  faqContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  faqText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  buttonArea: {
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.card,
  },
  buttonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonTextDisabled: {
    color: theme.colors.textDim,
  },
  skipText: {
    fontSize: 14,
    color: theme.colors.textDim,
    fontStyle: 'italic',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: theme.colors.textDim,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    width: 18,
  },
});
