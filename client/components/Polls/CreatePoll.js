import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet, ScrollView, View, Text, TextInput, Dimensions, RefreshControl,  TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Dialog, Icon, Avatar } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const screenWidth = Dimensions.get('window').width; 

export default function CreatePoll ({ navigation }) {
    const [ question, setQuestion ] = useState('')
    const [ option1, setOption1 ] = useState('')
    const [ option2, setOption2 ] = useState('')
    const [ profile, setProfile ] = useState()
    const [ loading, setLoading ] = useState(true)
    const [ avatarColor, setAvatarColor ] = useState('#228b22')
    const [ usernameColor, setUsernameColor ] = useState('#228b22')
    const [ avatarImg, setAvatarImg ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState('')
    const [ refreshing, setRefreshing ] = useState(false);
    const [ errorDialog, setErrorDialog ] = useState(false)

    const toggleErrorDialog = () => {
        setErrorDialog(false)
        setErrorMsg('')
    }

    useEffect(() => {
        getProfile()
    },[])

    const getProfile = async () => {
        setLoading(true)
        setRefreshing(true)
        let req = await fetch(`${process.env.SERVER_URL}/autologin`, {
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

    const postPoll = async () => {
        let newQuestion = question
        if (newQuestion[newQuestion.length - 1] != '?') {
            if (newQuestion[newQuestion.length - 1] == '!' || newQuestion[newQuestion.length - 1] == '.') {
                newQuestion = newQuestion.slice(0, -1) + '?'
            }
            else {
                newQuestion = newQuestion.slice() + "?"
            }
        }
        let req = await fetch(`${process.env.SERVER_URL}/createpoll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }, 
            body: JSON.stringify({
                "question" : newQuestion,
                "option1" : option1,
                "option2" : option2
            })
        })
        let res = await req.json()
        if (req.ok) {
            // console.log(res)
            setErrorDialog(false)
            setQuestion('')
            setOption1('')
            setOption2('')
            setErrorMsg('')
            navigation.navigate('YourPolls')
        }
    }

    const handleCreatePoll = () => {
        if (question.length > 30 || question.length == 0) {
            setErrorDialog(true)
            setErrorMsg('Invalid Question!')
        }
        else if (option1.length > 15|| option1.length == 0) {
            setErrorDialog(true)
            setErrorMsg('Invalid Option 1!')
        }
        else if (option2.length > 15 || option2.length == 0) {
            setErrorDialog(true)
            setErrorMsg('Invalid Option 2!')
        }
        else {
            postPoll()
            // navigation.navigate('YourPolls')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{alignSelf: 'left'}}>
                <Button
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
                        marginVertical: 10,
                        alignSelf: 'center'
                    }}
                    onPress={() => navigation.navigate('YourPolls')}
                    icon={<Icon name="arrow-left" size={80} color="white" />}
                    iconRight
                    />
            </View>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => getProfile()} />
                }>
            <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                    <Dialog
                        isVisible={errorDialog}
                        onBackdropPress={toggleErrorDialog}
                        >
                        <Dialog.Title style={styles.dialogTitle} title={"Error"} />
                        <Text style={styles.dialogText}>{errorMsg}</Text>
                    </Dialog>
                    {loading ? <ActivityIndicator size="large" /> :
                    <View style={styles.pollCard}>
                        <View style={styles.header}>
                            {avatarImg ? 
                            <Avatar
                                size={50}
                                rounded
                                source={{ uri : avatarImg}}
                                containerStyle={{ margin: 10 }}
                                /> 
                            :
                            <Avatar
                                size={50}
                                rounded
                                title={profile.username[0]}
                                containerStyle={{ margin: 10, display: 'flex'}}
                                titleStyle={{ height: 50, width: 50, backgroundColor: avatarColor, paddingTop: 10, textAlign: 'center' }}
                                />}
                            <Text style={{color: usernameColor}}>{profile.username} asks...</Text>
                        </View>
                        <TextInput 
                            placeholder="Should I go out tonight?" 
                            style={styles.question}
                            value={question}
                            onChangeText={(question) => setQuestion(question)}>
                        </TextInput>
                        <View style={styles.buttonContainer}>
                            <View style={styles.option}>
                                <TextInput 
                                    style={styles.optionText}
                                    placeholder="Yes" 
                                    value={option1}
                                    onChangeText={(option1) => setOption1(option1)}
                                >
                                </TextInput>
                            </View>
                            <View style={styles.option}>
                                <TextInput 
                                    style={styles.optionText}
                                    placeholder="No" 
                                    value={option2}
                                    onChangeText={(option2) => setOption2(option2)}
                                >
                                </TextInput>
                            </View>
                        </View>
                    </View>}
                        {/* <Text>What's your question?</Text>
                        <TextInput
                            mode="outlined"
                            label="Should I go out tonight?"
                            value={question}
                            onChangeText={(question) => setQuestion(question)}
                            style={styles.textInput}
                            />
                        <Text>Option 1?</Text>
                        <TextInput
                            mode="outlined"
                            label="Yes"
                            value={option1}
                            onChangeText={(option1) => setOption1(option1)}
                            style={styles.textInput}
                            />
                        <Text>Option 2?</Text>
                        <TextInput
                            mode="outlined"
                            label="No"
                            value={option2}
                            onChangeText={(option2) => setOption2(option2)}
                            style={styles.textInput}
                            /> */}
                        <Button
                            title={"CREATE"}
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
                                marginVertical: 20,
                            }}
                            titleStyle={{ fontWeight: 'bold' }}
                            onPress={() => handleCreatePoll()}
                            />
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
    header: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'left'
    },
    question: {
        alignSelf: 'center',
        marginBottom: 10,
        fontSize: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    option: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        width: 'auto',
        minWidth: 100,
        marginHorizontal: 5,
        marginVertical: 10,
        backgroundColor: "#FFA500"
    },
    optionText: {
        margin: 10,
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    pollCard: {
        width: '100%',
        border: 1,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginVertical: 20,
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
});