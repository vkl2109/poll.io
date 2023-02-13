import React, { useState, useEffect, useRef } from 'react'
import { Animated, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Button, Avatar, Dialog } from '@rneui/themed';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux"

export default function SentRequest ({ index, request }) {

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
                <Text style={{fontWeight: 'bold', fontSize: '20', color: 'red', margin: 20}}>{request.recipient}</Text>
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
    justifyContent: 'center'
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