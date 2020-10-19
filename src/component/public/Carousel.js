// 公共轮播组件
import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator, StatusBar,
    Platform, PermissionsAndroid
} from 'react-native';
import Swiper from 'react-native-swiper';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import { cityPositionAction } from '../../store/user/userActions';

// 获取当前用户经纬度
import { init, addLocationListener, start, stop, setLocatingWithReGeocode } from "react-native-amap-geolocation";

import Modal from 'react-native-modal';
import { BoxShadow } from 'react-native-shadow';

class Carousel extends Component {
    state = {
        promptModal: false,
        loading: false,
        ispositionText: '未定位',
        withTime: [],
        carouselList: [],
        carouselText: [],
        personInfo: '',
        natureModal: false,
        cityPosition: null
    }
    // 获取当前地理位置
    handleGetLocation = () => {
        this.setState({ loading: true }, () => {
            this.getPosition()
        })
    }
    getPosition = () => {
        start()
        addLocationListener(location => {
            this.props.saveCity(location.city)
            this.setState({ 
                loading: false, 
                cityPosition:location.city 
            }, () => {
                stop()
            })
        })
    }
    async componentDidMount() {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ])
        // ios
        setLocatingWithReGeocode(true)
        // 使用自己申请的高德 App Key 进行初始化
        await init({
            // ios: "9bd6c82e77583020a73ef1af59d0c759",
            android: "1a3b0b49b36561178a8e59b6e8f05e01"
        })

        this.getPosition()
        this.setState({
            personInfo: this.props.personInfo
        }, () => {
            axios({
                method: 'POST',
                url: '/api/userStages/userStagesDetails',
                data: {
                    id: this.props.personInfo.uid,
                    limit: 10,
                    offset: 1,
                    type: 3
                }
            })
                .then(res => {
                    this.setState({
                        withTime: res.data.data.list,
                    })
                    this.getHome()
                })
                .catch(err => {
                    console.log('用户分期信息查询失败', err)
                })
        })
    }
    // 行业动态
    toIndustryDynamic = () => {
        this.props.navigation.navigate('IndustryDynamic')
    }
    // 商家入驻
    toMerchant = () => {
        this.props.navigation.navigate('FirstStep')
    }
    // 积分商城
    toIntegralMall = () => {
        this.props.navigation.navigate('IntegralMall')
        // this.setState({
        //     promptModal: true
        // })
    }
    // 积分签到
    toIntegralSignIn = () => {
        this.props.navigation.navigate('IntegralSignIn')
        // this.setState({
        //     promptModal: true
        // })
    }
    // 搜索门店
    toSearchStore = () => {
        this.props.navigation.navigate('SearchStore')
    }
    //加盟商专区
    toJoinStore = () => {
        let nature = this.state.personInfo.natureMerchant
        // let nature = '渠道商'
        if (nature.indexOf('加盟商') === -1) {
            this.setState({
                natureModal: true
            })
            console.log('不是加盟商')
        } else {
            this.props.navigation.navigate('JoinStore')
        }
    }
    // 首页幻灯片
    getHome = () => {
        axios({
            url: '/api/index',
            method: 'GET'
        })
            .then(res => {
                this.setState({
                    carouselList: res.data.data.banner,
                    carouselText: res.data.data.roll
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 扫描二维码
    toScan = () => {
        this.props.navigation.navigate('Scan')
    }
    render() {
        const { width } = Dimensions.get('window')
        const { promptModal, loading, ispositionText, withTime, carouselList, carouselText,
            natureModal, cityPosition } = this.state
        const { type } = this.props
        // 阴影设置
        const shadowOpt = {
            width: width * 0.90,
            height: 100,
            color: '#000000',
            border: 10,
            radius: 15,
            opacity: 0.1
        }

        let changePartDom
        if (type === 2) { // 商家
            changePartDom =
                <BoxShadow setting={shadowOpt}>
                    <View style={styles.fnPartSon}>
                        <TouchableOpacity onPress={this.toIndustryDynamic} style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                            <Image source={require('../../assets/img/industrydynamic.png')} style={styles.homeImage}></Image>
                            <Text>行业动态</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toJoinStore} style={{ justifyContent: 'space-around', alignItems: 'center' }}>
                            <Image source={require('../../assets/img/joinstore.png')} style={styles.homeImage}></Image>
                            <Text>加盟商专区</Text>
                        </TouchableOpacity>
                    </View>
                </BoxShadow>
        } else if (type === 1) { // 用户
            changePartDom =
                <BoxShadow setting={shadowOpt}>
                    <View style={styles.fnPartSon}>
                        <View style={{ width: '20%' }}>
                            <TouchableOpacity onPress={this.toIndustryDynamic} style={styles.parts}>
                                <Image source={require('../../assets/img/industrydynamic.png')} style={styles.homeImage}></Image>
                                <Text style={{ fontSize: 14 }}>行业动态</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '20%' }}>
                            <TouchableOpacity onPress={this.toMerchant} style={styles.parts}>
                                <Image source={require('../../assets/img/merchantenter.png')} style={styles.homeImage}></Image>
                                <Text style={{ fontSize: 14 }}>商家入驻</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={{ width: '20%' }}>
                            <TouchableOpacity onPress={this.toIntegralMall} style={styles.parts}>
                                <Image source={require('../../assets/img/integralmall.png')} style={styles.homeImage}></Image>
                                <Text style={{ fontSize: 14 }}>积分商城</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '20%' }}>
                            <TouchableOpacity onPress={this.toIntegralSignIn} style={styles.parts}>
                                <Image source={require('../../assets/img/integralsignIn.png')} style={styles.homeImage}></Image>
                                <Text style={{ fontSize: 14 }}>积分签到</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </BoxShadow>
        }

        const isPosition = loading === false ? ispositionText : <ActivityIndicator size="small" color="#1195E3" />
        const hasPosition = loading === false ? cityPosition : <ActivityIndicator size="small" color="#1195E3" />

        return (
            <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'white' }}>
                {Platform.OS === 'ios' ? (
                    <StatusBar barStyle={'light-content'} />
                ) : (
                        <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0)'} barStyle='dark-content' />
                    )}
                <View style={{ width: '100%', alignItems: 'center', backgroundColor: 'white', position: 'relative', paddingTop: 30 }}>
                    <View style={styles.topSearch}>
                        <TouchableOpacity style={[styles.map, { flexDirection: 'row', alignItems: 'center', width: 80 }]} onPress={this.handleGetLocation}>
                            <Feather name='map-pin' size={14} style={{ marginRight: 5 }}></Feather>
                            <Text>
                                {cityPosition === null ? isPosition : hasPosition}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.toSearchStore} style={styles.searchPart}>
                            <Feather name='search' size={16} style={{ color: '#B1B1B1', marginLeft: 10 }}></Feather>
                            <Text style={{ marginLeft: 5, color: '#b1b1b1' }}>搜索门店</Text>
                        </TouchableOpacity>
                        <View style={styles.map}>
                            <Feather name='maximize' size={24} onPress={this.toScan}></Feather>
                        </View>
                    </View>
                    <View style={{ width: '94%', alignItems: 'center', justifyContent: 'flex-start', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                        <Swiper
                            horizontal={true}           // 水平轮播
                            showsPagination={false}     // 控制小圆点的显示
                            showsButtons={false}        // 控制左右箭头按钮显示
                            autoplay={true}             // 自动轮播
                            index={0}                   // 初始图片的索引号
                            loop={true}                 // 循环轮播
                            style={{ height: 150 }}
                            dotStyle={{ backgroundColor: 'white' }}
                            removeClippedSubviews={true}
                        // activeDot={<View style={{ backgroundColor: 'yellow', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                        >
                            {carouselList.map((item, index) => <Image source={{ uri: item.pic }} style={styles.image} key={index} />)}
                        </Swiper>
                    </View>
                    <Image source={require('../../assets/img/carousel/carousel-bg2.png')}
                        style={{ position: 'absolute', top: 1, zIndex: -1, width: '100%', height: 180 }}></Image>
                </View>


                <Modal
                    isVisible={promptModal}
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
                <View style={styles.fnPart}>
                    {changePartDom}
                </View>
                <Modal
                    isVisible={natureModal}
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
                            <Text>您还不是加盟商，无法进入！</Text>
                        </View>
                        <View style={styles.naturemodalBtn}>
                            <TouchableOpacity style={styles.modalcan} onPress={() => this.setState({ natureModal: false })}>
                                <Text>知道了</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalcan, { borderLeftWidth: 1, borderColor: '#ccc' }]} onPress={this.onPress}>
                                <Text style={{ color: '#4EA4FB', }}>成为加盟商</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <View style={{ width: '94%', height: 30, alignItems: 'center', flexDirection: 'row', backgroundColor: '#F5F5F5', paddingLeft: 5, marginTop: 20 }}>
                    <Feather name='volume-2' style={{ color: '#1195E3', marginRight: 10 }} size={16}></Feather>
                    {withTime.length === 0 ?
                        <Swiper
                            horizontal={true}           // 水平轮播
                            showsPagination={false}     // 控制小圆点的显示
                            showsButtons={false}        // 控制左右箭头按钮显示
                            autoplay={true}             // 自动轮播
                            index={0}                   // 初始图片的索引号
                            loop={true}                 // 循环轮播
                        >
                            {carouselText.map(item =>
                                <Text style={{
                                    color: '#666',
                                    height: 30,
                                    lineHeight: 30
                                }} key={item.id} numberOfLines={1}>{item.info}</Text>)}
                        </Swiper>
                        : <Text>您目前有逾期的分期项目，请尽快核实</Text>}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    naturemodalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#ccc'
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
    },
    modalcan: {
        color: '#4EA4FB',
        height: '100%',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        // resizeMode:'contain',
        width: '100%',
        height: '100%'
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    topSearch: {
        flexDirection: 'row',
        width: '94%',
        height: 50,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    searchPart: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
        height: 35,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 5
    },
    map: {
        width: 50,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    fnPart: {
        marginTop: 15,
        marginBottom: 15,
        height: 100,
        width: '94%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fnPartSon: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
    },
    parts: {
        alignItems: 'center',
        width: '100%',
        // height: '100%',
        justifyContent: 'space-around'
    },
    swiperText: {
        // width: '100%',
        // justifyContent: 'center',
        // height: 30,
        // lineHeight:30
    },
    homeImage: {
        resizeMode: 'contain',
        width: 45,
        height: 45,
        marginBottom: 5
    }
})

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}
function mapDispatchToProps(dispatch) {
    return {
        saveCity: (data) => dispatch(cityPositionAction(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Carousel)