import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class AfterSale extends Component {
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ backgroundColor:'white', flex:1,elevation:1 }}>
                <View style={styles.header}>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                    <Text style={styles.headerTitle}>售后中心</Text>
                    <View style={{width:20}}></View>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex:1 }}>
                    <Image source={require('../../assets/img/notInfo/orderInfoIsNot.png')} style={styles.infoIsNot} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    infoIsNot: {
        width: 170,
        height: 150
    },
    header: {
        width: '100%',
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EDEDED',
        paddingTop:30,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    headerLeft: {
    }
})