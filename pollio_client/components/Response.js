import React, { useEffect } from 'react'
import { StyleSheet, View, Text, Dimensions } from 'react-native'

const screenWidth = Dimensions.get('window').width; 


export default function Response ({ poll, response }) {
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

    return(
        <View style={{ ...styles.responseWrapper, backgroundColor: color, alignSelf: option}}>
            <Text>{response.username} voted {response.response}</Text>
        </View>
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