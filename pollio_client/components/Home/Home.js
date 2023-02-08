import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Feed from './Feed'
import ViewPoll from './ViewPoll'

const Stack = createNativeStackNavigator();

export default function Home () {
    return(
        <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
            <Stack.Screen name='Feed' component={Feed} />
            <Stack.Screen name='ViewPoll' component={ViewPoll} />
        </Stack.Navigator>
    )
}