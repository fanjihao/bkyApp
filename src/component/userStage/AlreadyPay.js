import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

export default class AlreadyPay extends Component {
    state = {
        payMode: 'balance',
        itemData:'',
        num:'',
        year:'',
        month:'',
        day:'',
        promptModal:false
    }

    componentDidMount() {
        let time = this.props.route.params.item.repaymentTime
        let year = time.split('-')[0]
        let month = time.split('-')[1]
        let day = time.split('-')[2]
        this.setState({
            itemData:this.props.route.params.item,
            num:this.props.route.params.num,
            year,
            month,
            day
        }, () => {
            console.log('item:', this.state.itemData)
        })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { itemData, num, month, day } = this.state
        return (
            <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:50, paddingTop:30}}>
                <View style={styles.header}>
                    <Ionicons name="md-arrow-back" style={{ fontSize: 20, margin: 15 }} onPress={this.back}></Ionicons>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{'已还款'}</Text>
                    <View style={{width:50}}></View>
                </View>
                <View style={{ backgroundColor: 'white', alignItems: 'center', padding: 30 }}>
                    <Text style={{color:'#999'}}>{month}月已还清</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10, marginRight: 10, color:'#999' }}>￥</Text>
                        <Text style={{ fontSize: 48, color:'#999' }}>{itemData.repaymentAmount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{color:'#999'}}>第{num}期</Text>
                        <Text style={{ marginLeft: 20, color: '#999', fontWeight: 'bold' }}>免息分期</Text>
                    </View>
                </View>
                <Text style={{ margin: 15,color:'#999' }}>本月账单共￥{itemData.repaymentAmount}，应还款日{month}月{day}日</Text>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
    },
    header: {
        height: 55,
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    payMode: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        width: '94%',
        marginBottom: 10
    },
    checkPayMode: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#FC5445',
        width: '94%',
        marginBottom: 10
    },
    alipayMode: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%',
        justifyContent: 'flex-start'
    },
    hint: {
        color: '#AAAAAA',
        width: '30%'
    },
    checkColor: {
        color: '#E93323'
    },
    oldColor: {
        color: '#282828'
    },
    refund: {
        width: '70%',
        height: 50,
        backgroundColor: '#1195E3',
        color: 'white',
        lineHeight: 50,
        textAlign: 'center',
        borderRadius: 5,
        marginLeft: '15%',
        marginTop: 20,
        fontSize: 18
    },
    balance: {
        marginRight: 10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FE960F',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 20
    }
})