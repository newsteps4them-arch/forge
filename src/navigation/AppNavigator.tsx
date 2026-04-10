import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

import WelcomeScreen from '../screens/WelcomeScreen';
import NameAssistantScreen from '../screens/NameAssistantScreen';
import WakeWordScreen from '../screens/WakeWordScreen';
import AboutYouScreen from '../screens/AboutYouScreen';
import ApiKeysScreen from '../screens/ApiKeysScreen';
import VehiclesScreen from '../screens/VehiclesScreen';
import ReadyScreen from '../screens/ReadyScreen';
import { theme } from '../theme/theme';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const data = await AsyncStorage.getItem('forge_user');
      if (data) {
        const parsed = JSON.parse(data);
        setOnboarded(parsed.onboardingComplete === true);
      }
    } catch (e) {
      console.error('Failed to read storage', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={onboarded ? 'Main' : 'Welcome'}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }),
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="NameAssistant" component={NameAssistantScreen} />
        <Stack.Screen name="WakeWord" component={WakeWordScreen} />
        <Stack.Screen name="AboutYou" component={AboutYouScreen} />
        <Stack.Screen name="ApiKeys" component={ApiKeysScreen} />
        <Stack.Screen name="Vehicles" component={VehiclesScreen} />
        <Stack.Screen name="Ready" component={ReadyScreen} />
        <Stack.Screen name="Main" component={WelcomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
