import React, { Component } from 'react'
import Swiper from 'react-native-swiper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class IntegralMall extends Component {
    state = {
        winSwiper: [],
        giftList: []
    }

    getWinSwiper = () => {
        let data = [
            {
                id: 1,
                content: '恭喜 123456789 成功兑换戴森吹风机'
            },
            {
                id: 2,
                content: '恭喜 dasda6789 成功兑换戴森打火机'
            },
            {
                id: 3,
                content: '恭喜 1dgsg6789 成功兑换戴森吹风机'
            },
            {
                id: 4,
                content: '恭喜 12gs789 成功兑换戴森机'
            },
            {
                id: 5,
                content: '恭喜 1234sdasd56789 成功兑换机'
            },
            {
                id: 6,
                content: '恭喜 1sda789 成功兑换戴森火机'
            }]
        this.setState({
            winSwiper: data.slice(0, 5)
        })
    }
    getGiftList = () => {
        let data = [
            {
                id: 1,
                name: '京东50元礼品卡',
                integral: '5积分',
                num: 3
            },
            {
                id: 2,
                name: '京东30元礼品卡',
                integral: '3积分',
                num: 1
            },
            {
                id: 3,
                name: '京东30元礼品卡',
                integral: '3积分',
                num: 1
            },
        ]
        this.setState({
            giftList: data
        })
    }
    componentDidMount() {
        this.getWinSwiper()
        this.getGiftList()
    }
    toGoodsDetail = (i) => {
        this.props.navigation.navigate('GoodsDetail', { goodsid: i })
    }
    ToSure = (i) => {
        this.props.navigation.navigate('SureExchange', { goodsid: i })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { winSwiper, giftList } = this.state
        let swiperDom = winSwiper.map(item => {
            return (
                <View key={item.id} style={styles.swiperText}>
                    <Text style={{ fontSize: 12 }}>{item.id}{item.content}</Text>
                </View>
            )
        })
        let giftDom = giftList.map(item => {
            return (
                <View style={styles.giftItem} key={item.id}>
                    <View style={styles.giftFirChild}>
                        <TouchableOpacity onPress={() => this.toGoodsDetail(item.id)}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.ToSure(item.id)}>
                            <View style={styles.exchangeBtn}><Text>兑换</Text></View>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.redIntegral}>{item.integral}</Text>
                    <View style={styles.giftLastChild}>
                        <Image source={require('../../assets/img/gift/gift1.jpg')} style={styles.giftImg}></Image>
                        <View style={styles.giftNum}>
                            <View style={styles.numIcon}></View>
                            <View style={styles.numPart}>
                                <Text>{item.num}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        })
        return (
            <ScrollView style={{ flex: 1, paddingTop: 30 }}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>积分商城</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={styles.mallBox}>
                    <View style={styles.topIntegral}>
                        <View style={{ width: '90%', flexDirection: 'row', height: '50%', alignItems: 'center' }}>
                            <Ionicons name='md-bookmark' size={24} style={{ color: '#FFC300' }}></Ionicons>
                            <Text style={{ color: '#976F3D' }}>您有256积分，可用于礼品兑换</Text>
                        </View>
                    </View>
                    <View style={styles.topName}>
                        <View style={{ width: '90%' }}>
                            <Text>积分好礼</Text>
                        </View>
                    </View>
                    <View style={styles.winBroadcast}>
                        <View style={styles.broadCast}>
                            <Text style={styles.winText}>中奖播报</Text>
                            <View style={styles.line}></View>
                            <View style={{ width: '70%', height: '40%' }}>
                                <Swiper
                                    horizontal={false}           // 水平轮播
                                    showsPagination={false}     // 控制小圆点的显示
                                    showsButtons={false}        // 控制左右箭头按钮显示
                                    autoplay={true}             // 自动轮播
                                    index={0}                   // 初始图片的索引号
                                    loop={true}                 // 循环轮播
                                >
                                    {swiperDom}
                                </Swiper>
                            </View>
                        </View>
                    </View>
                    <View style={styles.mallGift}>
                        {giftDom}
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    mallBox: {
        // width: '100%',
        // alignItems: 'center'
        backgroundColor: 'white',
        paddingBottom: 100
    },
    topIntegral: {
        width: '100%',
        height: 40,
        backgroundColor: '#FFF1C4',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topName: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#DBDBDB',
        alignItems: 'center',
        justifyContent: 'center'
    },
    winBroadcast: {
        width: '100%',
        height: 60,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#DBDBDB',
    },
    broadCast: {
        width: '90%',
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center'
    },
    winText: {
        fontWeight: 'bold',
        color: '#858585',
        fontSize: 16
    },
    line: {
        height: 45,
        borderLeftWidth: 1,
        borderColor: '#858585',
        marginLeft: 20,
        marginRight: 20
    },
    swiperText: {
        paddingTop: 2
    },
    mallGift: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    giftItem: {
        width: '50%',
        height: 180,
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 15,
    },
    giftFirChild: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    exchangeBtn: {
        borderWidth: 1,
        width: 40,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    redIntegral: {
        color: 'red',
        marginBottom: 5,
        marginTop: 5
    },
    giftImg: {
        width: 100,
        height: 70
    },
    giftLastChild: {
        flexDirection: 'row',
        height: '60%',
        alignItems: 'flex-end',
        width: '100%',
        justifyContent: 'space-between'
    },
    numIcon: {
        width: 15,
        height: 15,
        backgroundColor: '#ccc'
    },
    numPart: {
        width: 15,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5
    },
    giftNum: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'flex-end'
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