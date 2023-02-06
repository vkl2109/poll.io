import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YourPoll from './YourPoll'
import * as SecureStore from 'expo-secure-store';
const screenWidth = Dimensions.get('window').width; 
import { useFocusEffect } from '@react-navigation/native';
import YourPollStats from './YourPollStats'
import Response from './Response'

export default function YourPolls ({ navigation }) {
    const [ yourPolls, setYourPolls ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ refreshing, setRefreshing ] = useState(false);
    const [ visible, setVisible ] = useState(false)

    const getYourPolls = async () => {
        setRefreshing(true)
        let req = await fetch('http://192.168.1.210:5000/yourpolls', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        if (req.ok) {
            let res = await req.json()
            setYourPolls(res)
            setIsLoading(false)
        }
        setRefreshing(false)
    }

    useEffect(()=>{
        getYourPolls()
    },[])

    useFocusEffect(
        useCallback(() => {
            getYourPolls()
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getYourPolls} />
                }>
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreatePoll')}>
                    <Text style={styles.createText}>Create a Poll!</Text>
                </TouchableOpacity>
                {isLoading ? <ActivityIndicator size="large" /> :
                (yourPolls.map((poll, i) => {
                    return(
                        <View key={i} style={styles.wrapper}>
                            <TouchableOpacity onPress={()=>setVisible(visible=>!visible)} style={styles.wrapper}>
                                <YourPollStats option1T={poll.option1Tally} option2T={poll.option2Tally} user={poll.user} pollData={poll.poll}/>
                            </TouchableOpacity>
                            {visible && (poll.responses.map((response, j)  => {
                                return (
                                    <Response key={j} index={j} poll={poll.poll} response={response}/>
                                )
                            }))}
                        </View>
                    )}   
                ))}
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
  createButton: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    border: 1,
    borderWidth: 1,
    height: screenWidth * 0.2,
    borderColor: 'black',
  },
  createText: {
    fontSize: 25
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
  }
});