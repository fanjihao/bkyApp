import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
// import Swiper from 'react-native-swiper';
import { Dimensions } from 'react-native';
import { unitWidth, unitHeight } from '../utils/AdapterUtil';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

export default class Channel extends Component {
    state = {
        level: 1,
        data: {
            level: '一级渠道商',
            price: '50,000',
            commission: '2500+1.5%提成',
            levelDriect: '100家店铺推广权售5万元（单价500元，可享奖励金2500元），并享有推广店铺内业绩流水1.5%提成。固定当前等级，101家以后可以单家购买，价格仍为500元每家（享奖励2500元），且享有原有待遇。'
        },
        showModal: false,
        payType: "alipay",
        payTypeModal: false,
        nowLevel: '',
        // 用户个人信息
        personInfo: {
            account: '',
            username: '',
            nickname: '',
            avatar: null,
            level: ''
        },
        refreshing: true,
    }
    // 获取用户个人中心信息
    getPersonInfo = () => {
        axios({
            method: 'GET',
            url: '/api/user'
        })
            .then(res => {
                console.log('获取用户个人信息成功', res.data.data)
                this.setState({
                    ...this.state,
                    personInfo: {
                        account: res.data.data.account,
                        username: res.data.data.username,
                        nickname: res.data.data.nickname,
                        avatar: res.data.data.avatar,
                        level: res.data.data.level
                    },
                    refreshing: false
                }, () => {
                    const { personInfo } = this.state
                    let nowLevel
                    if(personInfo.level === 0) {
                        nowLevel = '普通用户'
                    } else if(personInfo.level === 4) {
                        nowLevel = '普通合伙人'
                    } else if(personInfo.level === 3) {
                        nowLevel = '三级渠道商'
                    } else if(personInfo.level === 2) {
                        nowLevel = '二级渠道商'
                    } else {
                        nowLevel = '一级渠道商'
                    }
                    this.setState({
                        nowLevel
                    })
                })
            })
            .catch(err => {
                console.log('获取用户个人信息失败', err)
            })
    }
    componentDidMount() {
        this.getPersonInfo()
    }
    toMyPromote = () => {
        this.props.navigation.navigate('MyPromote')
    }
    siMeasure = () => {
        var { width } = Dimensions.get('window')
        let windowWidth = width / 3
        let oWidth = width
        this.refs.putong.measure((x, y, width, height, left, top) => {
            if (left < oWidth / 2) {
                this.refs.scrolls.scrollTo({ x: -windowWidth, y: 0, animated: true })
                this.otherLevel(1)
            }
        })
    }
    sanMeasure = () => {
        var { width } = Dimensions.get('window')
        let windowWidth = width / 3
        let oWidth = width
        this.refs.sanji.measure((x, y, width, height, left, top) => {
            if (left > oWidth / 2) {
                this.refs.scrolls.scrollTo({ x: windowWidth, y: 0, animated: true })
            } else if (left < oWidth / 2) {
                this.refs.scrolls.scrollTo({ x: windowWidth, y: 0, animated: true })
            }
            this.otherLevel(2)
        })
    }
    erMeasure = () => {
        var { width } = Dimensions.get('window')
        let windowWidth = width / 3
        let oWidth = width
        this.refs.erji.measure((x, y, width, height, left, top) => {
            if (left > oWidth / 2) {
                this.refs.scrolls.scrollTo({ x: 2 * windowWidth, y: 0, animated: true })
            } else if (left < oWidth / 2) {
                this.refs.scrolls.scrollTo({ x: 2 * windowWidth, y: 0, animated: true })
            }
            this.otherLevel(3)
        })
    }
    yiMeasure = () => {
        var { width } = Dimensions.get('window')
        let windowWidth = width / 3
        let oWidth = width
        this.refs.yiji.measure((x, y, width, height, left, top) => {
            if (left > oWidth / 2) {
                this.refs.scrolls.scrollTo({ x: 3 * windowWidth, y: 0, animated: true })
            }
            this.otherLevel(4)
        })
    }
    showMeasure = () => {
        var { width } = Dimensions.get('window')
        let oWidth = width
        this.refs.putong.measure((x, y, width, height, left, top) => {
            if (left > oWidth / 3 && left < oWidth / 2) {
                this.otherLevel(1)
            }
        })
        this.refs.sanji.measure((x, y, width, height, left, top) => {
            if (left > oWidth / 3 && left < oWidth / 2) {
                this.otherLevel(2)
            }
        })
        this.refs.erji.measure((x, y, width, height, left, top) => {
            if (left > oWidth / 3 && left < oWidth / 2) {
                this.otherLevel(3)
            }
        })
        this.refs.yiji.measure((x, y, width, height, left, top) => {
            if (left > oWidth / 3 && left < oWidth / 2) {
                this.otherLevel(4)
            }
        })
    }
    layout = (e) => { console.log(e) }
    scrollIng = () => {
        this.showMeasure()
    }
    otherLevel = (l) => {
        let proporData
        if (l === 4) {
            proporData = {
                level: '普通合伙人',
                commission: '500-1000元',
                price: '3,000',
                levelDriect: '普通合伙人邀请新用户注册成为博客云商家，推广成功 1 家平台奖励500元，不享有门店流水提成。套餐内有1家单店推广资格，推完为止。'
            }
        } else if (l === 3) {
            proporData = {
                level: '三级渠道商',
                price: '10,000',
                commission: '1000+0.5%提成',
                levelDriect: '三级合伙人邀请新用户注册成为博客云商家，每推广1家奖励1000元，并享有名下推广门店月营业总额0.5%的提成。套餐内有5家单店推广资格，推完为止。'
            }
        } else if (l === 2) {
            proporData = {
                level: '二级渠道商',
                commission: '2000+1%提成',
                price: '20,000',
                levelDriect: '二级合伙人邀请新用户注册成为博客云商家，每推广1家奖励2000元，并享有名下推广门店月营业总额1%的提成。套餐内有20家单店推广资格，推完为止。'
            }
        } else if (l === 1) {
            proporData = {
                level: '一级渠道商',
                price: '50,000',
                commission: '2500+1.5%提成',
                levelDriect: '100家店铺推广权售5万元（单价500元，可享奖励金2500元），并享有推广店铺内业绩流水1.5%提成。固定当前等级，101家以后可以单家购买，价格仍为500元每家（享奖励2500元），且享有原有待遇。'
            }
        }
        this.setState({
            data: proporData,
            level: l
        }, () => {
            console.log(this.state.level)
        })
    }
    clickRound = (i) => {
        if (i === 4) {
            this.siMeasure()
        } else if (i === 3) {
            this.sanMeasure()
        } else if (i === 2) {
            this.erMeasure()
        } else {
            this.yiMeasure()
        }
    }
    toPay = () => {
        this.setState({
            showModal: true
        })
    }
    toBack = () => {
        this.setState({
            showModal: true,
            payTypeModal: false
        })
    }
    payType = () => {
        this.setState({
            showModal: false,
            payTypeModal: true
        })
    }
    setType = (type) => {
        this.setState({
            payType: type,
            showModal: true,
            payTypeModal: false
        })
    }
    nowPay = () => {
        axios({
            url: '/api/userStages/channelBusiness',
            method: 'POST',
            data: {
                grade: this.state.level,
                payType: this.state.payType
            }
        })
            .then(res => {
                this.setState({
                    showModal: false,
                    payTypeModal: false,
                })
                this.props.navigation.navigate('PayPage', { dom: res.data.data })
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 下拉刷新
    onRefresh = () => {
        this.getPersonInfo()
    }
    render() {
        const { data, showModal, payTypeModal, payType, nowLevel, personInfo, refreshing, level } = this.state
        var { width } = Dimensions.get('window')
        let typeDom
        // if (payType === 'balance') {
        //     typeDom = <Text style={{ fontSize: 16 }}>余额支付</Text>
        // } else 
        if (payType === 'alipay') {
            typeDom = <Text style={{ fontSize: 16 }}>支付宝支付</Text>
        } else if (payType === 'wechat') {
            typeDom = <Text style={{ fontSize: 16 }}>微信支付</Text>
        } else {
            typeDom = <Text style={{ fontSize: 16 }}>银联支付</Text>
        }
        return (
            <ScrollView
                contentContainerStyle={{ alignItems: 'center', width: unitWidth * 375, backgroundColor: 'white', flexGrow: 1, paddingTop: 30 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        colors={['rgb(255, 176, 0)', "#ffb100"]}
                        onRefresh={() => this.onRefresh()}
                    />
                }>
                <View style={styles.header}>
                    <View style={{ width: 60, height: 30 }}></View>
                    <Text style={{ fontSize: 18 }}>渠道商</Text>
                    <Text style={{ fontSize: 16 }} onPress={this.toMyPromote}>我的推广</Text>
                </View>
                <Modal
                    isVisible={payTypeModal}
                    onBackdropPress={() => this.setState({ payTypeModal: false, showModal: true })}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ backgroundColor: 'white' }}>
                        <Text style={{ margin: 15, textAlign: 'left' }}>支付方式</Text>
                        <View style={{ alignItems: 'center', margin: 10 }}>
                            <TouchableOpacity onPress={() => this.setType('wechat')}>
                                <View style={payType === 'wechat' ? styles.checkPayMode : styles.payMode}>
                                    <View style={styles.alipayMode}>
                                        <Image source={require('../assets/img/channel/Wechat.png')} style={{ marginRight: 10 }}></Image>
                                        <Text style={payType === 'wechat' ? styles.checkColor : styles.oldColor}>微信支付</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>微信支付</Text>
                                </View>
                            </TouchableOpacity>
                            {/* <TouchableOpacity onPress={() => this.setType('balance')}>
                                <View style={payType === 'balance' ? styles.checkPayMode : styles.payMode}>
                                    <View style={styles.alipayMode}>
                                        <Text style={styles.balance}>￥</Text>
                                        <Text style={payType === 'balance' ? styles.checkColor : styles.oldColor}>余额支付</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>可用余额：0</Text>
                                </View>
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => this.setType('alipay')}>
                                <View style={payType === 'alipay' ? styles.checkPayMode : styles.payMode}>
                                    <View style={styles.alipayMode}>
                                        <Image source={require('../assets/img/channel/Alipay.png')} style={{ marginRight: 10 }}></Image>
                                        <Text style={payType === 'alipay' ? styles.checkColor : styles.oldColor}>支付宝</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>支付宝支付</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setType('unionpay')}>
                                <View style={payType === 'unionpay' ? styles.checkPayMode : styles.payMode}>
                                    <View style={styles.alipayMode}>
                                        <Image source={require('../assets/img/channel/Unionpay.png')} style={{ marginRight: 10 }}></Image>
                                        <Text style={payType === 'unionpay' ? styles.checkColor : styles.oldColor}>银联</Text>
                                    </View>
                                    <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                                    <Text style={styles.hint}>银联支付</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={styles.distributor}>
                    <View style={styles.chanTopMark}>
                        <Text style={{ color: 'white' }}>{nowLevel}</Text>
                    </View>
                    <View style={styles.chanTopLeftInfo}>
                        <Image source={{ uri: personInfo.avatar }} style={styles.headImg} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{color:'white'}}>{personInfo.nickname}</Text>
                            <Text style={{color:'white'}}>{personInfo.account.substr(0, 3) + '****' + personInfo.account.substr(personInfo.account.length - 4)}</Text>
                        </View>
                    </View>
                    <View style={styles.scrollBox}>
                        <ScrollView
                            onMomentumScrollEnd={this.scrollIng}
                            contentContainerStyle={styles.scrollStyle}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            snapToAlignment='center'
                            snapToInterval={width / 3}
                            decelerationRate={0.5}
                            ref='scrolls'>
                            <View style={{ width: 50, height: 50, opacity: 1 }}></View>
                            <TouchableOpacity onPress={() => this.clickRound(4)}>
                                <View
                                    ref="putong"
                                    onLayout={({ nativeEvent: e }) => this.layout(e)}
                                    style={styles.scrollItemBtn}>
                                    <View style={styles.levelBtn}>
                                        {level === 1 ? <View style={styles.insideBtn}></View> : null}
                                        <Text style={[{ position: 'absolute', bottom: -30, left: -20, width: 75 }, level === 1 ? {color:'white'} :{color:'black'}]}>一级渠道商</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.clickRound(3)}>
                                <View
                                    ref="sanji"
                                    onLayout={({ nativeEvent: e }) => this.layout(e)}
                                    style={styles.scrollItemBtn}>
                                    <View style={styles.levelBtn}>
                                        {level === 2 ? <View style={styles.insideBtn}></View> : null}
                                        <Text style={[{ position: 'absolute', bottom: -30, left: -20, width: 75 }, level === 2 ? {color:'white'} :{color:'black'}]}>二级渠道商</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.clickRound(2)}>
                                <View
                                    ref="erji"
                                    onLayout={({ nativeEvent: e }) => this.layout(e)}
                                    style={styles.scrollItemBtn}>
                                    <View style={styles.levelBtn}>
                                        {level === 3 ? <View style={styles.insideBtn}></View> : null}
                                        <Text style={[{ position: 'absolute', bottom: -30, left: -20, width: 75 }, level === 3 ? {color:'white'} :{color:'black'}]}>三级渠道商</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.clickRound(1)}>
                                <View
                                    ref="yiji"
                                    onLayout={({ nativeEvent: e }) => this.layout(e)}
                                    style={styles.scrollItemBtn}>
                                    <View style={styles.levelBtn}>
                                        {level === 4 ? <View style={styles.insideBtn}></View> : null}
                                        <Text style={[{ position: 'absolute', bottom: -30, left: -20, width: 75 }, level === 4 ? {color:'white'} :{color:'black'}]}>普通合伙人</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: 50, height: 50, opacity: 1 }}></View>
                            <View style={{
                                position: 'absolute',
                                width: '50%',
                                borderWidth: 2,
                                left: '25%',
                                top: 34, zIndex: -10,
                                borderColor: '#4DA5F8'
                            }}></View>
                        </ScrollView>
                    </View>
                    <View style={styles.chanSwiperFoot}>
                        <View style={styles.triBox}>
                            <View style={styles.triangle}></View>
                        </View>
                        <TouchableOpacity onPress={this.toPay} style={styles.buyPermis}>
                            <Text style={{ color: 'white' }}>购买权限</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontSize: 12, color: '#666666', margin: 10 }}>购买合伙人权限，享受渠道推广权限和高额提成</Text>

                {/* <View style={styles.chanBanner}>
                    {/* <Text>我是banner下面是banner内容</Text> */}
                {/* </View> */}
                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => this.setState({ showModal: false })}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ backgroundColor: 'white', height: '65%', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: '100%' }}>
                            <View style={styles.modalTop}>
                                <View style={styles.modalTopChild}>
                                    <Ionicons name='md-close' size={20} color={'black'} onPress={() => this.setState({ showModal: false })} />
                                    <Text style={{ fontSize: 18 }}>确认付款</Text>
                                    <View style={{ width: 20 }}></View>
                                </View>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center', height: 80, justifyContent: 'center', flexDirection: 'row' }}>
                                <Text style={{ height: 25 }}>￥</Text>
                                <Text style={{ fontSize: 32 }}>{data.price}.00</Text>
                            </View>
                            <View style={styles.modalTop}>
                                <View style={[styles.modalTopChild, { borderBottomWidth: 1, borderColor: '#E9E9E9' }]}>
                                    <Text style={{ color: '#999999', fontSize: 16 }}>订单信息</Text>
                                    <Text style={{ fontSize: 16 }}>博客云{data.level}推广权限</Text>
                                </View>
                            </View>
                            <TouchableOpacity onPress={this.payType}>
                                <View style={styles.modalTop}>
                                    <View style={[styles.modalTopChild, { borderBottomWidth: 1, borderColor: '#E9E9E9' }]}>
                                        <Text style={{ color: '#999999', fontSize: 16 }}>付款方式</Text>
                                        <View style={{ flexDirection: 'row' }}>
                                            {typeDom}
                                            <Feather name='chevron-right' size={20}></Feather>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%' }}>
                            <TouchableOpacity onPress={this.nowPay} style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{
                                    width: '90%', height: 50, backgroundColor: '#1195E3',
                                    justifyContent: 'center', alignItems: 'center', marginBottom: 20
                                }}>
                                    <Text style={{ color: 'white', fontSize: 18 }}>立即付款</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* <View style={{ width: '100%', height: 20, alignItems: 'center' }}>
                    <Swiper
                        horizontal={false}           // 水平轮播
                        showsPagination={false}     // 控制小圆点的显示
                        showsButtons={false}        // 控制左右箭头按钮显示
                        autoplay={true}             // 自动轮播
                        index={0}                   // 初始图片的索引号
                        loop={true}                 // 循环轮播
                        style={{ alignItems: 'center' }}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{fontSize: 12}}>恭喜初级合伙人汪东城成功推广20家，荣获20000元奖励金</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{fontSize: 12}}>恭喜初级合伙人汪东城成功推广20家，荣获20000元奖励金</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{fontSize: 12}}>恭喜初级合伙人汪东城成功推广20家，荣获20000元奖励金</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{fontSize: 12}}>恭喜初级合伙人汪东城成功推广20家，荣获20000元奖励金</Text>
                        </View>
                    </Swiper>
                </View> */}
                <View style={{ width: '100%', padding: 20, flex: 1 }}>
                    <View style={{ width: '100%' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 20, fontSize:15 }}>佣金比例</Text>
                        {level !== 4 ?<View style={styles.proporition}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 10, marginRight: 5, height: 10, borderRadius: 10, backgroundColor: 'orange' }}></View>
                                <Text>{data.level}合伙人佣金比例</Text>
                            </View>
                            <Text style={{ color: '#EA3E34', fontWeight: 'bold' }}>{data.commission}</Text>
                        </View>:
                        <View style={styles.proporition}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 10, marginRight: 5, height: 10, borderRadius: 10, backgroundColor: 'orange' }}></View>
                                <Text>该等级不享有佣金提成</Text>
                            </View>
                        </View>}
                    </View>
                    <View style={{ flex: 1, backgroundColor: 'white' }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 20, fontSize:15 }}>等级说明</Text>
                        <View>
                            <Text>{data.levelDriect}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
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
    payMode: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        width: '94%',
        marginBottom: 10,
        borderRadius:5
    },
    checkPayMode: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#FC5445',
        width: '94%',
        marginBottom: 10,
        borderRadius:5
    },
    alipayMode: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%',
        justifyContent: 'flex-start'
    },
    header: {
        width: '100%',
        height: 60,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    chanBanner: {
        width: '90%',
        height: 60,
        borderRadius: 10,
        backgroundColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: 10
    },
    chanSwiperFoot: {
        width: '100%',
        height: 80,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    proporition: {
        height: 35,
        borderRadius: 18,
        backgroundColor: '#CFEAF9',
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: 'center'
    },
    buyPermis: {
        width: 200,
        height: 45,
        backgroundColor: '#1195E3',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    triangle: {
        width: 0, height: 0,
        borderWidth: 10,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderLeftColor: 'transparent',
        borderBottomColor: 'white'
    },
    triBox: {
        position: 'absolute',
        width: '100%',
        height: 10,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: '#53AEF4',
        bottom: 70
    },
    distributor: {
        height: 250,
        backgroundColor: '#53AEF4',
        width: '100%',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollBox: {
        height: 100,
        width: '100%',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
    },
    scrollStyle: {
        width: '200%',
        height: 100,
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        position: 'relative',
        paddingTop:10
    },
    scrollItemBtn: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelBtn: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: '#4DA5F8',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    insideBtn: {
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: '#78B0FD',
    },
    chanTopMark: {
        position: 'absolute',
        width: 100,
        height: 30,
        backgroundColor: '#EF9E05',
        top: 20,
        right: 0,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chanTopLeftInfo: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 150,
        height: 50,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    modalTop: {
        height: 50,
        width: '100%',
        alignItems: 'center',
    },
    modalTopChild: {
        flexDirection: 'row',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
    },
    typeTop: {
        height: 60,
        width: '100%',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    typeTopChild: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        width: '94%',
    },
    insideChild: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    payleft: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%'
    },
    roundCheck: {
        width: 28,
        height: 28,
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconCheck: {
        width: 30,
        height: 30,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    }
})