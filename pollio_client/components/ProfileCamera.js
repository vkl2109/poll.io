import React, { useState, useEffect, useRef  } from 'react'
import { StyleSheet, ScrollView, View, Text, Image, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, Dialog, Icon } from '@rneui/themed';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const screenWidth = Dimensions.get('window').width; 

export default function ProfileCamera() {
    const [ hasCameraPermission, setHasCameraPermission ] = useState(null);
    const [ camera, setCamera ] = useState(null);
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const [ base64Image, setBase64Image ] = useState('')
    const [ avatar, setAvatar ] = useState()
    const imageRef = useRef();

    const takePicture = async () => {
        if (camera) {
            const data = await camera.takePictureAsync(null)
            const base64 = await FileSystem.readAsStringAsync(data.uri, { encoding: 'base64' });
            setBase64Image(base64)
            const img = "data:image/jpeg;base64," + base64
            setAvatar(img);
            console.log(base64)
        }
    }

    const onSaveImageAsync = async () => {
        try {
            const localUri = await captureRef(imageRef, {
                height: 440,
                quality: 1
            });

            await MediaLibrary.saveToLibraryAsync(localUri);
            if (localUri) {
                alert("Saved!");
            }
        } catch (e) {
            alert(e);
        }
    };

    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
            if (hasCameraPermission === false) {
                alert("No Access to Camera");
            }
        })();
        if (status === null) {
            requestPermission();
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.cameraContainer}ref={imageRef} collapsable={false}>
                {avatar ? 
                <Image source={{ uri: avatar }} style={styles.image} />
                :
                <Camera
                    ref={ref => setCamera(ref)}
                    style={styles.fixedRatio}
                    type={Camera.Constants.Type.front}
                    ratio={'1:1'} />}
            </View>
            <View style={styles.buttonContainer}>
                {!avatar ? 
                <Button
                    title={""}
                    buttonStyle={{
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 30,
                        paddingTop: 6,
                        height: 100,
                        width: 100
                    }}
                    containerStyle={{
                        width: 100,
                        height: 100,
                        marginHorizontal: 30,
                        marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                    onPress={() => takePicture()}
                    icon={<Icon name="camera-alt" size={50} color="white" />}
                    />
                :
                <>
                <Button
                    title={""}
                    buttonStyle={{
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 30,
                        paddingTop: 6,
                        height: 100,
                        width: 100
                    }}
                    containerStyle={{
                        width: 100,
                        height: 100,
                        marginHorizontal: 30,
                        marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                    onPress={() => onSaveImageAsync()}
                    icon={<Icon name="save" size={50} color="white" />}
                    iconRight
                    />
                <Button
                    title={""}
                    buttonStyle={{
                        backgroundColor: 'transparent',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        borderRadius: 30,
                        paddingTop: 6,
                        height: 100,
                        width: 100
                    }}
                    containerStyle={{
                        width: 100,
                        height: 100,
                        marginHorizontal: 30,
                        marginVertical: 10,
                    }}
                    titleStyle={{ fontWeight: 'bold' }}
                    onPress={() => setAvatar()}
                    icon={<Icon name="camera-alt" size={50} color="white" />}
                    />
                </>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexGrow: 1,
        backgroundColor: '#25292e', // '#25292e'
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraContainer: {
        height: 'auto',
        width: screenWidth,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        height: 'auto',
        width: screenWidth,
        alignSelf: 'center'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});