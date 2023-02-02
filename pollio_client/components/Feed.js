import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Poll from './Poll'

const examplePolls = [{
    "user" : {
        "avatarBase64" : "",
        "username": "Larson"
    },
    "poll" : {
        "id": 0,
        "question" : "What do I eat today?",
        "option1" : "pizza",
        "option2" : "ramen"
    },
    "responses" : [
        {
            "username" : "serrin",
            "response" : "pizza"
        },
        {
            "username" : "cooper",
            "response" : "ramen"
        },
        {
            "username" : "michael",
            "response" : "pizza"
        },
    ]
},
{
    "user" : {
        "avatarBase64" : "",
        "username": "serrin"
    },
    "poll" : {
        "id": 1,
        "question" : "Who is kewler?",
        "option1" : "king k rool",
        "option2" : "piranha plant"
    },
    "responses" : [
        {
            "username" : "larson",
            "response" : "king k rool"
        },
        {
            "username" : "cooper",
            "response" : "piranha plant"
        },
        {
            "username" : "michael",
            "response" : "king k rool"
        },
    ]
},
{
    "user" : {
        "avatarBase64" : "",
        "username": "michael"
    },
    "poll" : {
        "id" : 2,
        "question" : "_ in 5 minutes.",
        "option1" : "Turing",
        "option2" : "Collins"
    },
    "responses" : [
        {
            "username" : "serrin",
            "response" : "Collins"
        },
        {
            "username" : "cooper",
            "response" : "Turing"
        },
        {
            "username" : "larson",
            "response" : "Collins"
        },
    ]
}]

export default function Feed ({ navigation }) {
    const screenWidth = Dimensions.get('window').width; 

    const handleViewPoll = (pollData) => {
        navigation.navigate('ViewPoll', { pollData: pollData })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}>
                {examplePolls.map(examplePoll => {
                    return(
                        <TouchableOpacity key={examplePoll.poll.id} onPress={()=>handleViewPoll(examplePoll)} style={styles.wrapper}>
                            <Poll user={examplePoll.user} pollData={examplePoll.poll}/>
                        </TouchableOpacity>
                    )}   
                )
                }
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
  wrapper: {
    width: '100%',
    alignItems: 'center',
  }
});