import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YourPollStats from './YourPollStats'
import Response from './Response'
import * as SecureStore from 'expo-secure-store';

export default function ViewPoll ({ navigation, route }) {
    const [ responses, setResponses ] = useState([])
    const [ option1T, setOption1T ] = useState(0)
    const [ option2T, setOption2T ] = useState(0)
    const screenWidth = Dimensions.get('window').width; 
    const { pollData } = route.params;
    
    const getResponses = async () => {
        let req = await fetch(`http://10.129.2.90:5000/getresponses/${pollData.poll.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        let res = await req.json()
        if (req.ok) {
            setResponses(res.responses)
            setOption1T(res.option1Tally)
            setOption2T(res.option2Tally)
        }
        else {
            console.log(res.error)
        }
    }

    useEffect(() => {
      getResponses()
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: screenWidth}}>
                <YourPollStats user={pollData.user} pollData={pollData.poll} option1T={option1T} option2T={option2T}/>
                {responses.map((response, i) => {
                  return(
                    <Response key={i} index={i} poll = {pollData.poll} response={response}/>
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