import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Button, Avatar } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux"

export default function Poll ({ index, user, pollData }) {
    const [ option1Color, setOption1Color ] = useState('#FFA500')
    const [ option2Color, setOption2Color ] = useState('#FFA500')
    const [ avatarColor, setAvatarColor ] = useState('#3d4db7')
    const [ usernameColor, setUsernameColor ] = useState('red')


    let avatarBase64 = user['avatarBase64']
    let username = user['username']
    let question = pollData['question']
    let option1 = pollData['option1']
    let option2 = pollData['option2']
    let created_at = pollData['created_at']

    const calculateTimePosted = () => {
        let posted = 'posted '
        const date = new Date()
        if (parseInt(created_at.slice(6, 10)) < date.getFullYear()) {
            posted += `${date.getFullYear() - parseInt(created_at.slice(6, 10))} years ago`
            return posted
        }
        else if (parseInt(created_at.slice(0, 2)) < date.getMonth() + 1) {
            posted += `${date.getMonth() + 1 - parseInt(created_at.slice(0, 2))} months ago`
            return posted
        }
        else if (parseInt(created_at.slice(3, 5)) < date.getDate()) {
            posted += `${date.getDate()- parseInt(created_at.slice(3, 5))} days ago`
            return posted
        }
        else if (parseInt(created_at.slice(12, 14))< date.getHours()) {
            posted += `${date.getHours()- parseInt(created_at.slice(12, 14))} hours ago`
            return posted
        }
        else if (parseInt(created_at.slice(15, 17)) < date.getMinutes()) {
            posted += `${date.getMinutes()- parseInt(created_at.slice(15, 17))} minutes ago`
            return posted
        }
        else if (parseInt(created_at.slice(18)) < date.getSeconds()) {
            posted += `${date.getSeconds()- parseInt(created_at.slice(18))} seconds ago`
            return posted
        }
    }
    

    const currentUsername = useSelector((state) => state.user)
    
    let avatarImg = null
    if (avatarBase64 != '') {
        avatarImg = "data:image/jpeg;base64," + avatarBase64
    }

    const deleteResponse = async () => {
        let req = await fetch(`http://10.129.2.90:5000/deleteresponse/${pollData['id']}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        let res = await req.json()
        if (req.ok) {
            setOption1Color('#FFA500')
            setOption2Color('#FFA500')
        }
        else {
            console.log(res.error)
        }
    }

    const addResponse = async (option) => {
        let response = ''
        if (option == 1) {
            response = option1
        }
        else {
            response = option2
        }
        let req = await fetch(`http://10.129.2.90:5000/addresponse/${pollData['id']}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            },
            body: JSON.stringify({
                "response" : response
            })
        })
        let res = await req.json()
        if (req.ok) {
            if (option == 1) {
                setOption1Color('#228B22')
                setOption2Color('#FF0000')
            }
            else {
                setOption1Color('#FF0000')
                setOption2Color('#228B22')
            }
        }
        else {
            console.log(res.error)
        }
    }

    const handleSelect = async (option) => {
        if (option == 1) {
            if (option1Color == '#228B22') {
                await deleteResponse()
            }
            else if (option1Color == '#FF0000') {
                await deleteResponse()
                await addResponse(option)
            }
            else (
                await addResponse(option)
            )
        }
        else {
            if (option2Color == '#228B22') {
                await deleteResponse()
            }
            else if (option2Color == '#FF0000') {
                await deleteResponse()
                await addResponse(option)
            }
            else (
                await addResponse(option)
            )
        }
    }

    const slideUp = useRef(new Animated.Value(1000)).current;

    const slideIn = () => {
        Animated.timing(slideUp, {
        toValue: 0,
        duration: 1000,
        delay: index*100,
        useNativeDriver: true,
        }).start();
    };

    const checkPoll = async () => {
        let req = await fetch(`http://10.129.2.90:5000/checkpoll/${pollData['id']}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        let res = await req.json()
        if (req.ok) {
            if (res.responded) {
                if (res.pastResponse.response == option1) {
                    setOption1Color('#228B22')
                    setOption2Color('#FF0000')
                }
                else {
                    setOption1Color('#FF0000')
                    setOption2Color('#228B22')
                }
            }
        }
        else {
            console.log(res.error)
        }
    }

    useEffect(()=> {
        slideIn()
        checkPoll()
        if (user['username'] == currentUsername.value) {
            setAvatarColor('#228b22')
            setUsernameColor('#228b22')
        }
    },[])
    
    return (
        <Animated.View style={{...styles.pollCard, transform: [{ translateY: slideUp }],}}>
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
                    title={username[0]}
                    containerStyle={{ margin: 10, display: 'flex'}}
                    titleStyle={{ height: 50, width: 50, backgroundColor: avatarColor, paddingTop: 5, textAlign: 'center' }}
                    />}
                <Text style={{color: usernameColor}}>{username} asks...</Text>
            </View>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title={option1}
                    buttonStyle={{
                        backgroundColor: option1Color,
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 10,
                        width: 'auto',
                        minWidth: 100
                    }}
                    containerStyle={{
                        marginHorizontal: 10,
                        marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                    onPress={() => handleSelect(1)}
                    />
                <Button
                    title={option2}
                    buttonStyle={{
                        backgroundColor: option2Color,
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 10,
                        width: 'auto',
                        minWidth: 100
                    }}
                    containerStyle={{
                        marginHorizontal: 10,
                        marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                    onPress={() => handleSelect(2)}
                    />
            </View>
            <Text style={styles.datetime}>{calculateTimePosted()}</Text>
        </Animated.View>
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
  pollCard: {
    width: '80%',
    border: 1,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 20,
  },
  datetime: {
    fontWeight: '100',
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic'
  }
});