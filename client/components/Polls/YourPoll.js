import React, { useState } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import PollStats from '../PollStats'
import Response from '../Response'

export default function YourPoll ({ poll }) {
    const [ visible, setVisible ] = useState(false)

    return (
        <View style={styles.wrapper}>
            <TouchableOpacity onPress={()=>setVisible(visible=>!visible)} style={styles.wrapper}>
                <PollStats user={poll.user} pollData={poll.poll}/>
            </TouchableOpacity>
            {visible && (poll.responses.map((response, i)  => {
                return (
                    <Response key={i} index={i} poll={poll.poll} response={response}/>
                )
            }))}
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
  wrapper: {
    width: '100%',
    alignItems: 'center',
  }
});