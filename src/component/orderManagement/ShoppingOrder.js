import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Image, ScrollView, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

class ShoppingOrder extends Component {
    state = {
        goodsInfo: [],
        address: [],
        payType: 'alipay',
        orderList: this.props.route.params.getOrderList,
        showTips: false,
        showAdd: false,
        checkedAdd: {
            name: '',
            phone: '',
            address: '',
            id: ''
        },
        promptModal: false,
        shopOrderModal: false,
        newTotal:'',
        level:''
    }
    // 挂载完毕获取数据
    componentDidMount() {
        this.setState({
            level:this.props.personInfo.agentLevel
        }, () => {
            this.toChange(0)
            let key = this.props.route.params.orderInfo.orderKey
            axios({
                url: `/api/order/computed/${key}`,
                method: 'POST',
                data: {
                    useIntegral: 0,
                    couponId: 0,
                    shipping_type: 1
                }
            })
                .then(res => {
                    console.log('计算金额====', res.data.data.result.totalPrice)
                    this.setState({
                        newTotal:res.data.data.result.totalPrice
                    })
                })
                .catch(err => {
                    console.log('订单创建失败', err)
                })
        })
    }

    setType = (type) => {
        this.setState({
            payType: type,
        })
    }
    toAdd = () => {
        this.props.navigation.navigate('MyAddress')
    }
    toChange = (i) => {
        axios({
            url: '/api/address/list',
            method: 'GET'
        })
            .then(res => {
                if(i === 0) {
                    let address = res.data.data.filter(item => item.isDefault === 1)
                    if(address) {
                        this.setState({
                            checkedAdd: {
                                name: address[0].realName,
                                phone: address[0].phone,
                                address: address[0].province + address[0].city + address[0].district + address[0].detail,
                                id: address[0].id
                            }
                        })
                    }
                } else {
                    this.setState({
                        showAdd: true,
                        address: res.data.data
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    SureExchange = () => {
        const { checkedAdd } = this.state
        if (checkedAdd.name === '') {
            this.setState({
                promptModal: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        promptModal: false
                    })
                }, 1000)
            })
        } else {
            let key = this.props.route.params.orderInfo.orderKey
            axios({
                url: '/api/order/create/' + key,
                method: 'POST',
                data: {
                    addressId: this.state.checkedAdd.id,
                    useIntegral: 0,
                    couponId: 0,
                    payType: this.state.payType,
                    pinkId: 0,
                    from: "weixinh5",
                    shippingType: 1,
                    isRemind:1
                }
            })
                .then(res => {
                    console.log('订单创建成功', res)
                    this.setState({
                        shopOrderModal: true
                    })
                })
                .catch(err => {
                    console.log('订单创建失败', err)
                })
        }
    }
    goPayStage = () => {
        this.setState({
            shopOrderModal: false
        })
        this.props.navigation.navigate('OrderInfo')
    }
    showTips = () => {
        this.setState({
            showTips: true
        })
    }
    chooseAdd = (item) => {
        this.setState({
            showAdd: false,
            checkedAdd: {
                name: item.realName,
                phone: item.phone,
                address: item.province + item.city + item.district + item.detail,
                id: item.id
            }
        })
    }
    toAddress = () => {
        this.setState({
            showAdd: false
        }, () => {
            this.props.navigation.navigate('MyAddress')
        })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { address, payType, orderList, showTips, showAdd, checkedAdd, promptModal, shopOrderModal, 
            newTotal, level } = this.state
        let addressDom
        if (address.length === 0) {
            addressDom =
                <View style={styles.NoAddress}>
                    <Image source={require('../../assets/img/notInfo/noaddress.png')} style={{ width: 150, height: 150 }}></Image>
                </View>
        } else {
            addressDom = address.map(item => {
                return (
                    <TouchableOpacity style={styles.modalAddlist} key={item.id} onPress={() => this.chooseAdd(item)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%', justifyContent: 'space-between' }}>
                            <Feather name='map-pin' size={18} style={item.id === checkedAdd.id ? styles.redAdd : null}></Feather>
                            <View style={{ width: '80%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[styles.addressFont, item.id === checkedAdd.id ? styles.redAdd : null]}>{item.realName}</Text>
                                    <Text style={[styles.addressFont, item.id === checkedAdd.id ? styles.redAdd : null]}>{item.phone}</Text>
                                </View>
                                <Text style={[styles.addressFont, item.id === checkedAdd.id ? styles.redAdd : null]}>{item.province}{item.city}{item.district}{item.detail}</Text>
                            </View>
                        </View>
                        <Feather name='check-circle' size={18} style={item.id === checkedAdd.id ? styles.redAdd : null}></Feather>
                    </TouchableOpacity>
                )
            })
        }
        let postage = 0
        orderList.map(item => {
            postage = postage + item.productInfo.postage
        })
        return (
            <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1, width: '100%', backgroundColor: '#F5F5F5' }}>
                    <View style={{ width: '100%', overflow: 'hidden', height: 200, position: 'relative', marginBottom: 10 }}>
                        <View style={styles.header}>
                            <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                            <Text style={styles.headerTitle}>确认订单</Text>
                            <View style={{width:20}}></View>
                        </View>
                        <View style={styles.detailImg}>
                            <View style={styles.kuaidi}>
                                <View style={{ width: '100%', flexDirection: 'row' }}>
                                    <TouchableOpacity style={styles.kuaidiTabkuai} >
                                        <Text style={{ color: '#1195E3' }}>快递配送</Text>
                                    </TouchableOpacity>
                                    {/* <TouchableOpacity
                                        style={[styles.kuaidiTab, { backgroundColor: '#D5E5E5' }]}
                                        onPress={this.showTips}>
                                        <Text style={{ color: '#1195E3' }}>到店自提</Text>
                                    </TouchableOpacity> */}
                                </View>
                                <View style={{ width: '100%' }}>
                                    <TouchableOpacity onPress={() => this.toChange(1)} style={styles.DefaultAddress}>
                                        {checkedAdd.name === ''
                                            ? <Text style={{ fontSize: 14 }}>设置收货地址</Text>
                                            :
                                            <View style={{ width: '80%' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={styles.otherFont}>{checkedAdd.name}</Text>
                                                    <Text style={styles.otherFont}>{checkedAdd.phone}</Text>
                                                </View>
                                                <Text style={styles.addressFont}>{checkedAdd.address}</Text>
                                            </View>}
                                        <Feather name='chevron-right' size={20} color={'#848484'}></Feather>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <Modal
                            isVisible={showTips}
                            onBackdropPress={() => this.setState({ showTips: false })}
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
                                    <Text>暂无门店信息，您无法到店自提！</Text>
                                </View>
                                <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ showTips: false })}>
                                    <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                    <View style={{ flex: 1, width: '98%', marginBottom: 10, backgroundColor: 'white' }}>
                        <View style={{ width: '100%', height: 50, justifyContent: 'center', paddingLeft: 20, borderBottomColor: '#EEEEEE', borderBottomWidth: 1 }}>
                            <Text>共{orderList.length}件商品</Text>
                        </View>
                        {orderList.map(item => {
                            console.log(this.props.personInfo, 'peosoninfo==========')
                            let img = item.productInfo.image.split(',')[0]
                            return (
                                <View style={styles.orderList} key={item.id}>
                                    <View style={styles.SEgoodsInfo}>
                                        <Image source={{ uri: img }} style={{ width: 100, height: 100, backgroundColor: '#ccc' }}></Image>
                                        <View style={{ width: '50%', height: 100, justifyContent: 'space-evenly' }}>
                                            <Text style={{ fontWeight: 'bold' }}>{item.productInfo.storeName}</Text>
                                            <Text style={{ fontWeight: 'bold' }}>x{item.cartNum}</Text>
                                        </View>
                                        {level === 4 ? <Text>￥{item.cartNum * item.productInfo.price}</Text>
                                        : <Text>￥{item.cartNum * item.productInfo.vipPrice}</Text>}
                                    </View>
                                    <View style={styles.childLine}></View>
                                </View>
                            )
                        })}
                    </View>
                    <View style={{ width: '100%', height: 200, backgroundColor: 'white', marginBottom: 10 }}>
                        <View style={styles.youhuiInfo}>
                            <Text>快递费用</Text>
                            <Text style={{ color: '#ccc' }}>
                                {postage === 0 ? '免运费' : postage}
                            </Text>
                        </View>
                        <View style={{ width: '100%', paddingLeft: 10, paddingRight: 10 }}>
                            <View style={{ justifyContent: 'center', height: 50 }}>
                                <Text>备注信息</Text>
                            </View>
                            <TextInput
                                placeholder='请添加备注（150字以内）'
                                multiline={true}
                                style={{ textAlignVertical: 'top', height: 80, backgroundColor: '#F9F9F9' }}></TextInput>
                        </View>
                    </View>
                    <View style={{ width: '100%', backgroundColor: 'white', marginBottom: 10 }}>
                        <View style={{ justifyContent: 'center', height: 50, marginLeft: 10 }}>
                            <Text>支付方式</Text>
                        </View>
                        {/* <View style={styles.typeTop}>
                            <TouchableOpacity onPress={() => this.setType('balance')}
                                style={[styles.typeTopChild, payType === 'balance' ? styles.checkedPay : null]}>
                                <View style={styles.insideChild}>
                                    <View style={styles.payleft}>
                                        <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../../assets/img/channel/Balance.png')} style={{ resizeMode: 'contain' }}></Image>
                                        </View>
                                        <Text style={payType === 'balance' ? styles.checkedPay : styles.nomalPay}>余额支付</Text>
                                    </View>
                                    <View style={{ height: 20, borderLeftWidth: 1, borderColor: '#aaa' }}></View>
                                    <Text style={{ color: '#aaa' }}>钱包余额支付</Text>
                                </View>
                            </TouchableOpacity>
                        </View> */}
                        <View style={styles.typeTop}>
                            <TouchableOpacity onPress={() => this.setType('wechat')}
                                style={[styles.typeTopChild, payType === 'wechat' ? styles.checkedPay : null]}>
                                <View style={styles.insideChild}>
                                    <View style={styles.payleft}>
                                        <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../../assets/img/channel/Wechat.png')} style={{ resizeMode: 'contain' }}></Image>
                                        </View>
                                        <Text style={payType === 'wechat' ? styles.checkedPay : styles.nomalPay}>微信支付</Text>
                                    </View>
                                    <View style={{ height: 20, borderLeftWidth: 1, borderColor: '#aaa' }}></View>
                                    <Text style={{ color: '#aaa' }}>微信快捷支付</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.typeTop}>
                            <TouchableOpacity onPress={() => this.setType('alipay')}
                                style={[styles.typeTopChild, payType === 'alipay' ? styles.checkedPay : null]}>
                                <View style={styles.insideChild}>
                                    <View style={styles.payleft}>
                                        <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../../assets/img/channel/Alipay.png')} style={{ resizeMode: 'contain' }}></Image>
                                        </View>
                                        <Text style={payType === 'alipay' ? styles.checkedPay : styles.nomalPay}>支付宝支付</Text>
                                    </View>
                                    <View style={{ height: 20, borderLeftWidth: 1, borderColor: '#aaa' }}></View>
                                    <Text style={{ color: '#aaa' }}>支付宝快捷支付</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.typeTop}>
                            <TouchableOpacity onPress={() => this.setType('bank')}
                                style={[styles.typeTopChild, payType === 'bank' ? styles.checkedPay : null]}>
                                <View style={styles.insideChild}>
                                    <View style={styles.payleft}>
                                        <View style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={require('../../assets/img/channel/Unionpay.png')} style={{ resizeMode: 'contain' }}></Image>
                                        </View>
                                        <Text style={payType === 'bank' ? styles.checkedPay : styles.nomalPay}>银联支付</Text>
                                    </View>
                                    <View style={{ height: 20, borderLeftWidth: 1, borderColor: '#aaa' }}></View>
                                    <Text style={{ color: '#aaa' }}>银联快捷支付</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.finalyTotal}>
                        <Text>商品总价：</Text>
                        <Text>￥{newTotal}</Text>
                    </View>
                </ScrollView>
                <View style={styles.fixedFoot}>
                    <View style={{ width: '30%', backgroundColor: 'white', justifyContent: 'space-evenly', alignItems: 'flex-end', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 12 }}>合计:</Text>
                        <Text style={{ fontSize: 16, color: 'red' }}>￥{newTotal}</Text>
                    </View>
                    <TouchableHighlight onPress={this.SureExchange} style={styles.rightExchange}>
                        <Text style={{ color: 'white' }}>提交订单</Text>
                    </TouchableHighlight>
                </View>
                <Modal
                    isVisible={shopOrderModal}
                    onBackdropPress={() => this.setState({ shopOrderModal: false })}
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
                            <Text>订单已生成，是否立即去付款</Text>
                        </View>
                        <View style={styles.modalBtn}>
                            <TouchableOpacity style={styles.modalcan} onPress={() => this.setState({ shopOrderModal: false })}>
                                <Text style={{ color: '#4EA4FB', }}>我再看看</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalcan, { borderLeftWidth: 1, borderColor: '#ccc' }]} onPress={this.goPayStage}>
                                <Text style={{ color: '#4EA4FB', }}>去付款</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={promptModal}
                    backdropOpacity={0}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <Text style={styles.tips}>您还未选择地址，请先选择！</Text>
                </Modal>
                <Modal
                    isVisible={showAdd}
                    onBackdropPress={() => this.setState({ showAdd: false })}
                    backdropOpacity={0.2}
                    style={styles.Addmodal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '100%', height: 300, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center', paddingBottom: 10 }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItem: 'center', padding: 20 }}>
                            <View style={{ width: 10 }}></View>
                            <Text>选择地址</Text>
                            <Feather name='x' size={16}></Feather>
                        </View>
                        <ScrollView contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}>
                            {addressDom}
                        </ScrollView>
                        <TouchableOpacity style={styles.modalJiaAdd} onPress={this.toAddress}>
                            <Text style={{ color: 'white' }}>添加一个新地址</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}
