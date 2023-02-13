import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux'
import { store } from './redux/store'

import Login from './components/Login-Signup/Login';
import Signup from './components/Login-Signup/Signup';
import SignupCamera from './components/Login-Signup/SignupCamera';
import Main from './components/Main';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
              <Stack.Screen name='Login' component={Login} />
              <Stack.Screen name='Signup' component={Signup} />
              <Stack.Screen name='SignupCamera' component={SignupCamera} />
              <Stack.Screen name='Main' component={Main} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
