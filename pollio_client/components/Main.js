import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from './Feed'
import YourPolls from './YourPolls'
import CreatePoll from './CreatePoll'
import Profile from './Profile'
import { Icon } from '@rneui/themed';


const Tab = createBottomTabNavigator();

export default function Main () {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#ADD8E6', }} >
            <Tab.Screen name="Feed" component={Feed} 
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="YourPolls" component={YourPolls} 
                options={{
                    tabBarLabel: 'Polls',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="poll" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="CreatePoll" component={CreatePoll}
                options={{
                    tabBarLabel: 'Create',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="add-circle-outline" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="account-circle" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}