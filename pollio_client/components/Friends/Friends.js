import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, TouchableOpacity, StyleSheet, ScrollView, Text, View, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Avatar, Dialog } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import SentRequest from './SentRequest'
const screenWidth = Dimensions.get('window').width; 

export default function Friends ({ navigation }) {
    const [ yourFriends, setYourFriends ] = useState([])
    const [ yourRequests, setYourRequests ] = useState([])
    const [ receivedRequests, setReceivedRequests ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ refreshing, setRefreshing ] = useState(false);
    const [ visibleRequest, setVisibleRequest ] = useState(false)
    const [ currentSentRequest, setCurrentSentRequest ] = useState('')

    const handleDeleteRequest = async () => {
        let req = await fetch(`http://10.129.2.90:5000/deleterequest/${request.id}`, {
            method: 'DELETE'
        })
        if (req.ok) {
            setVisibleRequest(false)
            alert('Request deleted')
        }
    }

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

    const toggleDeleteView = (r) => {
        setCurrentSentRequest(currentSentRequest => r.recipient)
        setVisibleRequest(true)
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
                <Dialog isVisible={visibleRequest}
                    onBackdropPress={() => setVisibleRequest(false)}
                    >
                        <Dialog.Title title={`Remove ${currentSentRequest} friend request?`}/>
                        <View style={styles.buttonContainer}>
                            <Button
                                title={"Yes"}
                                buttonStyle={{
                                    backgroundColor: 'green',
                                    borderWidth: 0,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                }}
                                containerStyle={{
                                    width: 100,
                                    marginHorizontal: 5,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => handleDeleteRequest()}
                                />
                            <Button
                                title={"No"}
                                buttonStyle={{
                                    backgroundColor: 'red',
                                    borderWidth: 0,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                }}
                                containerStyle={{
                                    width: 100,
                                    marginHorizontal: 5,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => setVisibleRequest(false)}
                                />
                        </View>
                </Dialog>
                <TouchableOpacity style={styles.findFriendsBtn} onPress={() => navigation.navigate('FindFriends')}>
                    <Text style={{fontSize: 25}}>Find Friends!</Text>
                </TouchableOpacity>
                <Text style={styles.listTitle}>Your Friends:</Text>
                {isLoading ? <ActivityIndicator size="large" /> : 
                <>{yourFriends.length == 0 ? 
                <View style={styles.placeholder}>
                    <Text style={styles.nopolls}>No Friends Yet!</Text>
                </View> 
                :
                (yourFriends.map(friend => {
                    return(
                        <Text>
                            {friend.username}
                        </Text>
                    )
                })
                )}
                </>}
                <Text style={styles.listTitle}>Sent Requests:</Text>
                {isLoading ? <ActivityIndicator size="large" /> : 
                <>{yourRequests.length == 0 ? 
                <View style={styles.placeholder}>
                    <Text style={styles.nopolls}>No Requests Sent!</Text>
                </View>
                :
                (yourRequests.map((r, i) => {
                    return(
                        <TouchableOpacity key={i} onPress={() => toggleDeleteView(r)} style={{borderRadius: 10, width: '80%'}}>
                            <SentRequest index={i} request={r} />
                        </TouchableOpacity>
                    )
                })
                )}
                </>}
                <Text style={styles.listTitle}>Pending Requests:</Text>
                {isLoading ? <ActivityIndicator size="large" /> : 
                <>{receivedRequests.length == 0 ? 
                <View style={styles.placeholder}>
                    <Text style={styles.nopolls}>No Requests Received!</Text> 
                </View>
                :
                (receivedRequests.map(received => {
                    return(
                        <View style={styles.request}>
                            <Text style={{fontSize: 20, margin: 10}}>
                                {received.sender} sent a friend request
                            </Text>
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
  placeholder: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'lightgrey',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10
  },
  request: {
    width: '80%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10
  },
  listTitle: {
    fontWeight: 'bold', 
    fontSize: 30, 
    alignSelf: 'left', 
    margin: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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