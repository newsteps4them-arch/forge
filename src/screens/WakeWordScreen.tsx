import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { theme } from '../theme/theme';

export default function WakeWordScreen({ navigation, route }: any) {
  const { assistantName } = route.params;
  const [wakeWord, setWakeWord] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

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

    // Pulse animation for mic icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Step label */}
        <Text style={styles.stepLabel}>02 / 06</Text>

        {/* Heading */}
        <Text style={styles.preheading}>Now give them a signal.</Text>
        <Text style={styles.heading}>How do you want{'\n'}to call {assistantName}?</Text>

        {/* Mic pulse */}
        <Animated.View style={[styles.micContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.micIcon}>🎙</Text>
        </Animated.View>

        {/* Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Hey..."
            placeholderTextColor={theme.colors.textDim}
            value={wakeWord}
            onChangeText={setWakeWord}
            autoCapitalize="none"
            returnKeyType="done"
          />
          {wakeWord.length > 0 && (
            <Text style={styles.inputGlow}>✦</Text>
          )}
        </View>

        {/* Hint */}
        <Text style={styles.hint}>
          "Say it like you mean it — they'll be listening"
        </Text>

        {/* Example */}
        <Text style={styles.example}>
          Example: Hey Nova · Yo Wrench · Aye {assistantName}
        </Text>
      </Animated.View>

      {/* Button */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.button, !wakeWord.trim() && styles.buttonDisabled]}
          onPress={() =>
            wakeWord.trim() &&
            navigation.navigate('AboutYou', {
              assistantName,
              wakeWord: wakeWord.trim(),
            })
          }
          activeOpacity={0.8}
          disabled={!wakeWord.trim()}
        >
          <Text style={[styles.buttonText, !wakeWord.trim() && styles.buttonTextDisabled]}>
            Perfect
          </Text>
        </TouchableOpacity>

        {/* Progress dots */}
        <View style={styles.dots}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
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
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.text,
    lineHeight: 42,
    marginBottom: theme.spacing.xl,
  },
  micContainer: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  micIcon: {
    fontSize: 36,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.primary,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: theme.colors.text,
    paddingVertical: 0,
  },
  inputGlow: {
    fontSize: 18,
    color: theme.colors.primary,
  },
  hint: {
    fontSize: 13,
    color: theme.colors.textDim,
    fontStyle: 'italic',
    marginBottom: theme.spacing.sm,
  },
  example: {
    fontSize: 12,
    color: theme.colors.textDim,
    letterSpacing: 0.3,
  },
  buttonArea: {
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.lg,
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
