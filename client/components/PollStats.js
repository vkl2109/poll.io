import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Avatar } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux"

export default function PollStats ({ index, user, pollData }) {
    const [ option1Color, setOption1Color ] = useState('#FFA500')
    const [ option1Tally, setOption1Tally ] = useState(0)
    const [ option2Color, setOption2Color ] = useState('#FFA500')
    const [ option2Tally, setOption2Tally ] = useState(0)
    const [ avatarColor, setAvatarColor ] = useState('#3d4db7')

    let avatarBase64 = user['avatarBase64']
    let username = user['username']
    let question = pollData['question']
    let option1 = pollData['option1']
    let option2 = pollData['option2']
    
    let avatarImg = null
    if (avatarBase64 != '') {
        avatarImg = "data:image/jpeg;base64," + avatarBase64
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

    const getPollStats = async () => {
        let req = await fetch(`${process.env.SERVER_URL}/getpollstats/${pollData['id']}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        let res = await req.json()
        if (req.ok) {
            setOption1Tally(res.option1Tally)
            setOption2Tally(res.option2Tally)
            if (res.option1Tally > res.option2Tally) {
                setOption1Color('#228B22')
                setOption2Color('#FF0000')
            }
            else if (res.option1Tally < res.option2Tally) {
                setOption1Color('#FF0000')
                setOption2Color('#228B22')
            }
        }
        else {
            console.log(res.error)
        }
    }

    useEffect(()=> {
        slideIn()
        getPollStats()
        if (user['username'] == currentUsername.value) {
            setAvatarColor('#228b22')
        }
    },[])
    
    return (
        <Animated.View style={{...styles.pollCard, transform: [{ translateY: slideUp }],}}>
            <View style={styles.header}>
                {avatarImg ? 
                <Avatar
                    size={50}
                    rounded
                    source={avatarImg}
                    containerStyle={{ margin: 10 }}
                    /> 
                :
                <Avatar
                    size={50}
                    rounded
                    title={username[0]}
                    containerStyle={{ backgroundColor: avatarColor, margin: 10, textAlign: 'center' }}
                    titleStyle={{ height: 50, width: 50, backgroundColor: avatarColor, paddingTop: 10, textAlign: 'center' }}
                    />}
                <Text style={styles.username}>{username} asks...</Text>
            </View>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.buttonContainer}>
                <View style={{...styles.option, backgroundColor: option1Color}}>
                    <Text style={styles.optionText}>{option1} : {option1Tally}</Text>
                </View>
                <View style={{...styles.option, backgroundColor: option2Color}}>
                    <Text style={styles.optionText} >{option2} : {option2Tally}</Text>
                </View>
            </View>
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
    marginHorizontal: 20,
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
  }
});