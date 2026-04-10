import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { theme } from '../theme/theme';

const ROLES = [
  { id: 'mechanic', emoji: '🔧', label: 'Turning wrenches' },
  { id: 'developer', emoji: '💻', label: 'Writing code' },
  { id: 'field', emoji: '🏗️', label: 'Working the field' },
  { id: 'business', emoji: '📋', label: 'Running the show' },
  { id: 'other', emoji: '✨', label: 'Something else' },
];

export default function AboutYouScreen({ navigation, route }: any) {
  const { assistantName, wakeWord } = route.params;
  const [selected, setSelected] = useState<string[]>([]);
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

  const toggleRole = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Step label */}
        <Text style={styles.stepLabel}>03 / 06</Text>

        {/* Heading */}
        <Text style={styles.preheading}>
          {assistantName} works harder when it knows you.
        </Text>
        <Text style={styles.heading}>What's your world{'\n'}made of?</Text>
        <Text style={styles.subheading}>Pick all that apply.</Text>

        {/* Role cards */}
        <View style={styles.rolesContainer}>
          {ROLES.map(role => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                selected.includes(role.id) && styles.roleCardActive,
              ]}
              onPress={() => toggleRole(role.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.roleEmoji}>{role.emoji}</Text>
              <Text
                style={[
                  styles.roleLabel,
                  selected.includes(role.id) && styles.roleLabelActive,
                ]}
              >
                {role.label}
              </Text>
              {selected.includes(role.id) && (
                <Text style={styles.roleCheck}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Button */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.button, selected.length === 0 && styles.buttonDisabled]}
          onPress={() =>
            selected.length > 0 &&
            navigation.navigate('ApiKeys', {
              assistantName,
              wakeWord,
              roles: selected,
            })
          }
          activeOpacity={0.8}
          disabled={selected.length === 0}
        >
          <Text style={[styles.buttonText, selected.length === 0 && styles.buttonTextDisabled]}>
            This is me
          </Text>
        </TouchableOpacity>

        {/* Progress dots */}
        <View style={styles.dots}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.dot, i === 2 && styles.dotActive]} />
          ))}
        </View>
      </View>
    </View>
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
    marginBottom: theme.spacing.sm,
  },
  subheading: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  rolesContainer: {
    gap: 10,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 12,
  },
  roleCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surface,
  },
  roleEmoji: {
    fontSize: 22,
  },
  roleLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  roleLabelActive: {
    color: theme.colors.text,
  },
  roleCheck: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: '700',
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
