import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YourPolls from './YourPolls'
import CreatePoll from './CreatePoll'

const Stack = createNativeStackNavigator();

export default function PollTab () {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name='YourPolls' component={YourPolls} />
            <Stack.Screen name='CreatePoll' component={CreatePoll} />
        </Stack.Navigator>
    )
}