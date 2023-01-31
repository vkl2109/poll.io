import React, { useState, useEffect, useRef  } from 'react'
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { Button, Dialog } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as SecureStore from 'expo-secure-store';
import { Camera } from 'expo-camera';

export default function Signup ({ navigation }) {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ hide, setHide ] = useState(true)
    const [ hide2, setHide2 ] = useState(true)
    const [ errorMsg, setErrorMsg ] = useState('')
    const [ errorDialog, setErrorDialog ] = useState(false)
    const [ hasCameraPermission, setHasCameraPermission ] = useState(null);
    const [ camera, setCamera ] = useState(null);
    const [ base64Image, setBase64Image ] = useState(null)
    const [ avatar, setAvatar ] = useState()

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            if (hasCameraPermission === false) {
                alert("No Access to Camera");
            }
        })();
    }, []);

    const handleSignUp = () => {
        const signup = async () => {
            let req = await fetch("http://10.129.2.90:5000/signup", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            })
            let res = await req.json()
            if (req.ok) {
                setErrorMsg('')
                await SecureStore.setItemAsync('token', res.token);
                navigation.navigate('Main')
            }
            else {
                setErrorDialog(true)
                setErrorMsg(res.error)
            }
        }
        if (password == confirmPassword) {
            // signup()
        }
        else {
            setErrorDialog(true)
            setErrorMsg(`passwords don't match`)
        }
        // navigation.navigate('Main') // temporary
    }

    const toggleErrorDialog = () => {
        setErrorDialog(false)
        setErrorMsg('')
    }

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null)
            const base64 = await FileSystem.readAsStringAsync(data.uri, { encoding: 'base64' });
            setBase64Image(base64)
            const img = "data:image/jpeg;base64," + base64
            setAvatar(img);
            // console.log(base64)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
                <KeyboardAwareScrollView>
                <View style={styles.container}>
                        <Dialog
                            isVisible={errorDialog}
                            onBackdropPress={toggleErrorDialog}
                            >
                            <Dialog.Title style={styles.dialogTitle} title={"Sign Up Error"} />
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
                        <TextInput
                            mode="outlined"
                            label="confirm password"
                            value={confirmPassword}
                            onChangeText={confirmPassword => setConfirmPassword(confirmPassword)}
                            style={styles.textInput}
                            secureTextEntry={hide2}
                            right={<TextInput.Icon icon="eye" onPress={() => setHide2(hide2 => !hide2)} style={{ justifyContent: 'center'}}/>}
                            />
                        {avatar ? 
                        <View style={styles.avatarContainer}>
                            {/* <View ref={imageRef} collapsable={false}>
                                <Image source={{ uri: avatar }} style={styles.image} />
                            </View> */}
                        </View>
                        :
                        <View style={styles.avatarContainer}>
                            <Button
                            title={"+"}
                            buttonStyle={{
                                backgroundColor: '#FFA500',
                                borderColor: 'transparent',
                                borderWidth: 0,
                                borderRadius: 30,
                                paddingTop: 6
                            }}
                            containerStyle={{
                                width: 40,
                                height: 40,
                                marginHorizontal: 50,
                                marginVertical: 10,
                            }}
                            titleStyle={{ fontWeight: 'bold' }}
                            onPress={() => takePicture()}
                            />
                            <View style={styles.cameraContainer}>
                                <Camera
                                    ref={ref => setCamera(ref)}
                                    style={styles.fixedRatio}
                                    type={Camera.Constants.Type.front}
                                    ratio={'1:1'} />
                            </View>
                        </View>}
                        <Button
                            title={"SIGN UP"}
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
                            onPress={() => handleSignUp()}
                            />
                        <Button
                            title={"back to login"}
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
                            onPress={() => navigation.navigate('Login')}
                            />
                </View>
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
        // alignSelf:'stretch'
    },
    cameraContainer: {
        height: 200,
        width: 200,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    logo: {
        width: 300,
        height: 120,
        marginTop: 60
    },
    avatarContainer: {
        alignItems: 'center',
        justifyContent: 'center',
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
        flex: 3 / 4,
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