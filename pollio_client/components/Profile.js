import React, { useState, useEffect, useCallback } from 'react'
import { ActivityIndicator, RefreshControl, StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Avatar, Dialog } from '@rneui/themed';
import { TextInput } from 'react-native-paper';
const screenWidth = Dimensions.get('window').width; 
import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useFocusEffect } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { logout as userLogout } from '../redux/reducers/userReducer'

export default function Profile ({ navigation }) {
    const [ profile, setProfile ] = useState()
    const [ loading, setLoading ] = useState(true)
    const [ hide, setHide ] = useState(true)
    const [ newUsername, setNewUsername ] = useState('')
    const [ newPassword, setNewPassword ] = useState('')
    const [ avatarImg, setAvatarImg ] = useState(null)
    const [ refreshing, setRefreshing ] = useState(false);
    const [ viewMenu, setViewMenu ] = useState(false);
    const [ deleteView, setDeleteView ] = useState(false);
    const [ errorMsg, setErrorMsg ] = useState('')
    const [ errorDialog, setErrorDialog ] = useState(false)
    const dispatch = useDispatch();

    const getProfile = async () => {
        setLoading(true)
        setRefreshing(true)
        let req = await fetch(`http://10.129.2.90:5000/autologin`, {
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
        let req = await fetch('http://10.129.2.90:5000/profile', {
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

    const changeUsername = async () => {
        if (newUsername == '') {
            setErrorMsg("Username can't be blank!")
            setErrorDialog(true)
            return
        }
        let req = await fetch('http://10.129.2.90:5000/profile', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            },
            body: JSON.stringify({
                username: newUsername,
            })
        })
        if (req.ok) {
            setNewUsername('')
            getProfile()
        }
        else {
            let res = await req.json()
            setErrorMsg(res.error)
            setErrorDialog(true)
        }
    }

    const changePassword = async () => {
        if (newPassword == '') {
            setErrorMsg("Password can't be blank!")
            setErrorDialog(true)
            return
        }
        let req = await fetch('http://10.129.2.90:5000/profile', {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            },
            body: JSON.stringify({
                password: newPassword,
            })
        })
        if (req.ok) {
            setNewPassword('')
            getProfile()
        }
        else {
            let res = await req.json()
            setErrorMsg(res.error)
            setErrorDialog(true)
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
            setViewMenu(false)
        }
    };

    const handleX = async () => {
        setLoading(true)
        setAvatarImg(null)
        await updateUser('')
        setDeleteView(false)
        setLoading(false)
    }

    const toggleDeleteView = () => {
        setViewMenu(viewMenu => !viewMenu)
        setDeleteView(deleteView => !deleteView)
    }

    const handleLogout = async () => {
        await SecureStore.deleteItemAsync('token')
        dispatch(userLogout())
        navigation.navigate('Login')
    }

    const toggleErrorDialog = () => {
        setErrorDialog(false)
        setErrorMsg('')
    }

    useEffect(() => {
        getProfile()
    },[])

    useFocusEffect(
        useCallback(() => {
            getProfile()
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: screenWidth}}
            refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => getProfile()} />
                }>
                <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                {loading ? <ActivityIndicator size="large" /> :
                <View style={styles.feed}>
                    <Dialog
                        isVisible={errorDialog}
                        onBackdropPress={toggleErrorDialog}
                        >
                        <Dialog.Title style={styles.dialogTitle} title={"Error"} />
                        <Text style={styles.dialogText}>{errorMsg}</Text>
                    </Dialog>
                    <Dialog
                        isVisible={deleteView}
                        onBackdropPress={() => toggleDeleteView()}
                        >
                        <Dialog.Title style={styles.dialogTitle} title={"Delete Avatar?"} />
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
                                onPress={() => handleX()}
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
                                onPress={() => toggleDeleteView()}
                                />
                        </View> 
                    </Dialog>
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
                                    backgroundColor: 'red',
                                    borderWidth: 0,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                }}
                                containerStyle={{
                                    height: 40,
                                    width: 40,
                                    marginHorizontal: 5,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => toggleDeleteView()}
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
                    <Text style={styles.username}>Hello, {profile.username}</Text>
                    <TextInput
                        mode="outlined"
                        label="new username"
                        value={newUsername}
                        onChangeText={newUsername => setNewUsername(newUsername)}
                        style={styles.textInput}
                        right={<TextInput.Icon icon="autorenew" onPress={() => changeUsername()} containerStyle={{ justifyContent: 'center'}}/>}
                        />
                    <TextInput
                        mode="outlined"
                        label="new password"
                        value={newPassword}
                        onChangeText={newPassword => setNewPassword(newPassword)}
                        style={styles.textInput}
                        secureTextEntry={true}
                        right={<TextInput.Icon icon="autorenew" onPress={() => changePassword()} containerStyle={{ justifyContent: 'center'}}/>}
                        />
                    <Button
                        title={"LOG OUT"}
                        buttonStyle={{
                            backgroundColor: '#369F8E',
                            borderWidth: 0,
                            borderColor: 'white',
                            borderRadius: 30,
                        }}
                        containerStyle={{
                            height: 80,
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 20,
                        }}
                        titleStyle={{ fontWeight: 'bold', fontSize: 22 }}
                        onPress={() => handleLogout()}
                        />
                </View>}
                </KeyboardAwareScrollView>
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
    username: {
        fontSize: 30,
        margin: 20
    },
    feed: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#ADD8E6', // '#25292e'
        alignItems: 'center',
        justifyContent: 'center',
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
    },
    textInput: {
        height: 40,
        width: 250,
        margin: 12,
        borderWidth: 0,
        padding: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 20,
        shadowColor: '#52006A',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
});