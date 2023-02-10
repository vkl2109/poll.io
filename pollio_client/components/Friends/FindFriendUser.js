import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, Avatar, Dialog } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux"

export default function FindFriendUser ({ index, user }) {
    const [ avatarColor, setAvatarColor ] = useState('#3d4db7')
    const [ usernameColor, setUsernameColor ] = useState('red')
    const [ sentColor, setSentColor ] = useState('white')
    const [ selfError, setSelfError ] = useState(false)
    const [ visibleRequest, setVisibleRequest ] = useState(false)
    const [ alreadySent, setAlreadySent ] = useState(false)
    const [ alreadyReceived, setAlreadyReceived ] = useState(false)

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

    const handleRequest = () => {
        if (user['username'] == currentUsername.value) {
            setSelfError(true)
        }
        else if (sentColor == 'white') {
            setVisibleRequest(true)
        }
        else if (sentColor == '#e0e0e0'){
            setAlreadySent(true)
        }
        else if (sentColor == '#d3d3d3'){
            setAlreadyReceived(true)
        }
    }

    const handleFriendRequest = async () => {
        let req = await fetch('http://10.129.2.90:5000/createrequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }, 
            body: JSON.stringify({
                "recipient" : user.username
            })
        })
        if (req.ok) {
            setVisibleRequest(false)
            alert('Friend Request Sent!')
            setSentColor('#e0e0e0')
        }
    }

    useEffect(()=> {
        slideIn()
        if (user['username'] == currentUsername.value) {
            setAvatarColor('#228b22')
            setUsernameColor('#228b22')
        }
        if (user['requested'] == 1) {
            setSentColor('#e0e0e0')
        }
        else if (user['requested'] == 2) {
            setSentColor('#d3d3d3')
        }
        console.log(user['requested'])
    },[])
    
    return (
        <Animated.View style={{...styles.pollCard, transform: [{ translateY: slideUp }],}}>
            <TouchableOpacity onPress={handleRequest} style={{backgroundColor: sentColor, borderRadius: 8}}>
                <Dialog isVisible={selfError}
                    onBackdropPress={() => setSelfError(false)}
                    >
                        <Dialog.Title title={"Can't friend yourself!"}/>
                </Dialog>
                <Dialog isVisible={alreadySent}
                    onBackdropPress={() => setAlreadySent(false)}
                    >
                        <Dialog.Title title={"Already Sent Request"}/>
                </Dialog>
                <Dialog isVisible={alreadyReceived}
                    onBackdropPress={() => setAlreadyReceived(false)}
                    >
                        <Dialog.Title title={"Already Received Request"}/>
                </Dialog>
                <Dialog isVisible={visibleRequest}
                    onBackdropPress={() => setVisibleRequest(false)}
                    >
                        <Dialog.Title title={"Send Friend Request?"}/>
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
                                onPress={() => handleFriendRequest()}
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
                                onPress={() => setVisibleRequest(false)}
                                />
                        </View>
                </Dialog>
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