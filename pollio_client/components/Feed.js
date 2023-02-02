import { StyleSheet, ScrollView, View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Poll from './Poll'

const examplePolls = [{
    "id": 0,
    "user" : {
        "avatarBase64" : "",
        "username": "Larson"
    },
    "poll" : {
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
    "id": 1,
    "user" : {
        "avatarBase64" : "",
        "username": "serrin"
    },
    "poll" : {
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
    "id": 2,
    "user" : {
        "avatarBase64" : "",
        "username": "michael"
    },
    "poll" : {
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

const exampleUser = {
    "avatarBase64" : "",
    "username" : "vincent"
}

const examplePollData = {
    "question" : "What do I eat today?",
    "option1" : "pizza",
    "option2" : "pasta"
}

export default function Feed () {
    const screenWidth = Dimensions.get('window').width; 

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}>
                {examplePolls.map(examplePoll => {
                    return(
                        <Poll key={examplePoll.id} user={examplePoll.user} pollData={examplePoll.poll}/>
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
});