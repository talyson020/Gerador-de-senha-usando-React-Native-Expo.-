import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../pages/home';
import { Passwords } from '../pages/passwords'; // tela separada

const Stack = createNativeStackNavigator();

export function Routes() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Passwords" component={Passwords} />
    </Stack.Navigator>
  );
}