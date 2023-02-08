import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home/Home'
import PollTab from './Polls/PollTab'
import Friends from './Friends'
import ProfileTab from './Profile/ProfileTab'
import { Icon } from '@rneui/themed';


const Tab = createBottomTabNavigator();

export default function Main () {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: '#ADD8E6', }} >
            <Tab.Screen name="Home" component={Home} 
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Polls" component={PollTab} 
                options={{
                    tabBarLabel: 'Polls',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="poll" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Friends" component={Friends}
                options={{
                    tabBarLabel: 'Friends',
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="people" color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen name="Profile" component={ProfileTab}
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