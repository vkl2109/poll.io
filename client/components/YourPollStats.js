import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Button, Avatar, Icon, Dialog } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux"

export default function PollStats ({ index, user, pollData, option1T, option2T }) {
    const [ avatarColor, setAvatarColor ] = useState('#3d4db7')
    const [ usernameColor, setUsernameColor ] = useState('red')
    const [ canDelete, setCanDelete ] = useState(false)
    const [ deleteView, setDeleteView ] = useState(false);

    let avatarBase64 = user['avatarBase64']
    let username = user['username']
    let question = pollData['question']
    let option1 = pollData['option1']
    let option2 = pollData['option2']
    
    const calculateTimePosted = () => {
        const date = new Date()
        const pollDate = new Date(pollData['created_at'])
        const diffTime = Math.abs(pollDate - date);
        const diffSeconds = Math.floor(diffTime / (1000));
        if (diffSeconds > 59) {
            const diffMinutes = Math.floor(diffSeconds / 60)
            if (diffMinutes > 59) {
                const diffHours = Math.floor(diffMinutes / 60)
                if (diffHours > 23) {
                    const diffDays = Math.floor(diffHours / 24)
                    if (diffDays > 30) {
                        const diffMonths = Math.floor(diffDays / 30)
                        if (diffMonths > 11) {
                            const diffYears = Math.floor(diffMonths / 12)
                            return `posted ${diffYears} year${diffYears != 1 ? 's' : ''} ago`
                        }
                        else {
                            return `posted ${diffMonths} month${diffMonths != 1 ? 's' : ''} ago`
                        }
                    }
                    else {
                        return `posted ${diffDays} day${diffDays != 1 ? 's' : ''} ago`
                    }
                }
                else {
                    return `posted ${diffHours} hour${diffHours != 1 ? 's' : ''} ago`
                }
            }
            else {
                return `posted ${diffMinutes} minute${diffMinutes != 1 ? 's' : ''} ago`
            }
        }
        else {
            return `posted ${diffSeconds} second${diffSeconds != 1 ? 's' : ''} ago`
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

    const handleDelete = async () => {
        let req = await fetch(`${process.env.SERVER_URL}/deletepoll/${pollData['id']}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
            }
        })
        if (req.ok) {
            alert('Poll deleted!')
        }
        else {
            let res = await req.json()
            alert(res.error)
        }
        setDeleteView(false)
    }

    useEffect(()=> {
        slideIn()
        if (user['username'] == currentUsername.value) {
            setAvatarColor('#228b22')
            setUsernameColor('#228b22')
            setCanDelete(true)
        }
        // console.log(pollData['created_at'])
    },[])
    
    return (
        <Animated.View style={{...styles.pollCard, transform: [{ translateY: slideUp }],}}>
            <Dialog
                isVisible={deleteView}
                onBackdropPress={() => setDeleteView(false)}
                >
                <Dialog.Title style={styles.dialogTitle} title={"Delete Poll?"} />
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
                        onPress={() => handleDelete()}
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
                        onPress={() => setDeleteView(false)}
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
                    titleStyle={{ height: 50, width: 50, backgroundColor: avatarColor, paddingTop: 10, textAlign: 'center' }}
                    />}
                <Text style={{color: usernameColor}}>{username} asks...</Text>
                {canDelete && 
                <Button
                    buttonStyle={{
                        backgroundColor: 'red',
                        borderRadius: 30,
                        height: 30,
                        width: 30
                    }}
                    containerStyle={{
                        height: 40,
                        width: 40,
                        marginLeft: 'auto',
                        marginRight: 20,
                        marginVertical: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    icon={<Icon name="delete" size={10} color="white" style={{ alignSelf: 'center'}} />}
                    onPress={() => setDeleteView(true)}
                    />}
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
  },
  optionText: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
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