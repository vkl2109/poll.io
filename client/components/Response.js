import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, Dimensions } from 'react-native'
import { useSelector } from "react-redux"

const screenWidth = Dimensions.get('window').width; 

export default function Response ({ index, poll, response }) {
    const [ font, setFont ] = useState('normal')

    const currentUsername = useSelector((state) => state.user)

    let color = ''
    let option = ''
    if (response.response == poll.option1) {
        option = 'flex-start'
        color = '#90EE90'
    }
    else {
        option = 'flex-end'
        color = '#ffcccb'
    }

    const slideUp = useRef(new Animated.Value(1000)).current;

    const slideIn = () => {
        Animated.timing(slideUp, {
        toValue: 0,
        duration: 1000,
        delay: index*100 + 100,
        useNativeDriver: true,
        }).start();
    };

    useEffect(()=>{
        slideIn()
        if (response.username == currentUsername.value) {
            setFont('bold')
        }
    },[])

    return(
        <Animated.View style={{ ...styles.responseWrapper, backgroundColor: color, alignSelf: option, transform: [{ translateY: slideUp }]}}>
            <Text style={{fontWeight: font}}>{response.username} voted {response.response}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    responseWrapper: {
        width: 'auto',
        height: 50,
        borderColor: 'black',
        border: 1,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
})