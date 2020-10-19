import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import Carousel from '../public/Carousel';
import { ECharts } from 'react-native-echarts-wrapper';
import { connect } from 'react-redux';
import Axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';

class MerchantHome extends Component {
    state = {
        refreshing: true,
        stageList: [],

        timeList: null,
        countList: null,
        totalList: null,
        nowCount: 0,
        nowTotal: 0
    }
    // 分期服务项目
    stageServe = (id, storeid) => {
        axios({
            method: 'POST',
            url: '/api/userStages/storeDetails',
            data: {
                enterId: id,
                id: storeid,
                limit: 10,
                offset: 1,
                type: 1
            }
        })
            .then(res => {
                console.log('获取成功', res.data.data.list.list)
                this.setState({
                    stageList: res.data.data.list.list.slice(0, 3),
                    refreshing: false
                })
            })
            .catch(err => {
                console.log('获取分期项目失败', err)
            })
    }
    componentDidMount() {
        const id = this.props.personInfo.id
        // 分期图表数据
        this.showchart(id)
        // 今日订单及成交额
        this.getNowData(id)
        // 分期项目
        this.stageServe(id, this.props.personInfo.systemStoreId)
    }
    // 分期图表数据
    showchart = id => {
        const date = new Date()
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate();
        const nowDate = Y + '-' + M + '-' + D
        console.log(nowDate)
        console.log(id)
        date.setMonth(date.getMonth() - 1)
        let y = date.getFullYear()
        let m = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let d = date.getDate()
        const preDate = y + '-' + m + '-' + d
        console.log(preDate)
        Axios({
            method: "GET",
            url: `http://47.108.174.202:9010/statistics/stageLineChart?startTime=${preDate}&endTime=${nowDate}&enterId=${id}`
        })
            .then(res => {
                console.log('请求分期项目数据成功', res.data)
                if (res.data.length === 0) {
                    console.log(1)
                } else {
                    console.log(2)
                    let newList1 = []
                    let newList2 = []
                    let newList3 = []
                    res.data.map(item => {
                        newList1.push(item.createTime)
                        // return item
                    })
                    res.data.map(item => {
                        newList2.push(item.stageCount)
                        // return item
                    })
                    res.data.map(item => {
                        newList3.push(item.stageMoney)
                        // return item
                    })
                    this.setState({
                        timeList: newList1,
                        countList: newList2,
                        totalList: newList3,
                        refreshing: false
                    })
                }
            })
            .catch(err => {
                console.log('请求失败', err)
            })
    }
    // 提交分期订单
    toDetail = id => {
        axios({
            method: 'GET',
            url: `/api/userStages/stagesCommodityDetails?id=${id}`,
        })
            .then(res => {
                // console.log('分期项目详情', res)
                // this.props.navigation.navigate('StageOrder', { stageOrder: res.data.data })
                this.props.navigation.navigate('StageGoodsDetail', { goods: res.data.data })
            })
            .catch(err => [
                console.log('查询分期项目详情失败', err)
            ])
    }
    // 下拉刷新
    onRefresh = () => {
        const id = this.props.personInfo.id
        // 分期图表数据
        this.showchart(id)
        // 今日订单及成交额
        this.getNowData(id)
        // 分期项目
        this.stageServe(id, this.props.personInfo.systemStoreId)
    }
    // 今日订单及成交额
    getNowData = id => {
        const date = new Date()
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate();
        const nowDate = Y + '-' + M + '-' + D
        console.log(nowDate)

        fetch(`http://47.108.174.202:9010/statistics/stageLineChart?startTime=${nowDate}&endTime=${nowDate}&enterId=${id}`)
            .then(res => res.json())
            .then(resJSON => {
                // console.log('今日', resJSON)
                if (!resJSON) {
                    // console.log(1)
                } else {
                    // console.log(2)
                    let nowCount = 0, nowTotal = 0
                    resJSON.filter(item => {
                        nowCount = item.stageCount + nowCount
                        nowTotal = item.stageMoney + nowTotal
                        // return item
                    })
                    this.setState({
                        nowCount: nowCount,
                        nowTotal: nowTotal,
                        refreshing: false
                    })
                }
            })
    }
    // 门店列表
    stageMore = () => {
        const { personInfo } = this.props
        let obj = {
            data:"id=" + personInfo.systemStoreId + "&enterId=" + personInfo.id
        }
        this.props.navigation.navigate('StoreDetail', { merchantKey: obj })
    }
    render() {
        const { stageList, refreshing, timeList,
            countList, totalList, nowCount, nowTotal } = this.state
        let dom
        if (stageList.length === 0) {
            // console.log('暂无')
            dom = <View style={{ width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' }}>
                <Text>暂无分期项目，赶紧去后台添加吧</Text>
            </View>
        } else {
            // console.log('暂有')
            dom = stageList.map(item =>
                <TouchableOpacity key={item.id} style={styles.goods} onPress={() => this.toDetail(item.id)}>
                    <Image source={{ uri: item.photo.split(',')[0] }} style={styles.goodsImage} />
                    <View>
                        <View style={{ margin: 5 }}>
                            <Text>{item.name}</Text>
                            <Text style={{ marginTop: 5, color: '#F75175' }}>￥{item.price}</Text>
                        </View>
                    </View>
                </TouchableOpacity>)
        }
        return (
            <ScrollView
                style={{ backgroundColor: 'white' }}
                refreshControl={
                    <RefreshControl
                        // title={'下拉刷新'}
                        refreshing={refreshing}
                        colors={['rgb(255, 176, 0)', "#ffb100"]}
                        onRefresh={() => this.onRefresh()}
                    />
                }
            >
                <Carousel {...this.props} />
                <View>
                    <Text style={{ margin: 10 }}>店铺数据</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                        <View style={styles.storeData}>
                            <Text style={[styles.whiteFont, { fontSize: 18, fontWeight: 'bold' }]}>{nowCount}</Text>
                            <Text style={[styles.whiteFont, { fontSize: 13 }]}>今日订单量</Text>
                        </View>
                        <View style={styles.storeData}>
                            <Text style={[styles.whiteFont, { fontSize: 18, fontWeight: 'bold' }]}>{nowTotal}</Text>
                            <Text style={[styles.whiteFont, { fontSize: 13 }]}>今日成交额</Text>
                        </View>
                    </View>

                    <Text style={{ textAlign: 'right', fontSize: 12, marginBottom: 10 }}>30天内门店分期交易额数据统计</Text>

                    <View style={{ height: 280, marginBottom: 20 }}>
                        <ECharts option={
                            {
                                legend: {
                                },
                                grid: {
                                    left: '5%',
                                    right: '5%',
                                    bottom: '5%',
                                    containLabel: true
                                },
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        type: 'cross',
                                        label: {
                                            backgroundColor: '#6a7985'
                                        }
                                    }
                                },
                                xAxis: {
                                    type: "category",
                                    data: timeList,
                                    boundaryGap: true,
                                },
                                yAxis: {
                                    type: "value"
                                },
                                series: [
                                    {
                                        data: countList,
                                        type: "line",
                                        smooth: true,
                                        name: '单量'
                                    },
                                    {
                                        data: totalList,
                                        type: 'line',
                                        name: '交易额'
                                    }
                                ]
                            }
                        } />
                    </View>
                </View>

                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ marginLeft: 12 }}>分期服务</Text>
                        <TouchableOpacity style={styles.more} onPress={this.stageMore}>
                            <Text style={{ fontSize: 12, color: '#999999' }}>更多</Text>
                            <Feather name="chevron-right" size={18} color={'#666666'} />
                        </TouchableOpacity>

                    </View>
                    <View style={{ flexDirection: 'row', padding: 12, justifyContent: 'space-evenly' }}>
                        {dom}
                    </View>
                </View>

                {/* <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ margin: 10 }}>线上好物</Text>
                        <Text style={{ fontSize: 12, margin: 10 }}>更多</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        {goodsList.map((item, index) => {
                            return (
                                <View key={index} style={styles.goods}>
                                    <Image source={require('../../assets/img/goods/95xys5.jpg')} style={styles.goodsImage}></Image>
                                    <View>
                                        <View style={{ margin: 5 }}>
                                            <Text>{item.name}</Text>
                                            <Text style={{ marginTop: 5, color: '#F75175' }}>￥{item.price}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View> */}

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    whiteFont: {
        color: 'white'
    },
    storeData: {
        width: '45%',
        height: 70,
        backgroundColor: '#0897FF',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderRadius: 15
    },
    goodsImage: {
        width: 100,
        height: 100,
        margin: 5,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 4
    },
    more: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
    }
})

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(MerchantHome)