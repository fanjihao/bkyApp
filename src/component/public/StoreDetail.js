import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

class StoreDetail extends Component {
    state = {
        data: '',
        stageList: [],
        tabIndex: 1,
        goodsList: [],
        copyModal: false,
        promptModal: false
    }
    // 挂载完毕获取数据
    componentDidMount() {
        if (this.props.route.params.merchantKey) {
            let storeid = this.props.route.params.merchantKey.data.split('&')[0]
            let sarr = storeid.split('=')
            let id = sarr[1]
            let str = this.props.route.params.merchantKey.data.split('&')[1]
            let arr = str.split('=')
            let enterId = arr[1]
            this.getStage(id, enterId)
        } else {
            axios({
                url: '/api/userStages/storeDetails',
                method: 'POST',
                data: {
                    id: this.props.route.params.storeid.id,
                    limit: 10,
                    offset: 1,
                    type: this.state.tabIndex
                }
            })
                .then(res => {
                    console.log(res.data.data)
                    this.setState({
                        data: res.data.data
                    })
                })
                .catch(err => {
                    console.log('详情获取失败', err)
                })
        }
    }
    checkedTab = i => {
        this.setState({
            tabIndex: i
        }, () => {
            let storeid = this.props.route.params.merchantKey.data.split('&')[0]
            let sarr = storeid.split('=')
            let id = sarr[1]
            let str = this.props.route.params.merchantKey.data.split('&')[1]
            let arr = str.split('=')
            let enterId = arr[1]
            if (this.state.tabIndex === 1) {
                this.getStage(id, enterId)
            } else {
                this.getGoods(id, enterId)
            }
        })
    }
    getStage = (id, enterId) => {
        axios({
            method: 'POST',
            url: '/api/userStages/storeDetails',
            data: {
                enterId,
                id,
                limit: 10,
                offset: 1,
                type: 1
            }
        })
            .then(res => {
                if (res.data.data.list) {
                    this.setState({
                        stageList: res.data.data.list.list,
                        data: res.data.data
                    })
                } else {
                    this.setState({
                        data: res.data.data
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    getGoods = (id, enterId) => {
        axios({
            method: 'POST',
            url: '/api/userStages/storeDetails',
            data: {
                enterId,
                id,
                limit: 10,
                offset: 1,
                type: 2
            }
        })
            .then(res => {
                this.setState({
                    goodsList: res.data.data.info.list,
                    data: res.data.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    toDetail = id => {
        axios({
            method: 'GET',
            url: `/api/userStages/stagesCommodityDetails?id=${id}`,
        })
            .then(res => {
                if (this.props.type === 1) {
                    this.props.navigation.navigate('StageOrder', { stageOrder: res.data.data })
                } else {
                    this.setState({promptModal: true})
                }
            })
            .catch(err => {
                console.log('查询分期项目详情失败', err)
            })
    }
    togoodsDetail = id => {
        this.props.navigation.navigate('OnlineGoodsDetail', { goods: id })
    }
    copyAddress = (i) => {
        this.setState({
            copyModal: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    copyModal: false
                })
            }, 1000)
        })
        Clipboard.setString(i)
    }
    toback = () => {
        this.props.navigation.navigate('Tab')
    }

    render() {
        const { data, stageList, tabIndex, goodsList, copyModal, promptModal } = this.state
        const key = this.props.route.params.merchantKey
        let dom, goodsDom
        if (key) {
            // 线上商品
            goodsDom = goodsList.map(item => {
                let photo
                photo = item.image.split(',')[0]
                return (
                    <TouchableOpacity style={{ width: '100%', height: 100, flexDirection: 'row', alignItems: 'center' }} key={item.id}
                        onPress={() => this.togoodsDetail(item)}>
                        <View style={{ width: 100, height: 100, padding: 10 }}>
                            <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }}></Image>
                        </View>
                        <View style={{ width: '70%', height: 100, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '80%', justifyContent: 'space-evenly', height: '100%' }}>
                                <Text>{item.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: '#999', marginRight: 10 }}>￥{item.price.toFixed(2)}</Text>
                                    <Text style={{ color: '#ccc' }}>已售：{item.sales}</Text>
                                </View>
                            </View>
                            <View style={{ height: '50%', justifyContent: 'flex-end' }}>
                                <Feather name='shopping-cart' size={16} style={{ color: 'red' }}></Feather>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        if (key) {
            dom = stageList.map(item => {
                let photo
                photo = item.photo.split(',')[0]
                return (
                    <TouchableOpacity style={{ width: '100%', height: 100, flexDirection: 'row', alignItems: 'center' }} key={item.id}
                        onPress={() => this.toDetail(item.id)} >
                        <View style={{ width: 100, height: 100, padding: 10 }}>
                            <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }}></Image>
                        </View>
                        <View style={{ width: '70%', height: 100, borderBottomWidth: 1, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '80%', justifyContent: 'space-evenly', height: '100%' }}>
                                <Text>{item.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 12, color: '#999', marginRight: 10 }}>￥{item.price.toFixed(2)}</Text>
                                    <Text style={{ color: '#ccc' }}>已售：{item.sales}</Text>
                                </View>
                            </View>
                            <View style={{ height: '50%', justifyContent: 'flex-end' }}>
                                <Feather name='shopping-cart' size={16} style={{ color: 'red' }}></Feather>
                            </View>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        return (
            <ScrollView contentContainerStyle={{ flexGrow: 1, elevation: 1, backgroundColor: 'white' }}>
                <View style={{ alignItems: 'center', width: '100%', height: 370, backgroundColor: 'white', position: 'relative', overflow: 'hidden' }}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={this.toback} style={{ width: 50, height: 50 }}>
                            <Feather name="chevron-left" size={24} style={{ fontSize: 20, color: 'white', margin: 15 }} />
                        </TouchableOpacity>
                        <Text style={{ marginLeft: '28%', fontSize: 16, color: 'white' }}>门店详情</Text>
                    </View>
                    <View style={styles.detailImg}>
                        <Image source={{ uri: data.storePhoto }} 
                            style={{ width: '100%', height: '100%' }}
                            onError={(err) => console.log(err)}></Image>
                    </View>
                    <View style={styles.detailInfo}>
                        <View style={{ width: '80%' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 20 }}>{data.name}</Text>
                            <View style={styles.InfoChild}>
                                <Text style={{ fontWeight: 'bold' }}>营业时间：</Text>
                                <Text>{data.dayTime}</Text>
                            </View>
                            <View style={styles.InfoChild}>
                                <Text style={{ fontWeight: 'bold' }}>经营面积：</Text>
                                <Text>{data.businessArea}</Text>
                            </View>
                            <View style={[styles.InfoChild, { width: '100%' }]}>
                                <Text style={{ fontWeight: 'bold' }}>门店地址：</Text>
                                <Text style={{ width: '70%' }}>{data.address}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => this.copyAddress(data.address + data.detailedAddress)} style={styles.InfoCopyBtn}>
                            <Text>
                                复制
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {
                    key ?
                        <View style={{ width: '100%' }}>
                            <View style={styles.tabCheck}>
                                <Text style={[styles.tabItem, tabIndex === 1 ? styles.checked : styles.nochecked]}
                                    onPress={() => this.checkedTab(1)}>分期项目</Text>
                                <Text style={[styles.tabItem, tabIndex === 2 ? styles.checked : styles.nochecked]}
                                    onPress={() => this.checkedTab(2)}>线上商品</Text>
                            </View>
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                {tabIndex === 1 ? dom : goodsDom}
                                <Text style={{ margin: 10 }}>没有更多了</Text>
                            </View>
                        </View>
                        : null
                }
                <Modal
                    isVisible={copyModal}
                    backdropOpacity={0}
                    style={styles.addShoppingcartModal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <Text style={styles.addShoppingcartHint}>复制成功</Text>
                </Modal>
                {/* 提示用户身份进行分期 */}
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
                            <Text>请以用户身份登录进行分期服务！</Text>
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
    addShoppingcartHint: {
        width: 200,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        backgroundColor: 'black',
        // opacity: 0.5,
        color: 'white',
        borderRadius: 10
    },
    modal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
    },
    addShoppingcartModal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabCheck: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        marginTop: 15,
        flexDirection: 'row',
        borderRadius: 5,
        overflow: 'hidden'
    },
    tabItem: {
        width: '50%',
        height: 50,
        textAlign: "center",
        lineHeight: 50
    },
    checked: {
        backgroundColor: 'skyblue',
        color: 'white'
    },
    nochecked: {
        color: 'black'
    },
    detailImg: {
        width: '100%',
        height: 200,
        position: 'absolute',
        top: 0,
        left: 0
    },
    header: {
        width: '100%',
        height: 75,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        zIndex: 999,
        paddingTop: 30
    },
    detailInfo: {
        width: '94%',
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        position: 'absolute',
        top: 170,
        backgroundColor: 'white',
        padding: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderColor:'#eee'
    },
    InfoChild: {
        flexDirection: 'row',
        marginTop: 15,
        width: '100%',
    },
    InfoCopyBtn: {
        width: 50,
        height: 25,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    }
})


function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(StoreDetail)