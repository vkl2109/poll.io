import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Button, Avatar } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux"

export default function PollStats ({ index, user, pollData, option1T, option2T }) {
    const [ avatarColor, setAvatarColor ] = useState('#3d4db7')

    let avatarBase64 = user['avatarBase64']
    let username = user['username']
    let question = pollData['question']
    let option1 = pollData['option1']
    let option2 = pollData['option2']
    let created_at = user['created_at']
    
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

    let avatarImg = null
    if (avatarBase64 != '') {
        avatarImg = "data:image/jpeg;base64," + avatarBase64
    }

    let option1Color = '#FFA500'
    let option2Color = '#FFA500'
    if (option1T > option2T) {
        option1Color = '#228B22'
        option2Color = '#FF0000'
    }
    else if (option1T < option2T) {
        option1Color = '#FF0000'
        option2Color = '#228B22'
    }

    const currentUsername = useSelector((state) => state.user)

    const slideUp = useRef(new Animated.Value(1000)).current;

    const slideIn = () => {
        Animated.timing(slideUp, {
        toValue: 0,
        duration: 1000,
        delay: index*100,
        useNativeDriver: true,
        }).start();
    };

    useEffect(()=> {
        slideIn()
        if (user['username'] == currentUsername.value) {
            setAvatarColor('#228b22')
        }
        console.log(user['created_at'])
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
                <Text style={styles.username}>{username} asks...</Text>
            </View>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.buttonContainer}>
                <View style={{...styles.option, backgroundColor: option1Color}}>
                    <Text style={styles.optionText}>{option1} : {option1T}</Text>
                </View>
                <View style={{...styles.option, backgroundColor: option2Color}}>
                    <Text style={styles.optionText} >{option2} : {option2T}</Text>
                </View>
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
  username: {
    color: 'red'
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
    marginHorizontal: 5,
    marginVertical: 10,
  },
  optionText: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
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