export default connect(mapStateToProps)(ShoppingOrder)

const styles = StyleSheet.create({
    kuaidiTabkuai: {
        margin:10
    },
    modalcan: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    modalJiaAdd: {
        width: '90%',
        height: 40,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    tips: {
        width: 250,
        height: 50,
        backgroundColor: 'black',
        opacity: 0.7,
        textAlign: 'center',
        lineHeight: 50,
        color: 'white',
        borderRadius: 10
    },
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
        justifyContent: 'space-between',
        borderColor: '#ccc'
    },
    modalcan: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    Addmodal: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        margin: 0,
    },
    modalAddlist: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20
    },
    redAdd: {
        color: 'red'
    },
    kuaidi: {
        width: '94%',
        backgroundColor: 'white',
    },
    youhuiInfo: {
        width: '100%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE'
    },
    kuaidiTab: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE'
    },
    detailImg: {
        width: '100%',
        height: 200,
        backgroundColor: '#1195E3',
        position: 'absolute',
        bottom: 0,
        left: 0,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    fixedFoot: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 20,
        backgroundColor: 'white'
    },
    rightExchange: {
        backgroundColor: 'red',
        width: '30%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    NoAddress: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
        // borderWidth: 1
    },
    DefaultAddress: {
        padding: 10,
        flexDirection: 'row',
        // height: 70,
        width: '100%',
        justifyContent: 'space-between',
        // borderColor: '#b1b1b1',
        alignItems: 'center',
        paddingTop: 0
    },
    addressFont: {
        color: '#B1B1B1',
        marginRight: 5,
        fontSize:13
    },
    otherFont: {
        color: 'black',
        marginRight: 5,
        fontWeight: 'bold',
        fontSize:15
    },
    SEgoodsInfo: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
    },
    childLine: {
        // borderBottomWidth: 1,
        borderColor: '#b1b1b1',
        width: '90%'
    },
    heji: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center'
    },
    typeTop: {
        height: 60,
        width: '100%',
        alignItems: 'center',
        borderColor: '#ccc',
    },
    typeTopChild: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        width: '94%',
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 5
    },
    insideChild: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    payleft: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%'
    },
    orderList: {
        width: '100%',
        justifyContent: 'space-between',
        borderColor: '#b1b1b1',
        alignItems: 'center'
    },
    checkedPay: {
        color: '#E93323',
        borderColor: '#E93323'
    },
    nomalPay: {
        color: '#666'
    },
    finalyTotal: {
        width: '100%',
        backgroundColor: 'white',
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    header: {
        width: '100%',
        height: 70,
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 999,
        paddingTop:30,
        paddingLeft:10,
        paddingRight:10,
        flexDirection:'row',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white'
    },
    headerLeft: {
        color: 'white'
    }
})