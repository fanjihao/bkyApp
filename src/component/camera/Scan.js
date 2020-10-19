// 扫描二维码

import React, { Component } from 'react';
import { RNCamera } from 'react-native-camera';
import { View, StyleSheet, Animated, Text, default as Easing, Dimensions, Linking } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window')

export default class Scan extends Component {
    state = {
        //中间横线动画初始值
        moveAnim: new Animated.Value(-2)
    }

    componentDidMount() {
        this.startAnimation();
    }
    // 扫描框动画
    startAnimation = () => {
        this.state.moveAnim.setValue(-2);
        Animated.sequence([
            Animated.timing(
                this.state.moveAnim,
                {
                    toValue: 200,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                this.state.moveAnim,
                {
                    toValue: -1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true
                }
            )
        ]).start(() => this.startAnimation())

    };

    // 扫描二维码，获取到的数据
    onBarCodeRead = result => {
        const { data } = result

        //扫码后的操作
        console.log('sm', result)
        if(result.data.indexOf('https://www.bkysc.cn/storeDetail') === -1) {
            console.log('其他的二维码')
        } else {
            console.log('博客云二维码')
            if(result.data.indexOf('account') === -1) {
                console.log('商家码走这')
                this.props.navigation.replace('StoreDetail', { merchantKey: result })
            } else {
                console.log('推荐码走这')
            }
        }
    }

    // 退出
    toBack = () => {
        this.props.navigation.popToTop()
    }
    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    autoFocus={RNCamera.Constants.AutoFocus.on}/*自动对焦*/
                    style={[styles.preview,]}
                    type={RNCamera.Constants.Type.back}/*切换前后摄像头 front前back后*/
                    flashMode={RNCamera.Constants.FlashMode.off}/*相机闪光模式*/
                    onBarCodeRead={this.onBarCodeRead}
                    captureAudio={false}
                >
                    <View style={{ width: width, height: 220, backgroundColor: 'rgba(0,0,0,0.3)', }}>
                        <Feather name="x" size={30} color={'white'} style={{ marginLeft: 40, marginTop: 20 }} onPress={this.toBack} />
                    </View>

                    <View style={[{ flexDirection: 'row' }]}>
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', height: 200, width: 200 }} />
                        {/* 扫描动画 */}
                        <Animated.View style={[styles.border, { transform: [{ translateY: this.state.moveAnim }] }]} />

                        <View style={{ backgroundColor: 'rgba(0,0,0,0.3)', height: 200, width: 200 }} />

                    </View>

                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', width: width, alignItems: 'center' }}>
                        <Text style={styles.rectangleText}>将二维码放入框内，即可自动扫描</Text>
                    </View>
                </RNCamera>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    preview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rectangleContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#fcb602',
        backgroundColor: 'transparent',
        borderRadius: 10,
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 196,
        height: 2,
        backgroundColor: '#fcb602',
        borderRadius: 50
    }
});