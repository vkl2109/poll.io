import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Poll from './Poll'
import Response from './Response'
import * as SecureStore from 'expo-secure-store';

export default function YourPolls ({ navigation }) {
    const [ yourPolls, setYourPolls ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)
    const [ visible, setVisible ] = useState(false)

    const screenWidth = Dimensions.get('window').width; 

    useEffect(()=>{
        const request = async () => {
            let req = await fetch('http://10.129.2.90:8000/yourpolls', {
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
                {isLoading ? <Text>Loading...</Text> :
                (yourPolls.map(poll => {
                    return(
                    <View key={poll.poll.id} style={styles.wrapper}>
                        <TouchableOpacity onPress={()=>setVisible(visible=>!visible)} style={styles.wrapper}>
                            <Poll user={poll.user} pollData={poll.poll}/>
                        </TouchableOpacity>
                        {visible && (poll.responses.map((response, i)  => {
                            return (
                                <Response key={i} poll={poll.poll} response={response}/>
                            )
                        }))}
                    </View>
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
  wrapper: {
    width: '100%',
    alignItems: 'center',
  }
});