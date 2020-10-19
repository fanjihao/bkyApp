import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import formatTime from '../modules/FormatTime';

class OrderDetail extends Component {
    state = {
        orderDetail: this.props.route.params.orderDetail,
        promptModal: false,
        delShow: false,
        hint: '订单删除成功',
        payTypeShow: false,
        payType: "balance",
        agentLevel: null,
        orderPayType: this.props.route.params.orderDetail.payType,
        bankModal: false,
        cardList: [],
        affirmModal: false,
        uni: ''
    }
    componentDidMount() {
        storage.load({ key: 'agentLevel' })
            .then(ret => {
                this.setState({ agentLevel: ret })
                this.getBankList()
            })
            .catch(err => {

            })
    }

    // 回到上一级
    toback = () => {
        this.props.navigation.goBack()
    }
    // 弹出取消订单提示框
    tooltip = id => {
        this.setState({
            promptModal: true,
            delOrderId: id
        })
    }
    // 取消订单
    affirm = () => {
        axios({
            method: 'POST',
            url: '/api/order/cancel',
            data: {
                id: this.state.delOrderId
            }
        })
            .then(res => {
                // this.getOrderList(this.props.orderType)
                this.props.navigation.goBack()
                this.setState({
                    promptModal: false,
                    hint: '订单删除成功',
                    delShow: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            delShow: false
                        })
                    }, 1000)
                })
            })
            .catch(err => {
                this.setState({
                    promptModal: false,
                    hint: '订单删除失败',
                    delShow: true
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            delShow: false
                        })
                    }, 1000)
                })
            })
    }
    // 付款
    payMoney = () => {
        // if (this.state.orderPayType === 'bank') {
        //     this.setState({
        //         bankModal: true
        //     })
        // } else if (this.state.orderPayType === 'alipay') {
        //     this.pay('alipay')
        // }
        this.setState({
            payTypeShow: true
        })
    }
    getBankList = () => {
        axios({
            method: 'GET',
            url: '/api/userStages/listBanks'
        })
            .then(res => {
                if (res.data.data === null) {

                } else {
                    this.setState({ cardList: res.data.data })
                }
            })
            .catch(err => {
                console.log('获取银行卡列表失败', err)
            })
    }
    pay = (paytype) => {
        axios({
            url: '/api/order/pay',
            method: 'POST',
            data: {
                uni: this.state.orderDetail.orderId,
                paytype,
                from: "weixinh5",
            }
        })
            .then(res => {
                this.setState({
                    payTypeShow: false
                }, () => {
                    this.props.navigation.navigate('PayPage', { dom: res.data.data.url })
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    BankPay = (i) => { // 银行卡支付
        console.log(i)
    }
    // 确认收货提示框
    take = id => {
        this.setState({
            affirmModal: true,
            uni: id
        })
    }
    // 确认收货
    confirm = () => {
        axios({
            method: 'POST',
            url: '/api/order/take',
            data: {
                uni: this.state.uni
            }
        })
            .then(res => {
                console.log('确认收货成功', res)
                this.setState({ affirmModal: false })
            })
            .catch(err => {
                console.log('确认收货失败', err)
            })
    }
    render() {
        const { orderDetail, promptModal, delShow, hint, payTypeShow, payType, agentLevel,
            bankModal, orderPayType, cardList, affirmModal } = this.state
        const { personInfo } = this.props
        let bankDom = cardList.map(item => {
            let code = item.bankCode.substr(item.bankCode.length - 4)
            return (
                <TouchableOpacity onPress={() => this.BankPay(item)} key={item.id} style={styles.checkBank}>
                    <View style={styles.alipayMode}>
                        <Text style={styles.checkColor}>{item.bankName}</Text>
                    </View>
                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                    <Text style={styles.hint}>尾号：{code}</Text>
                </TouchableOpacity>
            )
        })

        let addtime = Number(orderDetail.addTime)
        let date = new Date()
        let now = Math.floor(date.getTime() / 1000) - addtime
        let minutes = parseInt(now % 3600 / 60) + '分钟前'
        return (
            <View style={{ backgroundColor: '#f5f5f5', elevation: 1, flex: 1, }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback}
                        style={{ width: 50, height: 50 }}>
                        <Ionicons
                            name="md-arrow-back"
                            style={{ fontSize: 20, color: 'white', margin: 15 }}></Ionicons>
                    </TouchableOpacity>
                    <Text style={{ marginLeft: '28%', fontSize: 18, color: 'white', fontWeight: 'bold' }}>订单详情</Text>
                </View>

                <View style={{ flex: 1, paddingBottom: 42 }}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}>
                        <View style={styles.orderDetailHeader}>
                            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>{orderDetail._status._msg}</Text>
                            <Text style={{ color: 'white' }}>{minutes}</Text>
                        </View>
                        {/* <View style={styles.orderDetailNav}>

                        </View> */}
                        <View style={styles.personInfo}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text>{orderDetail.realName}</Text>
                                <Text style={{ marginLeft: 15 }}>{personInfo.account}</Text>
                            </View>
                            <Text style={{ color: '#8B8B8B' }}>{orderDetail.userAddress}</Text>
                        </View>

                        <View style={styles.orderDetailInfo}>
                            <Text style={styles.totalNum}>共{orderDetail.totalNum}件商品</Text>

                            <View style={styles.goodsInfo}>
                                {orderDetail.cartInfo.map((item, index) => (
                                    <View key={item.id} style={styles.productInfo}>
                                        <Image source={{ uri: item.productInfo.image }} style={styles.goodsImage} />
                                        <View style={{ justifyContent: 'space-evenly', height: 50, width:'60%' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width:'100%' }}>
                                                <Text style={{ width: 195 }}>{item.productInfo.storeName}</Text>
                                                <Text>x{item.cartNum}</Text>
                                            </View>
                                            <Text style={{ color: '#E93323' }}>￥{agentLevel === 4 ? item.truePrice : item.vipTruePrice}</Text>
                                        </View>
                                        {orderDetail.status === 2
                                            ?
                                            <Text style={styles.pingjiaBtn}
                                                onPress={() => this.props.navigation.navigate('Evaluation', { detail: item })}>
                                                评价
                                            </Text> : null}
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.orderInfo}>
                            <View style={styles.orderInfoItem}>
                                <Text>订单编号：</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.info}>{orderDetail.orderId}</Text>
                                </View>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text>下单时间：</Text>
                                <Text style={styles.info}>{formatTime(orderDetail.addTime)}</Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text>订单类型：</Text>
                                <Text style={styles.info}>普通订单</Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text>支付状态：</Text>
                                <Text style={styles.info}>
                                    {orderDetail.paid === 0
                                        ? '未支付'
                                        : '已支付'}
                                </Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text>支付方式：</Text>
                                <Text style={styles.info}>
                                    {orderPayType === 'alipay' ? '支付宝支付' : null}
                                    {orderPayType === 'balance' ? '余额支付' : null}
                                    {orderPayType === 'wechat' ? '微信支付' : null}
                                    {orderPayType === 'bank' ? '银行卡支付' : null}
                                </Text>
                            </View>
                            <View style={styles.orderInfoItem}>
                                <Text>订单状态：</Text>
                                <Text style={styles.info}>{orderDetail._status._title}</Text>
                            </View>
                            {orderDetail.status === 1
                                ? <View style={styles.orderInfoItem}>
                                    <Text>快递公司</Text>
                                    <Text style={styles.info}>{orderDetail.deliveryName}</Text>
                                </View> : null}
                            {orderDetail.status === 1
                                ? <View style={styles.orderInfoItem}>
                                    <Text>快递编号：</Text>
                                    <Text style={styles.info}>{orderDetail.deliveryId}</Text>
                                </View> : null}
                        </View>
                        {/* 银行卡列表 */}
                        <Modal
                            isVisible={bankModal}
                            onBackdropPress={() => this.setState({ bankModal: false })}
                            backdropOpacity={0.2}
                            style={styles.bankModal}
                            animationInTiming={20}
                            animationOutTiming={20}
                        >
                            <View style={{ backgroundColor: 'white', width: '100%', height: 400 }}>
                                <View style={{ width: '100%', flex: 1 }}>
                                    <Text style={{ margin: 15, textAlign: 'left' }}>银行卡</Text>
                                    <View style={{ alignItems: 'center', margin: 10 }}>
                                        {bankDom}
                                    </View>
                                </View>
                                <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity style={styles.addbank} onPress={this.goAddBank}>
                                        <Feather name='plus-square' style={{ color: 'white', marginRight: 10 }} size={16}></Feather>
                                        <Text style={{ color: 'white' }}>添加一张新银行卡</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        <View style={styles.orderPay}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text>支付金额：</Text>
                                <Text style={styles.info}>￥{orderDetail.totalPrice}</Text>
                            </View>

                            <View style={styles.truePay}>
                                <Text>实付款：</Text>
                                <Text style={{ color: '#E93323', fontWeight: 'bold' }}>￥{orderDetail.totalPrice}</Text>
                            </View>
                        </View>
                    </ScrollView>

                    {orderDetail.status === 1
                        ? <View style={styles.flexBottom}>
                            <Text style={styles.pay} onPress={() => this.take(orderDetail.orderId)}>确认收货</Text>
                        </View> : null}
                    {orderDetail.status === 0 && orderDetail.paid === 1
                        ? <View style={styles.flexBottom}>
                            <Text style={styles.cancelOrder}>申请退款</Text>
                        </View> : null}
                    {orderDetail.status === 0 && orderDetail.paid === 0
                        ? <View style={styles.flexBottom}>
                            <Text style={styles.cancelOrder} onPress={() => this.tooltip(orderDetail.orderId)}>取消订单</Text>
                            <Text style={styles.pay} onPress={this.payMoney}>立即付款</Text>
                        </View> : null}
                </View>

                {/* 确认订单提示 */}
                <Modal
                    isVisible={affirmModal}
                    // backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '80%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>确定收货？</Text>
                        </View>
                        <View style={styles.modalBtn}>
                            <Text style={[styles.modalBtnItem, { borderBottomLeftRadius: 20 }]} onPress={this.confirm}>确认</Text>
                            <Text style={[{ color: '#4EA4FB', borderBottomRightRadius: 20 }, styles.modalBtnItem]} onPress={() => this.setState({ affirmModal: false })}>取消</Text>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={promptModal}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '80%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>确定取消该订单？</Text>
                        </View>
                        <View style={styles.modalBtn}>
                            <Text style={[styles.modalBtnItem, { borderBottomLeftRadius: 20 }]} onPress={this.affirm}>确认</Text>
                            <Text style={[{ color: '#4EA4FB', borderBottomRightRadius: 20 }, styles.modalBtnItem]} onPress={() => this.setState({ promptModal: false })}>取消</Text>
                        </View>
                    </View>
                </Modal>
                {/* 取消订单成功、失败提示 */}
                <Modal
                    isVisible={delShow}
                    backdropOpacity={0}
                    style={styles.addShoppingcartModal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <Text style={styles.addShoppingcartHint}>{hint}</Text>
                </Modal>
                {/* 选择付款方式 */}
                <Modal
                    isVisible={payTypeShow}
                    onBackdropPress={() => this.setState({ payTypeShow: false })}
                    backdropOpacity={0.5}
                    style={styles.payTypeModal}
                >
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 22, borderTopRightRadius: 22 }}>
                        <View style={{ flexDirection: 'row', height: 44, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                            <Text>选择支付方式</Text>
                            <Ionicons name="close-outline" size={24} style={styles.backIcon} onPress={() => this.setState({ payTypeShow: false })} />
                        </View>

                        <View>
                            <TouchableOpacity style={styles.payTypeItem} onPress={() => this.pay('wechat')}>
                                <View style={styles.payTypeItemText}>
                                    <Image source={require('../../assets/img/channel/Wechat.png')} style={styles.payTypeImage} />
                                    <View style={styles.payTypeText}>
                                        <Text>微信支付</Text>
                                        <Text style={styles.payTypeTextItem}>微信快捷支付</Text>
                                    </View>
                                </View>
                                <Feather name='chevron-right' size={20} style={styles.rightIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.payTypeItem} onPress={() => this.pay('alipay')}>
                                <View style={styles.payTypeItemText}>
                                    <Image source={require('../../assets/img/channel/Alipay.png')} style={styles.payTypeImage} />
                                    <View style={styles.payTypeText}>
                                        <Text>支付宝</Text>
                                        <Text style={styles.payTypeTextItem}>支付宝快捷支付</Text>
                                    </View>
                                </View>
                                <Feather name='chevron-right' size={20} style={styles.rightIcon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.payTypeItem} onPress={() => this.pay('bank')}>
                                <View style={styles.payTypeItemText}>
                                    <Image source={require('../../assets/img/channel/Unionpay.png')} style={styles.payTypeImage} />
                                    <View style={styles.payTypeText}>
                                        <Text>银联支付</Text>
                                        <Text style={styles.payTypeTextItem}>银联快捷支付</Text>
                                    </View>
                                </View>
                                <Feather name='chevron-right' size={20} style={styles.rightIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pingjiaBtn: {
        width: 50,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
        margin: 10,
        borderWidth: 1,
        borderColor: 'red',
        color: 'red',
        borderRadius: 3
    },
    checkBank: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '94%',
        marginBottom: 10,
        borderRadius: 5
    },
    addbank: {
        width: '90%',
        height: 40,
        borderRadius: 30,
        backgroundColor: '#1295E4',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    bankModal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    header: {
        width: '100%',
        height: 75,
        borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#E93323',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        zIndex: 999,
        paddingTop: 30
    },
    orderDetailHeader: {
        height: 64,
        backgroundColor: '#E93323',
        justifyContent: 'space-evenly',
        paddingLeft: 40
    },
    orderDetailNav: {
        height: 53,
        backgroundColor: 'white'
    },
    personInfo: {
        height: 60,
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        paddingLeft: 20
    },
    orderDetailInfo: {
        marginTop: 10,
        backgroundColor: 'white'
    },
    totalNum: {
        height: 37,
        lineHeight: 37,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7F7'
    },
    productInfo: {
        marginLeft: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7F7',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 77,
        width: '100%',
        paddingRight:20
    },
    goodsImage: {
        width: 56,
        height: 56,
        marginRight: 10
    },
    orderInfo: {
        marginTop: 10,
        backgroundColor: 'white'
    },
    orderInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    info: {
        color: '#9C9C9C'
    },
    copy: {
        height: 18,
        width: 30,
        borderWidth: 1,
        borderColor: '#666666',
        lineHeight: 18,
        textAlign: 'center',
        marginLeft: 10,
        fontSize: 10
    },
    orderPay: {
        marginTop: 10,
        backgroundColor: 'white',
        padding: 12
    },
    truePay: {
        paddingTop: 12,
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F7F7F7',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    flexBottom: {
        height: 50,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#F7F7F7',
        paddingRight: 15
    },
    cancelOrder: {
        width: 75,
        height: 30,
        borderRadius: 20,
        textAlign: 'center',
        lineHeight: 30,
        color: '#AAAAAA',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        fontSize: 12
    },
    pay: {
        width: 75,
        height: 30,
        borderRadius: 20,
        textAlign: 'center',
        lineHeight: 30,
        color: 'white',
        backgroundColor: '#E93323',
        fontSize: 12,
        marginLeft: 20
    },
    modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBtn: {
        flexDirection: 'row'
    },
    modalBtnItem: {
        width: '50%',
        height: 40,
        borderColor: '#EEEEEE',
        textAlign: 'center',
        borderWidth: 1,
        lineHeight: 40
    },
    addShoppingcartHint: {
        width: 200,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        backgroundColor: 'black',
        opacity: 0.7,
        color: 'white'
    },
    addShoppingcartModal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    payTypeModal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    backIcon: {
        position: 'absolute',
        right: 20,
        color: '#C8C9CC'
    },
    payTypeImage: {
        width: 19.2,
        height: 19.2
    },
    payTypeItem: {
        height: 56,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7F7'
    },
    payTypeItemText: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    payTypeText: {
        marginLeft: 15
    },
    payTypeTextItem: {
        color: '#999999',
        fontSize: 12
    },
    rightIcon: {
        marginRight: 15
    },
})

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(OrderDetail)