import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text } from 'react-native'

export default function EmptyResponse () {

    const slideUp = useRef(new Animated.Value(1000)).current;

    const slideIn = () => {
        Animated.timing(slideUp, {
        toValue: 0,
        duration: 1000,
        delay: 200,
        useNativeDriver: true,
        }).start();
    };

    useEffect(()=>{
        slideIn()
    },[])

    return(
        <Animated.View style={{ ...styles.responseWrapper, transform: [{ translateY: slideUp }]}}>
            <Text style={{fontWeight: 'bold'}}>No Responses Yet</Text>
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
        justifyContent: 'center',
        backgroundColor: '#ffcccb',
        alignSelf: 'center'
    }
})