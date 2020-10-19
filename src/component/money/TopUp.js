import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';

class TopUp extends Component {
    state = {
        chongzhiAmount: '',// 银行卡列表
        cardList: [],
        defaultCard: {
            bankCode: '',
            bankName: '',
            id: '',
            uid: ''
        },
        showModal: false
    }
    // 挂载完毕获取数据
    componentDidMount() {
        this.getBankList()
    }
    // 获取银行卡列表
    getBankList = () => {
        axios({
            method: 'GET',
            url: '/api/userStages/listBanks'
        })
            .then(res => {
                console.log('获取银行卡列表成功')
                if (res.data.data === null) {

                } else {
                    this.setState({ cardList: res.data.data })
                    this.setState({
                        defaultCard: {
                            bankCode: res.data.data[0].bankCode,
                            bankName: res.data.data[0].bankName,
                            id: res.data.data[0].id,
                            uid: res.data.data[0].uid
                        }
                    })
                }
            })
            .catch(err => {
                console.log('获取银行卡列表失败', err)
            })
    }
    toback = () => {
        this.props.navigation.goBack()
    }
    changeAmount = text => {
        this.setState({
            chongzhiAmount: text
        })
    }
    chooseBank = () => {
        console.log('选择银行卡')
    }
    chongzhiBtn = () => {
        axios({
            url: '/api/userStages/myRecharge',
            method: 'POST',
            data: {
                payType: 'alipay',
                price: this.state.chongzhiAmount
            }
        })
            .then(res => {
                console.log('充值成功', res)
                this.props.navigation.navigate('PayPage', { dom: res.data.data })
            })
            .catch(err => {
                console.log('充值失败', err)
            })
    }
    moneyRecord = () => {
        this.props.navigation.navigate('MoneyRecord', { record: 'chongzhi' })
    }
    render() {
        const { chongzhiAmount, defaultCard, showModal } = this.state
        const code = defaultCard.bankCode
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: '#F4F6F8', flexGrow: 1, alignItems: 'center' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback} style={{ width: 50, height: 50 }}>
                        <Feather name="chevron-left" size={24} style={{ fontSize: 20, color: 'white', margin: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>充值</Text>
                    <View style={{ width: 50 }}></View>
                </View>
                <View style={styles.withdrawalBody}>
                    <View style={{ width: '100%', height: 50 }}>
                        <View style={styles.bankTop}>
                            <Text>充值到余额</Text>
                            <Text>当前余额:0</Text>
                            <Feather name='chevron-right' size={20}></Feather>
                        </View>
                    </View>
                    <View style={[styles.bankTop, { height: 100, alignItems: 'flex-end' }]}>
                        <View style={{ height: '80%', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 40, fontWeight: 'bold' }}>￥</Text>
                        </View>
                        <TextInput
                            style={{ width: '60%', height: 80, fontSize: 40, padding: 0 }}
                            keyboardType='numeric'
                            textAlign='right'
                            value={chongzhiAmount}
                            onChangeText={text => this.changeAmount(text)}
                        ></TextInput>
                    </View>
                    <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
                        <View style={styles.shouxufei}>
                            <Text>手续费：0元</Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', height: 80, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                    <TouchableOpacity style={{ width: '60%', height: 60 }}
                        onPress={this.chongzhiBtn}>
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1295E4', borderRadius: 10 }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>充值</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        // height: 55,
        backgroundColor: '#1295E4',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop:30,
    },
    withdrawalBody: {
        width: '100%',
        height: 200,
        backgroundColor: 'white',
        marginTop: 10,
    },
    bankTop: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#ccc'
    },
    shouxufei: {
        width: '94%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoteFont: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
})

export default TopUp