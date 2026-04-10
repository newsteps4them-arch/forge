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

export default function NameAssistantScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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
        <Text style={styles.stepLabel}>01 / 06</Text>

        {/* Heading */}
        <Text style={styles.preheading}>First things first.</Text>
        <Text style={styles.heading}>What should we{'\n'}call your AI?</Text>

        {/* Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Give them a name..."
            placeholderTextColor={theme.colors.textDim}
            value={name}
            onChangeText={setName}
            autoFocus
            autoCapitalize="words"
            returnKeyType="done"
          />
          {name.length > 0 && (
            <Text style={styles.inputGlow}>✦</Text>
          )}
        </View>

        {/* Hint */}
        <Text style={styles.hint}>
          "This is who shows up when you need them most"
        </Text>
      </Animated.View>

      {/* Button */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={() => name.trim() && navigation.navigate('WakeWord', { assistantName: name.trim() })}
          activeOpacity={0.8}
          disabled={!name.trim()}
        >
          <Text style={[styles.buttonText, !name.trim() && styles.buttonTextDisabled]}>
            That's the one
          </Text>
        </TouchableOpacity>

        {/* Progress dots */}
        <View style={styles.dots}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
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
