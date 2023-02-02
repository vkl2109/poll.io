import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { Button, Avatar } from '@rneui/themed';

export default function Poll ({ user, pollData }) {
    const [ option1Color, setOption1Color ] = useState('#FFA500')
    const [ option2Color, setOption2Color ] = useState('#FFA500')

    let avatarBase64 = user['avatarBase64']
    let username = user['username']
    let question = pollData['question']
    let option1 = pollData['option1']
    let option2 = pollData['option2']
    
    let avatarImg = null
    if (avatarBase64 != '') {
        avatarImg = "data:image/jpeg;base64," + avatarBase64
    }

    const handleSelect = (option) => {
        if (option == 1) {
            if (option1Color == '#228B22') {
                setOption1Color('#FFA500')
                setOption2Color('#FFA500')
            }
            else {
                setOption1Color('#228B22')
                setOption2Color('#FF0000')
            }
        }
        else {
            if (option2Color == '#228B22') {
                setOption1Color('#FFA500')
                setOption2Color('#FFA500')
            }
            else {
                setOption1Color('#FF0000')
                setOption2Color('#228B22')
            }
        }
    }
    
    return (
        <View style={styles.pollCard}>
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
                    containerStyle={{ backgroundColor: '#3d4db7', margin: 10, textAlign: 'center' }}
                    />}
                <Text style={styles.username}>{username} asks...</Text>
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
                    }}
                    containerStyle={{
                        flex: 1,
                        flexWrap: 'wrap',
                        marginHorizontal: 30,
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
                    }}
                    containerStyle={{
                        flex: 1,
                        flexWrap: 'wrap',
                        marginHorizontal: 30,
                        marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                    onPress={() => handleSelect(2)}
                    />
            </View>
        </View>
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
    justifyContent: 'center'
  },
  pollCard: {
    width: '80%',
    border: 1,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 20
  }
});