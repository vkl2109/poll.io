import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, ScrollView, Text, View, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
const screenWidth = Dimensions.get('window').width; 

export default function Friends ({ navigation }) {
    const [ allUsers, setAllUsers ] = useState([])
    const [ yourRequests, setYourRequests ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ refreshing, setRefreshing ] = useState(false);

    const getAllFriends = async () => {
        setRefreshing(true)
        // let req = await fetch('http://10.129.2.90:5000/yourfriends', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
        //     }
        // })
        // if (req.ok) {
        //     let res = await req.json()
        //     setAllUsers(res.users)
        //     setYourRequests(res.friendrequests)
        //     setIsLoading(false)
        // }
        setRefreshing(false)
    }

    useEffect(()=>{
        getAllFriends()
    },[])

    useFocusEffect(
        useCallback(() => {
            getAllFriends()
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}
            refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getAllFriends} />
                }>
                <Text style={styles.listTitle}>Find Friends:</Text>
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
  nopolls: {
    fontSize: 25,
    margin: 10,
  },
  listTitle: {
    fontWeight: 'bold', 
    fontSize: 30, 
    alignSelf: 'left', 
    margin: 20
  }
});