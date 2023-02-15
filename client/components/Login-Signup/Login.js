import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { Button, Dialog } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { login as userLogin } from '../../redux/reducers/userReducer'

export default function Login ({ navigation }) {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ hide, setHide ] = useState(true)
    const [ errorMsg, setErrorMsg ] = useState('')
    const [ errorDialog, setErrorDialog ] = useState(false)
    const dispatch = useDispatch();
    const logoUrl = require('./images/pollmate_logo.png')

    const handleLogin = () => {
        const login = async () => {
            let req = await fetch(`${process.env.SERVER_URL}/login`, {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            let res = await req.json()
            if (req.ok) {
                dispatch(userLogin(res.user.username))
                setErrorMsg('')
                await SecureStore.setItemAsync('token', res.token);
                navigation.navigate('Main')
                setUsername('')
                setPassword('')
            }
            else {
                setErrorDialog(true)
                setErrorMsg(res.error)
            }
        }
        login()
        // navigation.navigate('Main')
    }

    const toggleErrorDialog = () => {
        setErrorDialog(false)
        setErrorMsg('')
    }

    useEffect(()=>{
        console.log(process.env.SERVER_URL)
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={logoUrl} style={styles.image} ></Image>
                    </View>
                    <View style={styles.loginContainer}>
                        <Dialog
                            isVisible={errorDialog}
                            onBackdropPress={toggleErrorDialog}
                            >
                            <Dialog.Title style={styles.dialogTitle} title={"Log In Error"} />
                            <Text style={styles.dialogText}>{errorMsg}</Text>
                        </Dialog>
                        <TextInput
                            mode="outlined"
                            label="username"
                            value={username}
                            onChangeText={username => setUsername(username)}
                            style={styles.textInput}
                            />
                        <TextInput
                            mode="outlined"
                            label="password"
                            value={password}
                            onChangeText={password => setPassword(password)}
                            style={styles.textInput}
                            secureTextEntry={hide}
                            right={<TextInput.Icon icon="eye" onPress={() => setHide(hide => !hide)} style={{ justifyContent: 'center'}}/>}
                            />
                        <Button
                            title={"LOG IN"}
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
                            onPress={() => handleLogin()}
                            />
                        <Button
                            title={"sign up"}
                            buttonStyle={{
                                backgroundColor: '#FFA500',
                                borderColor: 'transparent',
                                borderWidth: 0,
                                borderRadius: 30,
                            }}
                            containerStyle={{
                                width: 150,
                                height: 50,
                                marginHorizontal: 50,
                                marginVertical: 10,
                            }}
                            titleStyle={{ fontWeight: 'bold' }}
                            onPress={() => navigation.navigate('Signup')}
                            />
                    </View>
                    <View style={styles.imageContainer}>
                        <Image source={{uri: 'https://media.giphy.com/media/BSNYKSeQSzxSw/giphy.gif'}} style={styles.image} ></Image>
                    </View>
                </View>
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
    justifyContent: 'center'
  },
  logo: {
    width: 300,
    height: 120,
    marginTop: 60
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 18,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1 / 4,
  },
  loginContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1 / 2,
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
  }
})