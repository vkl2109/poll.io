import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, Avatar } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux"

export default function FindFriendUser ({ index, user }) {
    const [ avatarColor, setAvatarColor ] = useState('#3d4db7')
    const [ usernameColor, setUsernameColor ] = useState('red')
    const [ sentColor, setSentColor ] = useState('white')

    let avatarBase64 = user['avatarBase64']
    let username = user['username']
    
    const currentUsername = useSelector((state) => state.user)
    
    let avatarImg = null
    if (avatarBase64 != '') {
        avatarImg = "data:image/jpeg;base64," + avatarBase64
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

    useEffect(()=> {
        slideIn()
        if (user['username'] == currentUsername.value) {
            setAvatarColor('#228b22')
        }
        if (user['requested'] == 1) {
            setSentColor('lightgrey')
        }
    },[])
    
    return (
        <Animated.View style={{...styles.pollCard, transform: [{ translateY: slideUp }],}}>
            <TouchableOpacity style={{backgroundColor: sentColor, borderRadius: 10}}>
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
                    <Text style={{fontWeight: 'bold', fontSize: '15', color: usernameColor}}>{username}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
  container: {
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
    marginVertical: 10,
  }
});