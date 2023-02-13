import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { Button, Dialog, Icon } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const screenWidth = Dimensions.get('window').width; 

export default function CreatePoll ({ navigation }) {
    const [ question, setQuestion ] = useState('')
    const [ option1, setOption1 ] = useState('')
    const [ option2, setOption2 ] = useState('')
    const [ errorMsg, setErrorMsg ] = useState('')
    const [ errorDialog, setErrorDialog ] = useState(false)

    const toggleErrorDialog = () => {
        setErrorDialog(false)
        setErrorMsg('')
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
        let req = await fetch('http://10.129.2.90:5000/createpoll', {
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
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: screenWidth}}>
                <Dialog
                    isVisible={errorDialog}
                    onBackdropPress={toggleErrorDialog}
                    >
                    <Dialog.Title style={styles.dialogTitle} title={"Error"} />
                    <Text style={styles.dialogText}>{errorMsg}</Text>
                </Dialog>
                <KeyboardAwareScrollView contentContainerStyle={styles.container}>
                    <Text>What's your question?</Text>
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
                        />
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