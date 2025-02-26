import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/Screens/Home';
import Chat from './src/Screens/Chat';

const Stack=createStackNavigator();



const App = () =>{
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{}}>
        <Stack.Screen name="home" component={Home} 
        options={{headerShown:false}} />
        <Stack.Screen name="chat" component={Chat} />
    </Stack.Navigator>
    </NavigationContainer>
  )
}
export default App;