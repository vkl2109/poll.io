import { StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Poll from './Poll'
import Response from './Response'

export default function ViewPoll ({ navigation, route }) {
    const screenWidth = Dimensions.get('window').width; 
    const { pollData } = route.params;
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: screenWidth}}>
                <Poll user={pollData.user} pollData={pollData.poll}/>
                {pollData.responses.map((response, i) => {
                  return(
                    <Response key={i} poll = {pollData.poll} response={response}/>
                  )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#ADD8E6', // '#25292e'
    alignItems: 'center',
    justifyContent: 'center',
  },
});