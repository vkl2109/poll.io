import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, Animated, RefreshControl, StyleSheet, ScrollView, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import Poll from '../Poll'
import { useFocusEffect } from '@react-navigation/native';

export default function Feed ({ navigation }) {
    const [ allPolls, setAllPolls ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ refreshing, setRefreshing ] = useState(false);

    const getAllPolls = async () => {
            setRefreshing(true)
            let req = await fetch(`${process.env.SERVER_URL}/yourfriendpolls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
            if (req.ok) {
                let res = await req.json()
                setAllPolls(res)
                setIsLoading(false)
            }
            else {
                console.log(req.error)
            }
            setRefreshing(false)
        }
    useEffect(()=>{
        getAllPolls()
    },[])

    useFocusEffect(
        useCallback(() => {
            getAllPolls()
        }, [])
    );

    const screenWidth = Dimensions.get('window').width; 

    const handleViewPoll = (pollData) => {
        navigation.navigate('ViewPoll', { pollData: pollData })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}} 
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getAllPolls} />
                }>
                {isLoading ? <ActivityIndicator size="large" /> :
                <>{allPolls.length == 0 ? <Text style={styles.nopolls}>No Polls Yet!</Text> :
                (allPolls.map((examplePoll, i) => {
                    return(
                        <TouchableOpacity key={examplePoll.poll.id} onPress={()=>handleViewPoll(examplePoll)} style={styles.wrapper}>
                            <Poll index={i} user={examplePoll.user} pollData={examplePoll.poll}/>
                        </TouchableOpacity>
                    )}   
                ))}
                </>}
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
  },
  nopolls: {
    fontSize: 25,
    margin: 10,
  },
});