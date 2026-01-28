// ARQUIVO: App.js (na raiz)
import 'react-native-gesture-handler'; // Importante para evitar crash
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './src/routes';

// 🔹 Necessário para o fluxo de login Google com expo-auth-session
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Routes />
    </NavigationContainer>
  );
}