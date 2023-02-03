import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YourPoll from './YourPoll'
import * as SecureStore from 'expo-secure-store';
const screenWidth = Dimensions.get('window').width; 

export default function YourPolls ({ navigation }) {
    const [ yourPolls, setYourPolls ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)


    useEffect(()=>{
        const request = async () => {
            let req = await fetch('http://10.129.2.90:5000/yourpolls', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
                }
            })
            if (req.ok) {
                let res = await req.json()
                setYourPolls(res)
                setIsLoading(false)
            }
        }
        request()
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}>
                <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreatePoll')}>
                    <Text style={styles.createText}>Create a Poll!</Text>
                </TouchableOpacity>
                {isLoading ? <Text>Loading...</Text> :
                (yourPolls.map((poll, i) => {
                    return(
                        <YourPoll key={i} poll={poll}/>
                    )}   
                ))}
            </ScrollView>
        </SafeAreaView>
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
  createButton: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    border: 1,
    borderWidth: 1,
    height: screenWidth * 0.2,
    borderColor: 'black',
  },
  createText: {
    fontSize: 25
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
  }
});