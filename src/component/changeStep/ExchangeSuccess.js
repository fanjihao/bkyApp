import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class ExchangeSuccess extends Component {

    toOrder = () => {
        this.props.navigation.navigate('OrderDetail')
    }
    toIntegralMall = () => {
        this.props.navigation.navigate('IntegralMall')
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <View style={{ alignItems: 'center', paddingTop:30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>兑换成功</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View>
                    <Image source={require('../../assets/img/succeed.png')} style={{ margin: 30 }}></Image>
                </View>
                <Text style={{ fontSize: 30 }}>兑换成功</Text>
                <View style={styles.btnBox}>
                    <View style={{ width: '40%' }}>
                        <TouchableOpacity onPress={this.toOrder}>
                            <View style={[styles.TwoBtn, { borderColor: '#b1b1b1' }]}>
                                <Text style={{ fontSize: 16 }}>查看订单</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '40%' }}>
                        <TouchableOpacity onPress={this.toIntegralMall}>
                            <View style={[styles.TwoBtn, { backgroundColor: '#2A82E4', borderColor: '#2A82E4' }]}>
                                <Text style={{ color: 'white', fontSize: 16 }}>继续兑换</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    btnBox: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginTop: 30
    },
    TwoBtn: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    header: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#EDEDED'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    headerLeft: {
        position: 'absolute',
        left: 20,
    }
})