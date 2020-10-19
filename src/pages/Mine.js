import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { toObligationAction, toPendingAction, toReceivingAction } from '../store/order/orderActions';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';
import Feather from 'react-native-vector-icons/Feather';

class Mine extends Component {
    state = {
        showModal: false,
        promptModal: false
    }
    // 去商户管理页
    toMerchantManagement = (personInfo) => {
        this.props.navigation.navigate('MerchantManagement', { personInfo })
    }

    // 去订单详情页
    toOrderDetail = () => {
        this.props.toObligation()
        this.props.navigation.navigate('OrderInfo')
    }

    // 待付款
    toObligation = () => {
        this.props.toObligation()
        this.props.navigation.navigate('OrderInfo')
    }

    // 待发货
    toPending = () => {
        this.props.toPending()
        this.props.navigation.navigate('OrderInfo')
    }

    // 待收货
    toReceiving = () => {
        this.props.toReceiving()
        this.props.navigation.navigate('OrderInfo')
    }

    // 售后
    toAfterSale = () => {
        this.props.navigation.navigate('AfterSale')
    }

    // 管理我的账号
    toAccountManagement = () => {
        this.props.navigation.navigate('AccountManagement')
    }

    // 积分签到
    toIntegralSignIn = () => {
        this.setState({
            promptModal: true
        })
        // this.props.navigation.navigate('IntegralSignIn')
    }
    // 我的分期
    toMyStage = () => {
        this.props.navigation.navigate('MyStage')
    }
    // 我的推广
    toMyPromote = () => {
        this.props.navigation.navigate('MyPromote')
    }
    // 地址管理
    toMyAddress = () => {
        this.props.navigation.navigate('MyAddress')
    }
    // 余额
    balance = () => {
        this.props.navigation.navigate('Balance')
    }
    // 佣金
    yongjin = () => {
        this.props.navigation.navigate('MyPromote')
    }
    // 显示二维码
    showQR = () => {
        this.setState({ showModal: true })
    }
    // 订单核销
    toOrderVerification = () => {
        this.setState({
            promptModal: true
        })
    }
    // 会员中心
    vipCenter = () => [
        this.setState({
            promptModal: true
        })
    ]
    render() {
        const { type, personInfo } = this.props
        const { showModal, promptModal } = this.state
        console.log('商家信息', personInfo)
        return (
            <ScrollView 
                contentContainerStyle={{ backgroundColor: '#F5F5F5', alignItems: 'center', flexGrow: 1 }}
                >
                <ImageBackground source={require('../assets/img/mine/mine-bg7.png')}
                    style={{ width: '100%', resizeMode: "cover", height: 210, paddingTop:30 }}>
                    <View style={styles.personInfo}>
                        <View style={{ width: '100%', flexDirection: 'row', padding: 20, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image style={styles.headPhoto} source={{ uri: personInfo.avatar }} />
                                <View style={styles.detailInfo}>
                                    <Text style={{ color: 'white' }}>
                                        {type === 1 ? '用户' : '商家'}：
                                        {personInfo.nickname === '' ? '用户' + personInfo.uid : personInfo.nickname}
                                    </Text>
                                    <Text style={{ color: 'white' }}>
                                    {type === 1 
                                    ? personInfo.account.substr(0, 3) + '****' + personInfo.account.substr(personInfo.account.length - 4)
                                    : personInfo.accountNumber.substr(0, 3) + '****' + personInfo.accountNumber.substr(personInfo.accountNumber.length - 4)}
                                    </Text>
                                    {type === 1 ? null : <Text style={{color:'white'}}>商户性质：{personInfo.natureMerchant}</Text>}
                                </View>
                            </View>
                            <View style={styles.set}>
                                <Ionicons name='md-settings' size={24} color={'white'} onPress={this.toAccountManagement}></Ionicons>
                                {type === 1
                                    ? null
                                    : <TouchableOpacity onPress={this.showQR}>
                                        <Image source={require('../assets/img/QRcode.png')} style={{ width: 18, height: 18 }} />
                                    </TouchableOpacity>}
                            </View>
                            {/* 商家二维码 */}
                            <Modal
                                isVisible={showModal}
                                onBackdropPress={() => this.setState({ showModal: false })}
                                backdropOpacity={0.7}
                                style={styles.modal}
                                animationInTiming={20}
                                animationOutTiming={1}
                            >
                                <View style={{ width: 220, height: 220, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                                    <QRCode
                                        logo={personInfo.avatar}
                                        logoBorderRadius={2}
                                        logoMargin={3}
                                        logoBackgroundColor={'#eee'}
                                        logoSize={55}
                                        value={"https://www.bkysc.cn/storeDetail?id=" + personInfo.systemStoreId + "&enterId=" + personInfo.id}
                                        size={200}
                                    />
                                </View>
                            </Modal>
                        </View>
                        {
                            type === 1
                                ? <View style={styles.balance}>
                                    <View style={styles.balanceItem}>
                                        <TouchableOpacity onPress={this.balance}
                                            style={styles.balanceOpa}>
                                            <Text>我的余额 : </Text>
                                            <Text>{personInfo.nowMoney}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.balanceItem}>
                                        <TouchableOpacity onPress={this.yongjin}
                                            style={styles.balanceOpa}>
                                            <Text>当前佣金 : </Text>
                                            <Text>0</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                : <View style={styles.balance}>
                                    <View style={styles.mrchantBalanceItem}>
                                        <TouchableOpacity onPress={this.balance} style={styles.mercchantBalanceOpa}>
                                            <Text style={styles.balanceText}>我的余额 : </Text>
                                            <Text style={[{ fontSize: 18, fontWeight: 'bold' },styles.balanceText]}>{personInfo.nowMoney}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                        }

                    </View>
                </ImageBackground>

                <View style={styles.order}>
                    <View style={styles.orderTop}>
                        <Text style={{ fontSize: 14, fontWeight: 'bold'}}>我的订单</Text>
                        <TouchableOpacity onPress={this.toOrderDetail}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>全部</Text>
                                <Feather name="chevron-right" size={20} color={'#6B6B6B'} style={{ marginRight: 10 }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', height: 80 }}>
                        <TouchableOpacity onPress={this.toObligation} style={styles.orderItems}>
                            <View>
                                <Image source={require('../assets/img/mine/daifukuan.png')} style={styles.orderIcon} />
                            </View>
                            <Text>待付款</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.toPending} style={styles.orderItems}>
                            <View>
                                <Image source={require('../assets/img/mine/daifahuo.png')} style={styles.orderIcon} />
                            </View>
                            <Text>待发货</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.toReceiving} style={styles.orderItems}>
                            <View>
                                <Image source={require('../assets/img/mine/daishouhuo.png')} style={styles.orderIcon} />
                            </View>
                            <Text>待收货</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.toAfterSale} style={styles.orderItems}>
                            <View>
                                <Image source={require('../assets/img/mine/shouhou.png')} style={styles.orderIcon} />
                            </View>
                            <Text>售后</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{
                    backgroundColor: 'white', width: '96%',
                    marginTop: 10, flex: 1, borderRadius: 5
                }}>
                    <View style={styles.serve}>
                        <View style={styles.serveTitle}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>我的服务</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                            <View style={styles.serveItem}>
                                <TouchableOpacity onPress={this.toMyAddress}>
                                    <View style={styles.serveInside}>
                                        <Image source={require('../assets/img/mine/dzgl.png')} style={[styles.serveIcon]} />
                                        <Text>地址管理</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {type === 1
                                ? null
                                // <View style={styles.serveItem}>
                                //     <TouchableOpacity onPress={this.toIntegralSignIn}>
                                //         <View style={styles.serveInside}>
                                //             <Image source={require('../assets/img/mine/wdjf.png')} style={styles.serveIcon} />
                                //             <Text>我的积分</Text>
                                //         </View>
                                //     </TouchableOpacity>
                                // </View>
                                : <View style={styles.serveItem}>
                                    <TouchableOpacity onPress={() => this.toMerchantManagement(this.props.personInfo)}>
                                        <View style={styles.serveInside}>
                                            <Image source={require('../assets/img/mine/shgl.png')} style={styles.serveIcon} />
                                            <Text>商户管理</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                            {type === 1
                                ? <View style={styles.serveItem}>
                                    <TouchableOpacity onPress={this.toMyStage}>
                                        <View style={styles.serveInside}>
                                            <Image source={require('../assets/img/mine/wdfq.png')} style={styles.serveIcon} />
                                            <Text>我的分期</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null
                                // <View style={styles.serveItem}>
                                //     <TouchableOpacity onPress={this.vipCenter}>
                                //         <View style={styles.serveInside}>
                                //             <Image source={require('../assets/img/mine/hyzx.png')} style={styles.serveIcon} />
                                //             <Text>会员中心</Text>
                                //         </View>
                                //     </TouchableOpacity>
                                // </View>
                            }
                            {/* <View style={styles.serveItem}>
                                <TouchableOpacity onPress={this.toOrderVerification}>
                                    <View style={styles.serveInside}>
                                        <Image source={require('../assets/img/mine/ddhx.png')} style={styles.serveIcon} />
                                        <Text>订单核销</Text>
                                    </View>
                                </TouchableOpacity>
                            </View> */}
                            {type === 1
                                ? <View style={styles.serveItem}>
                                    <TouchableOpacity onPress={this.toMyPromote}>
                                        <View style={styles.serveInside}>
                                            <Image source={require('../assets/img/mine/wdtg.png')} style={styles.serveIcon} />
                                            <Text>我的推广</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                : null
                            }
                        </View>
                    </View>
                </View>
                {/* 未开放功能模块提示 */}
                <Modal
                    isVisible={promptModal}
                    // onBackdropPress={() => this.setState({ promptModal: false })}
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
                            <Text>该功能还未开启，敬请期待！</Text>
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    personInfo: {
        width: '100%',
        justifyContent: 'space-between',
        position: 'relative',
        height: 180,
        alignItems: 'center',
        marginBottom: 10
    },
    headPhoto: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        marginRight: 10
    },
    set: {
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    balance: {
        width: '96%',
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 5,
        overflow: 'hidden'
    },
    balanceItem: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        borderColor: '#D2D2D2'
    },
    mrchantBalanceItem: {
        height: 70,
        textAlign: 'center'
    },
    balanceOpa: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceText: {
        width: '50%',
        textAlign: 'center'
    },
    mercchantBalanceOpa: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    order: {
        backgroundColor: 'white',
        width: '96%',
        marginTop: 10,
        borderRadius: 5
    },
    orderTop: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        borderStyle: 'dashed',
        paddingLeft: 10
    },
    orderItems: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 60,
        color: '#999999',
        width: '20%',
        margin: '2.5%',
        marginBottom: 0
    },
    serveTitle: {
        height: 50, 
        justifyContent: 'center', 
        paddingLeft: 10, 
        borderColor: '#EEEEEE', 
        borderBottomWidth: 1
    },
    serveItem: {
        width: '20%',
        height: 80,
        borderRadius: 5,
        margin: '2.5%',
    },
    serveInside: {
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderIcon: {
        width: 18,
        height: 18
    },
    serveIcon: {
        width: 20,
        height: 40,
        resizeMode: 'contain'
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
    },
})

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        toObligation: () => dispatch(toObligationAction()),
        toPending: () => dispatch(toPendingAction()),
        toReceiving: () => dispatch(toReceivingAction())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Mine)