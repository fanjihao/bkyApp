import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

export default class UserRefound extends Component {
    state = {
        payMode: 'balance',
        itemData:'',
        num:'',
        year:'',
        month:'',
        day:'',
        promptModal:false,
        stage:[]
    }

    componentDidMount() {
        this.getStageDetail()
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
    getStageDetail = () => {
        let formData = new FormData()
        formData.append('orderId', this.props.route.params.orderId)
        axios({
            url: '/api/userStages/userOrderDetails',
            method: 'POST',
            data: formData
        })
        .then(res => {
            console.log('详情', res.data.data.list)
            let stage = res.data.data.list
            this.setState({
                stage
            })
        })
        .catch(err => {
            console.log(err)
        })
    }
    // 最后一期
    overNotice = () => {
        axios({
            url:'/overNotice',
            method:'GET',
            params:{
                id:this.props.route.params.id
            }
        })
        .then(res => {
            console.log('已通知最后一期')
        })
        .catch(err => {

        })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }

    // 微信支付
    toWechat = () => {
        this.setState({ payMode: 'wechat' })
    }

    // 余额支付 
    toBalance = () => {
        this.setState({ payMode: 'balance' })
    }

    // 支付宝支付 
    toAlipay = () => {
        this.setState({ payMode: 'alipay' })
    }

    // 银联支付 
    toUnionpay = () => {
        this.setState({ payMode: 'unionpay' })
    }
    okPayment = () => {
        let date = new Date()
        const { year, month, day } = this.state
        if(date.getFullYear() >= Number(year) && date.getMonth() + 1 >= Number(month) && date.getDate() >= Number(day)) {
            let formData = new FormData()
            formData.append('orderId', this.props.route.params.item.payOrderId)
            axios({
                url:'/api/userStages/detailedPay',
                method:'POST',
                data:formData
            })
            .then(res => {
                console.log(res)
                this.props.navigation.navigate('PayPage', { dom : res.data.data })
                if(this.state.stage[this.state.stage.length - 1].id === this.state.itemData.id) {
                    console.log('最后一期')
                    this.overNotice()
                }
            })
            .catch(err => {
                console.log(err)
            })
        } else {
            this.setState({
                promptModal:true
            })
        }
    }
    render() {
        const { itemData, num, month, day, promptModal } = this.state
        return (
            <ScrollView contentContainerStyle={{flexGrow:1,paddingBottom:50, paddingTop:30}}>
                <View style={styles.header}>
                    <Ionicons name="md-arrow-back" style={{ fontSize: 20, margin: 15, width: '38%' }} onPress={this.back}></Ionicons>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{'还款'}</Text>
                </View>
                <View style={{ backgroundColor: 'white', alignItems: 'center', padding: 30 }}>
                    <Text>{month}月还款金额</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10, marginRight: 10 }}>￥</Text>
                        <Text style={{ fontSize: 48 }}>{itemData.repaymentAmount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>第{num}期</Text>
                        <Text style={{ marginLeft: 20, color: '#E90058', fontWeight: 'bold' }}>免息分期</Text>
                    </View>
                </View>
                <Modal
                    isVisible={promptModal}
                    onBackdropPress={() => this.setState({ promptModal: false })}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '90%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>还没有到还款时间呢，亲，请不要着急哦！</Text>
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Text style={{ margin: 15 }}>本月账单共￥{itemData.repaymentAmount}，应还款日{month}月{day}日</Text>


                <Text style={styles.refund} onPress={this.okPayment}>确认还款</Text>
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
        flexDirection: 'row'
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