import React, { useState, useEffect, useRef  } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { Button, Avatar, Card } from '@rneui/themed';

export default function Poll ({ avatarBase64, username, question, option1, option2 }) {
    let avatarImg = null
    if (avatarBase64 != '') {
        avatarImg = "data:image/jpeg;base64," + avatarBase64
    }
    
    return (
        <Card style={styles.pollCard}>
            <View>
                <Avatar
                    size={64}
                    rounded
                    source={avatarImg}
                    />
                <Text>{username} asks...</Text>
            </View>
            <Text>{question}</Text>
            <View style={styles.buttonContainer}>
                <Button
                    title={option2}
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
                    onPress={() => handleSelect()}
                    />
                <Button
                    title={option2}
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
                    onPress={() => handleSelect()}
                    />
            </View>
        </Card>
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
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pollCard: {
    flex: 1,
    flexGrow: 1,
    border: 1,
    borderWidth: 1,
    borderRadius: 10
  }
});