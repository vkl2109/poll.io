import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Poll from './Poll'

export default function YourPolls ({ navigation }) {
    const [ yourPolls, setYourPolls ] = useState([])
    const [ isLoading, setIsLoading ] = useState(true)

    const screenWidth = Dimensions.get('window').width; 

    useEffect(()=>{
        const request = async () => {
            let req = await fetch('http://10.129.2.90:8000/yourpolls')
            if (req.ok) {
                let res = await req.json()
                setYourPolls(res)
                setIsLoading(false)
            }
        }
        // request()
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'top', alignItems: 'center', width: screenWidth}}>
                {isLoading ? <Text>Loading...</Text> :
                (yourPolls.map(poll => {
                    return(
                        <TouchableOpacity key={poll.poll.id} onPress={()=>handleViewPoll(poll)} style={styles.wrapper}>
                            <Poll user={poll.user} pollData={poll.poll}/>
                        </TouchableOpacity>
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