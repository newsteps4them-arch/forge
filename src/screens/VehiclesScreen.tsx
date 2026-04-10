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
} from 'react-native';
import { theme } from '../theme/theme';

interface Vehicle {
  id: string;
  year: string;
  make: string;
  model: string;
}

export default function VehiclesScreen({ navigation, route }: any) {
  const { assistantName, wakeWord, roles, geminiKey, claudeKey } = route.params;
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', year: '', make: '', model: '' },
  ]);
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

  const updateVehicle = (id: string, field: keyof Vehicle, value: string) => {
    setVehicles(prev =>
      prev.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const addVehicle = () => {
    setVehicles(prev => [
      ...prev,
      { id: Date.now().toString(), year: '', make: '', model: '' },
    ]);
  };

  const removeVehicle = (id: string) => {
    if (vehicles.length > 1) {
      setVehicles(prev => prev.filter(v => v.id !== id));
    }
  };

  const hasAnyVehicle = vehicles.some(
    v => v.year.trim() || v.make.trim() || v.model.trim()
  );

  const proceed = (skip = false) => {
    const validVehicles = skip
      ? []
      : vehicles.filter(v => v.year.trim() && v.make.trim() && v.model.trim());
    navigation.navigate('Ready', {
      assistantName,
      wakeWord,
      roles,
      geminiKey,
      claudeKey,
      vehicles: validVehicles,
    });
  };

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
        <Text style={styles.stepLabel}>05 / 06</Text>

        {/* Heading */}
        <Text style={styles.preheading}>Optional, but powerful.</Text>
        <Text style={styles.heading}>
          Got vehicles? Add them{'\n'}and watch {assistantName} get{'\n'}smart about them.
        </Text>

        {/* Vehicle cards */}
        {vehicles.map((vehicle, index) => (
          <View key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleCardHeader}>
              <Text style={styles.vehicleCardTitle}>
                🚗 Vehicle {index + 1}
              </Text>
              {vehicles.length > 1 && (
                <TouchableOpacity onPress={() => removeVehicle(vehicle.id)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.vehicleRow}>
              <TextInput
                style={[styles.vehicleInput, styles.yearInput]}
                placeholder="Year"
                placeholderTextColor={theme.colors.textDim}
                value={vehicle.year}
                onChangeText={v => updateVehicle(vehicle.id, 'year', v)}
                keyboardType="numeric"
                maxLength={4}
              />
              <TextInput
                style={[styles.vehicleInput, styles.makeInput]}
                placeholder="Make"
                placeholderTextColor={theme.colors.textDim}
                value={vehicle.make}
                onChangeText={v => updateVehicle(vehicle.id, 'make', v)}
                autoCapitalize="words"
              />
            </View>

            <TextInput
              style={[styles.vehicleInput, styles.modelInput]}
              placeholder="Model"
              placeholderTextColor={theme.colors.textDim}
              value={vehicle.model}
              onChangeText={v => updateVehicle(vehicle.id, 'model', v)}
              autoCapitalize="words"
            />
          </View>
        ))}

        {/* Add another */}
        <TouchableOpacity style={styles.addButton} onPress={addVehicle}>
          <Text style={styles.addButtonText}>+ Add another ride</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Buttons */}
      <View style={styles.buttonArea}>
        <TouchableOpacity
          style={[styles.button, !hasAnyVehicle && styles.buttonDisabled]}
          onPress={() => proceed(false)}
          activeOpacity={0.8}
          disabled={!hasAnyVehicle}
        >
          <Text style={[styles.buttonText, !hasAnyVehicle && styles.buttonTextDisabled]}>
            Looking good
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => proceed(true)}>
          <Text style={styles.skipText}>I'll add these later</Text>
        </TouchableOpacity>

        {/* Progress dots */}
        <View style={styles.dots}>
          {[...Array(6)].map((_, i) => (
            <View key={i} style={[styles.dot, i === 4 && styles.dotActive]} />
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
    marginBottom: theme.spacing.xl,
  },
  vehicleCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  vehicleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  vehicleCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  removeText: {
    fontSize: 13,
    color: theme.colors.error,
  },
  vehicleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  vehicleInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  yearInput: {
    width: 80,
  },
  makeInput: {
    flex: 1,
  },
  modelInput: {
    width: '100%',
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  addButtonText: {
    fontSize: 15,
    color: theme.colors.primary,
    fontWeight: '600',
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
