import React, { useState, useEffect } from 'react'
import { StyleSheet, ScrollView, Text, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const screenWidth = Dimensions.get('window').width; 

export default function Friends () {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'center', alignItems: 'center', width: screenWidth}}>
                <View>
                    <Text>Friends</Text>
                </View>
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
});