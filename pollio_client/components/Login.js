import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Login ({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between'}}>
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={{uri: 'https://media.giphy.com/media/BSNYKSeQSzxSw/giphy.gif'}} style={styles.image} ></Image>
                    </View>
                    <View style={styles.loginContainer}>
                        <Image source={{uri: 'https://media.giphy.com/media/BSNYKSeQSzxSw/giphy.gif'}} style={styles.image} ></Image>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image source={{uri: 'https://media.giphy.com/media/BSNYKSeQSzxSw/giphy.gif'}} style={styles.image} ></Image>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#25292e', // '#25292e'
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf:'stretch'
  },
  logo: {
    width: 300,
    height: 120,
    marginTop: 60
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 18,
  },
  imageContainer: {
    flex: 1 / 4,
  },
  loginContainer: {
    flex: 1 / 2,
  },
  dialogTitle: {
    textAlign: 'center'
  },
  dialogText: {
    textAlign: 'center',
    color: '#FF0000'
  },
  headerContainer: {
    marginTop: 40,
    flex: 2 / 3,
    alignItems: 'center',
    flexDirection: 'column',
    padding: 0
    // backgroundColor: '#FFFFFF',
  },
  input: {
    height: 50,
    width: 200,
    margin: 12,
    borderWidth: 0,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 20,
    shadowColor: '#52006A',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  }
})