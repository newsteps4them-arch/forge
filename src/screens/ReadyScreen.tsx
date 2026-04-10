import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme/theme';

export default function ReadyScreen({ navigation, route }: any) {
  const { assistantName, wakeWord, roles, geminiKey, claudeKey, vehicles } = route.params;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const sparkAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(sparkAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLetsGo = async () => {
    try {
      const userData = {
        assistantName,
        wakeWord: wakeWord.toLowerCase(),
        roles,
        apiKeys: {
          gemini: geminiKey,
          anthropic: claudeKey,
        },
        vehicles,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('forge_user', JSON.stringify(userData));
      navigation.replace('Main');
    } catch (e) {
      console.error('Failed to save user data', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Ember sparks */}
      <View style={styles.sparksContainer}>
        {[...Array(8)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.spark,
              {
                left: 30 + i * 40,
                top: 80 + (i % 3) * 60,
                opacity: sparkAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.12 + (i % 4) * 0.05],
                }),
              },
            ]}
          />
        ))}
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Icon */}
        <Text style={styles.forgeIcon}>⚒</Text>

        {/* Main message */}
        <Text style={styles.heading}>{assistantName} is ready.</Text>
        <Text style={styles.subheading}>
          Trained on you. Built for whatever's next.
        </Text>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <SummaryRow icon="🎙" label="Wake word" value={`"${wakeWord}"`} />
          <SummaryRow
            icon="⚡"
            label="Gemini"
            value={geminiKey ? 'Connected' : 'Not set'}
            valueColor={geminiKey ? theme.colors.success : theme.colors.textDim}
          />
          <SummaryRow
            icon="🧠"
            label="Claude"
            value={claudeKey ? 'Connected' : 'Not set'}
            valueColor={claudeKey ? theme.colors.success : theme.colors.textDim}
          />
          <SummaryRow
            icon="🚗"
            label="Vehicles"
            value={vehicles.length > 0 ? `${vehicles.length} added` : 'None yet'}
            valueColor={vehicles.length > 0 ? theme.colors.success : theme.colors.textDim}
          />
        </View>
      </Animated.View>

      {/* Button */}
      <Animated.View style={[styles.buttonArea, { opacity: buttonAnim }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleLetsGo}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Let's go</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={summaryStyles.row}>
      <Text style={summaryStyles.icon}>{icon}</Text>
      <Text style={summaryStyles.label}>{label}</Text>
      <Text style={[summaryStyles.value, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 10,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'space-between',
    paddingBottom: 48,
  },
  sparksContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  spark: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  forgeIcon: {
    fontSize: 56,
    marginBottom: theme.spacing.lg,
  },
  heading: {
    fontSize: 36,
    fontWeight: '800',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subheading: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: theme.spacing.xl,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonArea: {
    paddingHorizontal: theme.spacing.xl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
