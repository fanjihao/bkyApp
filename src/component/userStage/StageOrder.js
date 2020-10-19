import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

class StageOrder extends Component {
    state = {
        showphoto: null,
        payMode: 'alipay',
        showModal: false,
        promptModal: false,
        payModal:true,
        remarks:''
    }
    componentDidMount() {
        const stageOrder = this.props.route.params.stageOrder
        const defaultPhoto = stageOrder.photo.split(',')[0]
        this.setState({ showphoto: defaultPhoto })
    }
    submitStageOrder = () => {
        if(this.state.payMode !== 'alipay') {
            this.setState({
                payModal:true
            })
        } else {
            const stageOrder = this.props.route.params.stageOrder
            let user = this.props.personInfo
            axios({
                url: '/api/userStages/addUserStages',
                method: "POST",
                data: {
                    "amount": stageOrder.prepaymentAmount,
                    "payType": this.state.payMode,
                    "phasesId": stageOrder.id,
                    "prepaymentAmount": stageOrder.prepaymentAmount,
                    "remarks": this.state.remarks,
                    "staffId": '',
                    "stagesNum": stageOrder.stagesNumber,
                    "stagesPrice": stageOrder.stagesPrice,
                    "storeId": stageOrder.storeId,
                    "type": 1,
                    "uid": user.uid,
                    "userName": user.username
                }
            })
                .then(res => {
                    console.log('分期订单创建成功', res)
                    this.setState({
                        promptModal: true
                    })
                })
                .catch(err => {
                    console.log('分期订单创建失败', err)
                })
        }
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
        this.setState({ payMode: 'bank' })
    }
    // 选择分期期数
    toCheckStage = () => {
        this.setState({ showModal: true })
    }
    goPayStage = () => {
        this.setState({
            promptModal: false
        }, () => {
            this.props.navigation.navigate('MyStage')
        })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { showphoto, payMode, showModal, promptModal, payModal, remarks } = this.state
        const stageOrder = this.props.route.params.stageOrder
        return (
            <View style={{ flex: 1, paddingBottom: 50, paddingTop:30 }}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>提交订单</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.stageOrderHeader}>
                        <Image source={{ uri: showphoto }} style={styles.stageOrderPhoto} />
                        <View style={styles.stageOrderInfo}>
                            <Text>{stageOrder.name}</Text>
                            <Text style={{ color: '#E90058' }}>￥{stageOrder.prepaymentAmount}</Text>
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 10, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>备注信息</Text>
                        <TextInput
                            placeholder='请输入备注信息'
                            multiline={true}
                            value={remarks}
                            onChangeText={text => this.setState({ remarks:text })}
                            style={{ textAlignVertical: 'top', height: 80, backgroundColor: '#F9F9F9', borderRadius: 5 }}
                        ></TextInput>
                    </View>

                    <View style={styles.stageCheck}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>分期选择</Text>
                        <TouchableOpacity style={styles.stageDetail}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{ marginLeft: 5 }}>￥ {stageOrder.stagesPrice}/期</Text>
                                <Text> , 共{stageOrder.stagesNumber}期</Text>
                                <Text style={{ color: '#E90058', marginLeft: 15 }}>免息</Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={{ marginTop: 5, color: '#B5B3B4' }}>首付款中包含第一期的价格</Text>
                    </View>

