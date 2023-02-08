import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Friends from './Friends'
import FindFriends from './FindFriends'

const Stack = createNativeStackNavigator();

export default function PollTab () {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name='Friends' component={Friends} />
            <Stack.Screen name='FindFriends' component={FindFriends} />
        </Stack.Navigator>
    )
}