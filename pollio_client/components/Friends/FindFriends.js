import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, StyleSheet, ScrollView, Text, View, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Button, Dialog, Icon } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
const screenWidth = Dimensions.get('window').width; 

export default function FindFriends ({ navigation }) {
    const [ allUsers, setAllUsers ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ refreshing, setRefreshing ] = useState(false);

    const getAllUsers = async () => {
        setRefreshing(true)
        // let req = await fetch('http://10.129.2.90:5000/allfriends', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
        //     }
        // })
        // if (req.ok) {
        //     let res = await req.json()
        //     setAllUsers(res)
        //     setIsLoading(false)
        // }
        setRefreshing(false)
    }

    useEffect(()=>{
        getAllUsers()
    },[])

    useFocusEffect(
        useCallback(() => {
            getAllUsers()
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}
            refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getAllUsers} />
                }>
                <View style={{alignSelf: 'left', margin: 0}}>
                    <Button
                        buttonStyle={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                            height: 80,
                            width: 80,
                        }}
                        containerStyle={{
                            width: 80,
                            height: 80,
                            alignSelf: 'center'
                        }}
                        onPress={() => navigation.navigate('Friends')}
                        icon={<Icon name="arrow-left" size={80} color="white" />}
                        iconRight
                        />
                </View>
                <Text style={styles.listTitle}>Find Friends:</Text>
                {isLoading ? <ActivityIndicator size="large" /> : 
                <>{allUsers.length == 0 ? <Text style={styles.nopolls}>No Users!</Text> :
                (allUsers.map(user => {
                    return(
                        <View>
                            {user.username}
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
    marginBottom: 20,
    marginHorizontal: 20
  }
});