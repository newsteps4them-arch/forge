import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Ember dots decoration */}
      <View style={styles.emberContainer}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.ember,
              {
                left: Math.random() * width,
                top: Math.random() * height * 0.5,
                opacity: 0.15 + Math.random() * 0.2,
                width: 3 + Math.random() * 4,
                height: 3 + Math.random() * 4,
              },
            ]}
          />
        ))}
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Logo area */}
        <View style={styles.logoArea}>
          <Text style={styles.logo}>⚒</Text>
          <Text style={styles.appName}>Forge</Text>
        </View>

        {/* Tagline */}
        <View style={styles.taglineArea}>
          <Text style={styles.tagline}>Forging what your brain sparks.</Text>
          <Text style={styles.subTagline}>Half the brain. Twice the output.</Text>
        </View>
      </Animated.View>

      {/* Button */}
      <Animated.View style={[styles.buttonArea, { opacity: buttonAnim }]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('NameAssistant')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Let's build it</Text>
        </TouchableOpacity>
      </Animated.View>
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
  emberContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  ember: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    fontSize: 56,
    marginBottom: theme.spacing.sm,
  },
  appName: {
    fontSize: 52,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: 4,
  },
  taglineArea: {
    alignItems: 'center',
  },
  tagline: {
    fontSize: 17,
    fontWeight: '500',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    letterSpacing: 0.3,
  },
  subTagline: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
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
