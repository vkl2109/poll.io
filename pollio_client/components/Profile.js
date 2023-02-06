import React, { useState, useEffect } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Avatar, Dialog } from '@rneui/themed';
const screenWidth = Dimensions.get('window').width; 
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { useDispatch } from 'react-redux';
import { logout as userLogout } from '../redux/reducers/userReducer'

export default function Profile ({ navigation }) {
    const [ profile, setProfile ] = useState()
    const [ loading, setLoading ] = useState(true)
    const [ avatarImg, setAvatarImg ] = useState(null)
    const [ refreshing, setRefreshing ] = useState(false);
    const [ viewMenu, setViewMenu ] = useState(false);
    const dispatch = useDispatch();

    const getProfile = async () => {
        setLoading(true)
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
            // console.log(res)
            if (res.avatarBase64 != '') {
                let img = "data:image/jpeg;base64," + res.avatarBase64
                setAvatarImg(img)
            }
            else {
                setAvatarImg(null)
            }
        }
        else {
            console.log(res.error)
        }
        setLoading(false)
        setRefreshing(false)
    }

    const updateUser = async (base64) => {
        let req = await fetch('http://192.168.1.210:5000/profile', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            },
            body: JSON.stringify({
                avatarBase64: base64,
            })
        })
        if (req.ok) {
            setViewMenu(false)
        }
    }

    const handleCamera = () => {
        setViewMenu(false)
        navigation.navigate('ProfileCamera')
    }

    const pickImage = async () => {
    // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: 'base64' });
            await updateUser(base64)
            const img = "data:image/jpeg;base64," + base64
            setAvatarImg(img)
        }
    };

    const handleX = async () => {
        setLoading(true)
        setAvatarImg(null)
        await updateUser('')
        setLoading(false)
    }

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token')
        dispatch(userLogout())
        navigation.navigate('Login')
    }

    useEffect(() => {
        getProfile()
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}
            refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => getProfile()} />
                }>
                {loading ? <ActivityIndicator size="large" /> :
                <View style={styles.feed}>
                    <Dialog
                        isVisible={viewMenu}
                        onBackdropPress={() => setViewMenu(false)}
                        >
                        <Dialog.Title style={styles.dialogTitle} title={"Replace Avatar?"} />
                        <View style={styles.buttonContainer}>
                            <Button
                                title={"Library"}
                                buttonStyle={{
                                    backgroundColor: '#369F8E',
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
                                onPress={() => pickImage()}
                                />
                            <Button
                                title={"X"}
                                buttonStyle={{
                                    backgroundColor: '#369F8E',
                                    borderWidth: 0,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                }}
                                containerStyle={{
                                    width: 40,
                                    marginHorizontal: 5,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => handleX()}
                                />
                            <Button
                                title={"Camera"}
                                buttonStyle={{
                                    backgroundColor: '#369F8E',
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
                                onPress={() => handleCamera()}
                                />
                        </View>
                    </Dialog>
                    <Avatar
                        size={150}
                        rounded
                        title={profile.username[0]}
                        source={avatarImg && {uri : avatarImg }}
                        containerStyle={{ backgroundColor: '#228b22', margin: 10, textAlign: 'center' }}
                        >
                        <Avatar.Accessory size={40} onPress={() => setViewMenu(true)}/>
                    </Avatar>
                    <Text>{profile.username}</Text>
                    <Button
                        title={"LOG OUT"}
                        buttonStyle={{
                            backgroundColor: '#369F8E',
                            borderWidth: 0,
                            borderColor: 'white',
                            borderRadius: 30,
                        }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                        }}
                        titleStyle={{ fontWeight: 'bold' }}
                        onPress={() => handleLogout()}
                        />
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
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialogTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
});