                    <View style={{ backgroundColor: 'white', padding: 10 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>支付方式</Text>
                        <View style={{ alignItems: 'center', margin: 10 }}>
                            {/* 微信支付 */}
                            <TouchableOpacity onPress={this.toWechat}>
                                <View style={payMode === 'wechat' ? styles.checkPayMode : styles.payMode}>
                                    <View style={styles.alipayMode}>
                                        <Image source={require('../../assets/img/channel/Wechat.png')} style={{ marginRight: 10 }}></Image>
                                        <Text style={payMode === 'wechat' ? styles.checkColor : styles.oldColor}>微信支付</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>微信支付</Text>
                                </View>
                            </TouchableOpacity>
                            {/* 余额支付
                            <TouchableOpacity onPress={this.toBalance}>
                                <View style={payMode === 'balance' ? styles.checkPayMode : styles.payMode}>
                                    <View style={styles.alipayMode}>
                                        <Text style={styles.balance}>￥</Text>
                                        <Text style={payMode === 'balance' ? styles.checkColor : styles.oldColor}>余额支付</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>可用余额：0</Text>
                                </View>
                            </TouchableOpacity> */}
                            {/* 支付宝支付 */}
                            <TouchableOpacity onPress={this.toAlipay}>
                                <View style={payMode === 'alipay' ? styles.checkPayMode : styles.payMode}>
                                    <View style={styles.alipayMode}>
                                        <Image source={require('../../assets/img/channel/Alipay.png')} style={{ marginRight: 10 }}></Image>
                                        <Text style={payMode === 'alipay' ? styles.checkColor : styles.oldColor}>支付宝支付</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>支付宝支付</Text>
                                </View>
                            </TouchableOpacity>
                            {/* 银联支付 */}
                            <TouchableOpacity onPress={this.toUnionpay}>
                                <View style={[payMode === 'bank' ? styles.checkPayMode : styles.payMode, { marginBottom: 0 }]}>
                                    <View style={styles.alipayMode}>
                                        <Image source={require('../../assets/img/channel/Unionpay.png')} style={{ marginRight: 10 }}></Image>
                                        <Text style={payMode === 'bank' ? styles.checkColor : styles.oldColor}>银联支付</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>银联支付</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
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
                                <Text>订单已生成，是否立即去付款</Text>
                            </View>
                            <View style={styles.modalBtn}>
                                <TouchableOpacity style={styles.modalcan} onPress={() => this.setState({ promptModal: false })}>
                                    <Text style={{ color: '#4EA4FB', }}>我再看看</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalcan, { borderLeftWidth: 1, borderColor: '#ccc' }]} onPress={this.goPayStage}>
                                    <Text style={{ color: '#4EA4FB', }}>去付款</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.stagePrice}>
                        <Text>分期总额</Text>
                        <Text style={{ color: '#E90058' }}>￥{stageOrder.price}</Text>
                    </View>

                </ScrollView>
                <View style={styles.flexBottom}>
                    <View style={{ flexDirection: 'row', marginLeft: 10 }}>
                        <Text>首付合计：</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#E90058' }}>￥</Text>
                            <Text style={{ color: '#E90058', fontSize: 18, fontWeight: 'bold', lineHeight: 20 }}>{stageOrder.prepaymentAmount}</Text>
                        </View>
                    </View>
                    <Text style={styles.orderSubmit} onPress={this.submitStageOrder}>提交订单</Text>
                </View>

                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => this.setState({ showModal: false })}
                    backdropOpacity={0.5}
                    style={styles.showModal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={styles.stageModal}>
                        <View style={styles.stageModalHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#E90058' }}>合计：</Text>
                                <Text style={{ color: '#E90058', margin: 5 }}>￥500.00</Text>
                                <Text style={{ color: '#E90058' }}>免息</Text>
                            </View>
                            <Feather name="x" size={20} />
                        </View>

                        <View style={{ height: 150 }}></View>

                        <Text style={styles.stageSubmit}>确定分期</Text>
                    </View>
                </Modal>
                <Modal
                    isVisible={payModal}
                    backdropOpacity={0.5}
                    style={styles.paymodal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '90%', height: 180, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '25%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>由于第三方原因，</Text>
                            <Text>目前只支持支付宝支付呢！</Text>
                        </View>
                        <TouchableOpacity style={styles.paymodalBtn} onPress={() => this.setState({ payModal: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    paymodal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    paymodalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#eee'
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
    stageOrderPhoto: {
        width: 50,
        height: 50,
        marginRight: 10
    },
    stageOrderHeader: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        marginBottom: 10
    },
    stageOrderInfo: {
        height: 50,
        justifyContent: 'space-evenly'
    },
    stageCheck: {
        padding: 10,
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10
    },
    stageDetail: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F1F4F4',
        height: 40,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    checkColor: {
        color: '#E93323'
    },
    oldColor: {
        color: '#282828'
    },
    payMode: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 45,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        width: '100%',
        marginBottom: 10
    },
    checkPayMode: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 45,
        borderWidth: 1,
        borderColor: '#FC5445',
        width: '100%',
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
    },
    stagePrice: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20
    },
    flexBottom: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6'
    },
    orderSubmit: {
        width: 100,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E90058',
        lineHeight: 40,
        textAlign: 'center',
        color: 'white',
        margin: 5,
        marginRight: 10
    },
    showModal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    stageModal: {
        backgroundColor: 'white',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15
    },
    stageModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },
    stageSubmit: {
        height: 40,
        backgroundColor: '#1196E4',
        color: 'white',
        lineHeight: 40,
        textAlign: 'center'
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

function mapStateToProps(state) {
    return {
        personInfo: state.userReducer.personInfo
    }
}
export default connect(mapStateToProps)(StageOrder)