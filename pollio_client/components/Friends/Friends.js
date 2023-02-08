import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Text, View, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
const screenWidth = Dimensions.get('window').width; 

export default function Friends ({ navigation }) {
    const [ yourFriends, setYourFriends ] = useState([])
    const [ yourRequests, setYourRequests ] = useState([])
    const [ receivedRequests, setReceivedRequests ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ refreshing, setRefreshing ] = useState(false);

    const getYourFriends = async () => {
        setRefreshing(true)
        let req = await fetch('http://10.129.2.90:5000/yourfriends', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        if (req.ok) {
            let res = await req.json()
            setYourFriends(res.friends)
            setYourRequests(res.friendrequests)
            setReceivedRequests(res.receivedrequests)
            setIsLoading(false)
        }
        setRefreshing(false)
    }

    useEffect(()=>{
        getYourFriends()
    },[])

    useFocusEffect(
        useCallback(() => {
            getYourFriends()
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}
            refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getYourFriends} />
                }>
                <TouchableOpacity style={styles.findFriendsBtn} onPress={() => navigation.navigate('FindFriends')}>
                    <Text style={{fontSize: 25}}>Find Friends!</Text>
                </TouchableOpacity>
                <Text style={styles.listTitle}>Your Friends:</Text>
                {isLoading ? <ActivityIndicator size="large" /> : 
                <>{yourFriends.length == 0 ? <Text style={styles.nopolls}>No Friends Yet!</Text> :
                (yourFriends.map(friend => {
                    return(
                        <View>
                            {friend.username}
                        </View>
                    )
                })
                )}
                </>}
                <Text style={styles.listTitle}>Sent Requests:</Text>
                {isLoading ? <ActivityIndicator size="large" /> : 
                <>{yourRequests.length == 0 ? <Text style={styles.nopolls}>No Requests Sent!</Text> :
                (yourRequests.map(request => {
                    return(
                        <View>
                            {request.recipient}
                        </View>
                    )
                })
                )}
                </>}
                <Text style={styles.listTitle}>Pending Requests:</Text>
                {isLoading ? <ActivityIndicator size="large" /> : 
                <>{receivedRequests.length == 0 ? <Text style={styles.nopolls}>No Requests Received!</Text> :
                (receivedRequests.map(received => {
                    return(
                        <View>
                            {received.recipient}
                        </View>
                    )
                })
                )}
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
  nopolls: {
    fontSize: 25,
    margin: 10,
  },
  listTitle: {
    fontWeight: 'bold', 
    fontSize: 30, 
    alignSelf: 'left', 
    margin: 20
  },
  findFriendsBtn: {
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
});