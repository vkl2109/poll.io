import React, { useState, useEffect, useCallback  } from 'react'
import { StyleSheet, ScrollView, View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { Button, Dialog, Icon, Avatar } from '@rneui/themed';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as SecureStore from 'expo-secure-store';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { login as userLogin } from '../redux/reducers/userReducer'
import { uploadAvatar, deleteAvatar } from '../redux/reducers/avatarReducer'

const screenWidth = Dimensions.get('window').width; 

export default function Signup ({ navigation }) {
    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ hide, setHide ] = useState(true)
    const [ hide2, setHide2 ] = useState(true)
    const [ errorMsg, setErrorMsg ] = useState('')
    const [ errorDialog, setErrorDialog ] = useState(false)
    const [ base64Image, setBase64Image ] = useState('')
    const [ avatarImg, setAvatarImg ] = useState(null)
    const [ status, requestPermission ] = MediaLibrary.usePermissions();
    const [ viewMenu, setViewMenu ] = useState(false);
    const [ deleteView, setDeleteView ] = useState(false);
    const [ loading, setLoading ] = useState(true)
    const dispatch = useDispatch();
    const currentAvatar = useSelector((state) => state.avatar)

    useEffect(() => {
        setLoading(false)
        // if (currentAvatar != '') {
        //     const img = "data:image/jpeg;base64," + currentAvatar
        //     setAvatarImg(img);
        // }
        // else {
        //     setAvatarImg(null)
        // }
        if (status === null) {
            requestPermission();
        }
        setLoading(true)
    }, []);

    // useFocusEffect(
    //     useCallback(() => {
    //         setLoading(false)
    //         if (currentAvatar != '') {
    //             const img = "data:image/jpeg;base64," + currentAvatar
    //             setAvatarImg(img);
    //         }
    //         else {
    //             setAvatarImg(null)
    //         }
    //         setLoading(true)
    //     }, [])
    // );

    const login = async () => {
        let req = await fetch("http://10.129.2.90:5000/login", {
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
            dispatch(userLogin(res.user.username))
            await SecureStore.setItemAsync('token', res.token);
            navigation.navigate('Main')
        }
        else {
            setErrorDialog(true)
            setErrorMsg(res.error)
        }
    }

    const handleSignUp = () => {
        const signup = async () => {
            let req = await fetch("http://10.129.2.90:5000/signup", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    avatarBase64: base64Image,
                })
            })
            let res = await req.json()
            if (req.ok) {
                setErrorMsg('')
                setUsername('')
                setPassword('')
                setConfirmPassword('')
                login()
            }
            else {
                setErrorDialog(true)
                setErrorMsg(res.error)
            }
        }
        if (password == confirmPassword) {
            signup()
        }
        else {
            setErrorDialog(true)
            setErrorMsg(`passwords don't match`)
        }
        // navigation.navigate('Main') // temporary
    }

    const handleCamera = () => {
        setViewMenu(false)
        navigation.navigate('SignupCamera')
    }

    const handleX = async () => {
        setLoading(false)
        setAvatarImg(null)
        setBase64Image('')
        setLoading(true)
        setViewMenu(false)
        setDeleteView(false)
    }

    const toggleDeleteView = () => {
        setViewMenu(viewMenu => !viewMenu)
        setDeleteView(deleteView => !deleteView)
    }

    const toggleErrorDialog = () => {
        setErrorDialog(false)
        setErrorMsg('')
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
            setBase64Image(base64)
            const img = "data:image/jpeg;base64," + base64
            setAvatarImg(img);
            setViewMenu(false)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}>
                <KeyboardAwareScrollView contentContainerStyle={styles.containerTop}>
                <View style={styles.backBtn}>
                    <Button
                        title={""}
                        buttonStyle={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 30,
                            paddingTop: 6,
                            height: 100,
                            width: 100,
                        }}
                        containerStyle={{
                            width: 100,
                            height: 100,
                            marginHorizontal: 10,
                            alignSelf: 'center'
                        }}
                        titleStyle={{ fontWeight: 'bold' }}
                        onPress={() => navigation.navigate('Login')}
                        icon={<Icon name="arrow-left" size={80} color="white" />}
                        iconRight
                        />
                </View>
                <View style={styles.container}>
                    {avatarImg ? 
                    <Avatar
                        size={150}
                        rounded
                        source={{uri : avatarImg}}                       
                        containerStyle={{backgroundColor: '#228b22'}}
                        >
                        <Avatar.Accessory size={40} onPress={() => setViewMenu(true)}/>
                    </Avatar>
                    :
                    <Avatar
                        size={150}
                        rounded
                        source={null}
                        icon={{ name: 'user', type: 'font-awesome' }}                    
                        iconStyle={{backgroundColor: '#228b22', height: 150, width: 150, justifyContent: 'center'}}
                        >
                        <Avatar.Accessory size={40} onPress={() => setViewMenu(true)}/>
                    </Avatar>}
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
                            <Dialog.Title style={styles.dialogTitle} title={"Choose Avatar?"} />
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
                        {/* {chooseAvatar && 
                        <>
                            {avatar ? 
                            <View style={styles.avatarContainer}>
                                <View style={styles.buttonContainer}> 
                                    {library ? 
                                    <Button
                                        title={""}
                                        buttonStyle={{
                                            backgroundColor: '#FFA500',
                                            borderColor: 'transparent',
                                            borderWidth: 0,
                                            borderRadius: 30,
                                            paddingTop: 6,
                                            height: 40,
                                            width: 40
                                        }}
                                        containerStyle={{
                                            width: 40,
                                            height: 40,
                                            marginHorizontal: 30,
                                            marginVertical: 10,
                                        }}
                                        titleStyle={{ fontWeight: 'bold' }}
                                        onPress={() => pickImage()}
                                        icon={<Icon name="photo" size={20} color="white" />}
                                        />
                                    :
                                    <Button
                                        title={""}
                                        buttonStyle={{
                                            backgroundColor: '#FFA500',
                                            borderColor: 'transparent',
                                            borderWidth: 0,
                                            borderRadius: 30,
                                            paddingTop: 6,
                                            height: 40,
                                            width: 40
                                        }}
                                        containerStyle={{
                                            width: 40,
                                            height: 40,
                                            marginHorizontal: 30,
                                            marginVertical: 10,
                                        }}
                                        titleStyle={{ fontWeight: 'bold' }}
                                        onPress={() => setAvatar()}
                                        icon={<Icon name="camera-alt" size={20} color="white" />}
                                        />}
                                    <Button
                                        title={""}
                                        buttonStyle={{
                                            backgroundColor: '#FFA500',
                                            borderColor: 'transparent',
                                            borderWidth: 0,
                                            borderRadius: 30,
                                            paddingTop: 6,
                                            height: 40,
                                            width: 40
                                        }}
                                        containerStyle={{
                                            width: 40,
                                            height: 40,
                                            marginHorizontal: 30,
                                            marginVertical: 10,
                                        }}
                                        titleStyle={{ fontWeight: 'bold' }}
                                        onPress={() => onSaveImageAsync()}
                                        icon={<Icon name="save" size={20} color="white" />}
                                        iconRight
                                        />
                                </View>
                                <View ref={imageRef} collapsable={false}>
                                    <Image source={{ uri: avatar }} style={styles.image} />
                                </View>
                            </View>
                            :
                            <View style={styles.avatarContainer}>
                                <Button
                                title={""}
                                buttonStyle={{
                                    backgroundColor: '#FFA500',
                                    borderColor: 'transparent',
                                    borderWidth: 0,
                                    borderRadius: 30,
                                    paddingTop: 6,
                                    height: 40,
                                    width: 40
                                }}
                                containerStyle={{
                                    width: 40,
                                    height: 40,
                                    marginHorizontal: 50,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => takePicture()}
                                icon={<Icon name="camera" size={20} color="white" />}
                                />
                                <View style={styles.cameraContainer}>
                                    <Camera
                                        ref={ref => setCamera(ref)}
                                        style={styles.fixedRatio}
                                        type={Camera.Constants.Type.front}
                                        ratio={'1:1'} />
                                </View>
                            </View>}
                        </>}
                        {chooseAvatar ? 
                        <Button
                            title={""}
                            buttonStyle={{
                                backgroundColor: '#FFA500',
                                borderColor: 'transparent',
                                borderWidth: 0,
                                borderRadius: 30,
                                width: 40,
                                height: 40,
                            }}
                            containerStyle={{
                                width: 40,
                                height: 40,
                                marginHorizontal: 50,
                                marginVertical: 10,
                            }}
                            onPress={() => toggleClose()}
                            icon={<Icon name="arrow-circle-up" size={20} color="white" />}
                            />
                        : <View style={styles.buttonContainer}> 
                            <Button
                                title={""}
                                buttonStyle={{
                                    backgroundColor: '#FFA500',
                                    borderColor: 'transparent',
                                    borderWidth: 0,
                                    borderRadius: 30,
                                    width: 40,
                                    height: 40,
                                }}
                                containerStyle={{
                                    width: 40,
                                    height: 40,
                                    marginHorizontal: 20,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => toggleCamera()}
                                icon={<Icon name="camera-alt" size={20} color="white" />}
                                />
                            <Button
                                title={""}
                                buttonStyle={{
                                    backgroundColor: '#FFA500',
                                    borderColor: 'transparent',
                                    borderWidth: 0,
                                    borderRadius: 30,
                                    width: 40,
                                    height: 40,
                                }}
                                containerStyle={{
                                    width: 40,
                                    height: 40,
                                    marginHorizontal: 20,
                                    marginVertical: 10,
                                }}
                                titleStyle={{ fontWeight: 'bold' }}
                                onPress={() => pickImage()}
                                icon={<Icon name="photo" size={20} color="white" />}
                                />
                        </View>} */}
                        <Button
                            title={"SIGN UP"}
                            buttonStyle={{
                                backgroundColor: '#369F8E',
                                borderWidth: 0,
                                borderColor: 'white',
                                borderRadius: 30,
                                height: 60,
                            }}
                            containerStyle={{
                                width: 200,
                                marginHorizontal: 50,
                                marginVertical: 30,
                            }}
                            titleStyle={{ fontWeight: 'bold', fontSize: 22 }}
                            onPress={() => handleSignUp()}
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
        justifyContent: 'top',
        width: screenWidth
        // alignSelf:'stretch'
    },
    containerTop: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#ADD8E6', // '#25292e'
        alignItems: 'center',
        justifyContent: 'top',
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
    backBtn: {
        alignSelf: 'left',
        margin: 0,
    },
    image: {
        height: 200,
        width: 200,
        alignSelf: 'center'
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
    buttonContainer: {
        flexDirection: 'row',
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
    dialogTitle: {
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    }
})