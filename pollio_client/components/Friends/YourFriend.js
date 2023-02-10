import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Button, Avatar, Dialog } from '@rneui/themed';

export default function YourFriend ({ index, user }) {
    const [ avatarColor, setAvatarColor ] = useState('#3d4db7')

    let avatarImg = null
    if (user.avatarBase64 != '') {
        avatarImg = "data:image/jpeg;base64," + user.avatarBase64
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
                <Text style={{fontWeight: 'bold', fontSize: '20', color: 'red'}}>{user.username}</Text>
            </View>
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
    width: '100%',
    border: 1,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginVertical: 5,
  }
});