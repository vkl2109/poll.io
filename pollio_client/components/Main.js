import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './Feed'
import YourPolls from './YourPolls'
import CreatePoll from './CreatePoll'
import Profile from './Profile'

const Tab = createBottomTabNavigator();

export default function Main () {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Feed" component={Feed} />
            <Tab.Screen name="YourPolls" component={YourPolls} />
            <Tab.Screen name="CreatePoll" component={CreatePoll} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}