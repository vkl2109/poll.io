import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Profile from './Profile'
import ProfileCamera from './ProfileCamera'

const Stack = createNativeStackNavigator();

export default function PollTab () {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: true }}>
            <Stack.Screen name='ProfileMain' component={Profile} />
            <Stack.Screen name='ProfileCamera' component={ProfileCamera} />
        </Stack.Navigator>
    )
}