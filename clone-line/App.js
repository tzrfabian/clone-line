import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Navigation from './Navigation';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './config/ApolloClient';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/authContext';



export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <Navigation/>
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}