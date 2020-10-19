import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import { toObligationAction, toPendingAction, toReceivingAction } from '../../store/order/orderActions';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

class OrderInfo extends Component {
    state = {
        orderList: [],
        promptModal: false,
        delOrderId: '',
        delShow: false,
        hint: '订单删除成功',
        refreshing: true,
        orderType: 0,
        affirmModal: false,
        uni: null,
        agentLevel: null,
        cumulative: ''
    }
    // 获取订单
    getOrderList = type => {
        this.setState({
            orderType: type
        }, () => {
            axios({
                method: 'GET',
                url: `api/order/list?page=1&limit=200&type=${type}`
            })
                .then(res => {
                    this.setState({
                        orderList: res.data.data,
                        refreshing: false
                    })
                })
                .catch(err => {
                    console.log('查询订单列表失败', err)
                })
        })
    }
    componentDidMount() {
        storage.load({ key: 'agentLevel' })
            .then(ret => {
                this.setState({ agentLevel: ret })
            })
            .catch(err => {

            })
        this.getOrderList(0)
        this.getOrderData()
    }
    getOrderData = () => {
        console.log()
        axios({
            url: '/api/order/data',
            method: 'GET'
        })
            .then(res => {
                console.log(res)
                this.setState({
                    cumulative: res.data.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 售后
    AfterSale = () => {
        this.props.navigation.navigate('AfterSale')
    }
    // 待付款
    obligation = () => {
        this.getOrderList(0)
    }
    // 待发货
    pending = () => {
        this.getOrderList(1)
    }
    // 待收货
    receiving = () => {
        this.getOrderList(2)
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
        console.log('删除的订单id', this.state.delOrderId)
        axios({
            method: 'POST',
            url: '/api/order/cancel',
            data: {
                id: this.state.delOrderId
            }
        })
            .then(res => {
                // console.log('订单删除成功', res)
                this.setState({
                    promptModal: false,
                    hint: '订单删除成功',
                    delShow: true
                }, () => {
                    this.getOrderList(this.props.orderType)
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
                    this.getOrderList(this.props.orderType)
                    setTimeout(() => {
                        this.setState({
                            delShow: false
                        })
                    }, 1000)
                })
            })
    }
    // 订单详情
    toOrderDetail = id => {
        // 订单详情
        axios({
            method: 'GET',
            url: `/api/order/detail/${id}`
        })
            .then(res => {
                // console.log('订单详情', res.data.data)
                this.props.navigation.navigate('OrderDetail', { orderDetail: res.data.data })
            })
            .catch(err => {
                console.log('查询订单详情失败', err)
            })
    }
    onRefresh = () => {
        this.getOrderList(0)
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
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
                this.getOrderList(2)
                this.setState({ affirmModal: false })
            })
            .catch(err => {
                console.log('确认收货失败', err)
            })
    }
    render() {
        const { orderList, promptModal, delShow, hint, refreshing, orderType, affirmModal, agentLevel, cumulative } = this.state
        let dom
        if (orderList.length === 0) {
            dom = <View style={styles.NoAddress}>
                <Image source={require('../../assets/img/notInfo/orderInfoIsNot.png')} style={{ width: 150, height: 150 }}></Image>
            </View>
        } else {
            dom = orderList.map(item => {
                let addtime = Number(item.addTime)
                let date = new Date()
                let now = Math.floor(date.getTime() / 1000) - addtime
                let minutes = parseInt(now % 3600 / 60) + '分钟前'
                if (parseInt(now % 3600 / 60) <= 0) {
                    minutes = '1分钟内'
                }
                return (
                    <View key={item.id} style={styles.orderListItem}>
                        <View style={styles.orderTopInfo}>
                            <Text style={{ marginLeft: 20 }}>{minutes}</Text>
                            <Text style={{ marginRight: 20, color: '#E93323' }}>
                                {orderType === 0 ? '待付款' : null}
                                {orderType === 1 ? '待发货' : null}
                                {orderType === 2 ? '待收货' : null}
                                {orderType === 3 ? '待评价' : null}
                                {orderType === 4 ? '交易完成' : null}
                            </Text>
                        </View>

                        <View>
                            <TouchableOpacity onPress={() => this.toOrderDetail(item.orderId)}>
                                {item.cartInfo.map(cartItem => {
                                    let photo
                                    photo = cartItem.productInfo.image.split(',')[0]
                                    return (
                                        <View key={cartItem.id} style={styles.productInfo}>
                                            <Image source={{ uri: photo }} style={styles.productInfoImage} />
                                            <Text style={styles.productInfoName}>{cartItem.productInfo.storeName}</Text>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ color: '#9F9F9F' }}>￥{agentLevel === 4 ? cartItem.productInfo.price : cartItem.productInfo.vipPrice}</Text>
                                                <Text style={{ color: '#9F9F9F' }}>x{cartItem.cartNum}</Text>
                                            </View>
                                        </View>
                                    )
                                })}
                            </TouchableOpacity>

                            <View style={styles.total}>
                                <Text>共{item.totalNum}件商品，总金额</Text>
                                <Text style={{ color: '#E93323' }}>￥{item.totalPrice}</Text>
                            </View>
                        </View>
                        {orderType === 0
                            ? <View style={styles.orderButton}>
                                <Text style={styles.cancel} onPress={() => this.tooltip(item.orderId)}>取消订单</Text>
                                <Text style={styles.pay} onPress={() => this.toOrderDetail(item.orderId)}>查看详情</Text>
                            </View>
                            : null}
                        {orderType === 1
                            ? <View style={styles.orderButton}>
                                <Text style={styles.pay} onPress={() => this.toOrderDetail(item.orderId)}>查看详情</Text>
                            </View>
                            : null}
                        {orderType === 2
                            ? <View style={styles.orderButton}>
                                <Text style={styles.cancel} onPress={() => this.toOrderDetail(item.orderId)}>查看详情</Text>
                                <Text style={styles.pay} onPress={() => this.take(item.orderId)}>确认收货</Text>
                            </View>
                            : null}
                        {orderType === 3
                            ? <View style={styles.orderButton}>
                                <Text style={styles.pay} onPress={() => this.toOrderDetail(item.orderId)}>去评价</Text>
                            </View>
                            : null}
                    </View>
                )
            })
        }
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: '#f5f5f5', elevation: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        colors={['rgb(255, 176, 0)', "#ffb100"]}
                        onRefresh={() => this.onRefresh()}
                    />}>
                <View style={styles.header}>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                    <Text style={styles.headerTitle}>订单信息</Text>
                    <View style={{ width: 20 }}></View>
                </View>

                <View style={styles.expense}>
                    <Text style={{ color: 'white', margin: 10 }}>累计订单：{cumulative.orderCount}</Text>
                    <Text style={{ color: 'white' }}>总消费：{cumulative.sumPrice}</Text>
                </View>
                <ScrollView
                    contentContainerStyle={styles.orderType}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}>
                    <Text style={orderType === 0 ? styles.nowOrderType : styles.oldOrderType} onPress={() => this.getOrderList(0)}>待付款</Text>
                    <Text style={orderType === 1 ? styles.nowOrderType : styles.oldOrderType} onPress={() => this.getOrderList(1)}>待发货</Text>
                    <Text style={orderType === 2 ? styles.nowOrderType : styles.oldOrderType} onPress={() => this.getOrderList(2)}>待收货</Text>
                    <Text style={orderType === 3 ? styles.nowOrderType : styles.oldOrderType} onPress={() => this.getOrderList(3)}>待评价</Text>
                    <Text style={orderType === 4 ? styles.nowOrderType : styles.oldOrderType} onPress={() => this.getOrderList(4)}>交易完成</Text>
                    <Text style={styles.oldOrderType} onPress={this.AfterSale}>售后</Text>
                </ScrollView>
                <View style={{ flexGrow: 1 }}>
                    {dom}
                </View>
                {/* 取消订单提示 */}
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
                {/* 提示 */}
                <Modal
                    isVisible={affirmModal}
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
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    NoAddress: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },
    header: {
        width: '100%',
        height: 55,
        // borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#1195E3',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        zIndex: 999,
    },
    orderListItem: {
        backgroundColor: 'white',
        marginTop: 10
    },
    orderType: {
        height: 50,
        color: '#808080',
        backgroundColor: 'white',
    },
    nowOrderType: {
        width: 80,
        color: '#108EE9',
        borderBottomColor: '#1195E3',
        borderBottomWidth: 2,
        height: 48,
        lineHeight: 48,
        backgroundColor: 'white',
        textAlign: 'center'
    },
    oldOrderType: {
        width: 80,
        height: 48,
        lineHeight: 48,
        color: '#808080',
        textAlign: 'center'
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10
    },
    infoIsNot: {
        width: 170,
        height: 150
    },
    expense: {
        height: 80,
        backgroundColor: '#1195E3',
        flexDirection: 'row',
        alignItems: 'center'
    },
    orderTopInfo: {
        height: 36,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE'
    },
    productInfoImage: {
        width: 52,
        height: 52
    },
    productInfoName: {
        width: 130
    },
    productInfo: {
        height: 52,
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'space-between',
        marginBottom: 0
    },
    total: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE'
    },
    orderButton: {
        height: 46,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    cancel: {
        width: 75,
        height: 25,
        borderRadius: 12.5,
        textAlign: 'center',
        lineHeight: 25,
        color: '#AAAAAA',
        borderWidth: 1,
        borderColor: '#DDDDDD',
        fontSize: 12
    },
    pay: {
        width: 75,
        height: 25,
        borderRadius: 12.5,
        textAlign: 'center',
        lineHeight: 25,
        color: 'white',
        backgroundColor: '#E93323',
        fontSize: 12,
        margin: 20
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
        color: 'white',
        borderRadius: 5
    },
    addShoppingcartModal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1195E3',
        paddingTop: 30,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    headerLeft: {
        color: 'white',
    }
})

function mapStateToProps(state) {
    return {
        orderType: state.orderReducer.orderType,
        type: state.loginReducer.type
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toObligation: () => dispatch(toObligationAction()),
        toPending: () => dispatch(toPendingAction()),
        toReceiving: () => dispatch(toReceivingAction())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderInfo)