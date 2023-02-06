import React, { useState, useEffect } from 'react'
import { RefreshControl, StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Avatar } from '@rneui/themed';
const screenWidth = Dimensions.get('window').width; 
import * as SecureStore from 'expo-secure-store';

export default function Profile () {
    const [ profile, setProfile ] = useState()
    const [ loading, setLoading ] = useState(true)
    const [ avatarImg, setAvatarImg ] = useState(null)
    const [ refreshing, setRefreshing ] = useState(false);

    
    const getProfile = async () => {
        setRefreshing(true)
        let req = await fetch(`http://192.168.1.210:5000/autologin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        let res = await req.json()
        if (req.ok) {
            setProfile(res)
            console.log(res)
            // if (res.avatarBase64 != '') {
            //     let img = "data:image/jpeg;base64," + avatarBase64
            //     setAvatarImg(img)
            // }
            setLoading(false)
        }
        else {
            console.log(res.error)
        }
        setRefreshing(false)
    }

    useEffect(() => {
        getProfile()
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}
            refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={getProfile} />
                }>
                {loading ? 
                <View> 
                    <Text>Loading</Text>
                </View>
                :
                <View style={styles.feed}>
                    {avatarImg ? 
                    <Avatar
                        size={150}
                        rounded
                        source={avatarImg}
                        containerStyle={{ margin: 10 }}
                        /> 
                    :
                    <Avatar
                        size={150}
                        rounded
                        title={profile.username[0]}
                        containerStyle={{ backgroundColor: '#228b22', margin: 10, textAlign: 'center' }}
                        />}
                    <Text>{profile.username}</Text>
                </View>}
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
  feed: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#ADD8E6', // '#25292e'
    alignItems: 'center',
    justifyContent: 'top',
  },
});