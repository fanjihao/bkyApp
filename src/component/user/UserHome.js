import React, { Component } from 'react';
import {
    View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, RefreshControl, Dimensions,
    Clipboard, 
} from 'react-native';
import { connect } from 'react-redux';
import Carousel from '../public/Carousel';
import Feather from 'react-native-vector-icons/Feather';
import { BoxShadow } from 'react-native-shadow';
import Modal from 'react-native-modal';


class UserHome extends Component {
    state = {
        searchVal: '',
        storeList: [],
        nearbyStoreList: [],
        refreshing: true,
        data: [],
        withTime: [],
        city: '',
        copyModal:false
    }
    storeMore = () => {
        this.props.navigation.navigate('SearchStore')
    }
    componentDidMount() {
        setTimeout(() => {
            this.getStoreList()
        }, 500)
        this.getWithinTime()
        this.getUserStageInfo()
    }
    // 门店列表
    getStoreList = () => {
        this.setState({
            city: this.props.cityPosition
        }, () => {
            axios({
                url: '/api/userStages/locationStore',
                method: 'POST',
                data: {
                    address: this.state.city,
                    limit: 5,
                    name: '',
                    offset: 1,
                }
            })
                .then(res => {
                    this.setState({
                        nearbyStoreList: res.data.data.list,
                        refreshing: false
                    })
                })
                .catch(err => {
                    console.log('门店列表', err.status)
                })
        })
    }
    // 用户分期信息
    getUserStageInfo = () => {
        axios({
            method: 'POST',
            url: '/api/userStages/userStagesDetails',
            data: {
                id: this.props.personInfo.uid,
                limit: 10,
                offset: 1,
                type: 1
            }
        })
            .then(res => {
                this.setState({
                    data: res.data.data.list,
                })
            })
            .catch(err => {
                console.log('用户分期信息查询失败', err.status)
            })
    }
    getWithinTime = () => {
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
            })
            .catch(err => {
                console.log('用户分期信息查询失败', err.status)
            })
    }
    copyAddress = (i) => {
        this.setState({
            copyModal:true
        }, () => {
            setTimeout(() => {
                this.setState({
                    copyModal: false
                })
            }, 1000)
        })
        Clipboard.setString(i)
    }
    toDetail = i => {
        this.props.navigation.navigate('StoreDetail', { storeid: i })
    }
    // 下拉刷新
    onRefresh = () => {
        setTimeout(() => {
            this.getStoreList()
        }, 500)
        this.getWithinTime()
        this.getUserStageInfo()
    }
    goMyStage = () => {
        this.props.navigation.navigate('MyStage')
    }
    render() {
        const { nearbyStoreList, refreshing, data, withTime, copyModal } = this.state
        const { width } = Dimensions.get('window')
        // 阴影设置
        const shadowOpt = {
            width: width * 0.90,
            height: 200,
            color: '#000000',
            border: 15,
            radius: 10,
            opacity: 0.05,
            style: { justifyContent: 'center', paddingBottom: 10 }
        }
        let list
        if (nearbyStoreList.length === 0) {
            list = <View style={{ width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }}>
                <Text>抱歉，附近暂无加盟店呢！</Text>
            </View>
        } else {
            list = this.state.nearbyStoreList.map(item => {
                return (
                    <TouchableOpacity key={item.id} style={styles.ListItem} onPress={() => this.toDetail(item)}>
                        <Image source={{ uri: item.signboardPhoto }} style={styles.goodsImage}></Image>
                        <View style={styles.itemMidInfo}>
                            <Text style={{ fontSize: 16, }}>{item.name}</Text>
                            <Text numberOfLines={1} style={styles.moreText}>经营地址：{item.detailedAddress}</Text>
                            <Text numberOfLines={1} style={{ fontSize: 13, color: '#595959' }}>营业时间：{item.dayTime}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.copyAddress(item.detailedAddress)}
                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 3 }}>
                            <Text style={{ fontSize: 12 }}>复制</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
            })
        }
        let dom
        if (withTime.length !== 0) {
            let photo
            photo = withTime[0].photo.split(',')[0]
            dom =
                <BoxShadow setting={shadowOpt}>
                    <TouchableOpacity style={styles.installInfo} onPress={this.goMyStage}>
                        {withTime[0].staffName ?
                            <View style={[styles.iInfoChild]}>
                                <Text style={[styles.blueFont, { fontWeight: 'bold', fontSize: 16 }]}>{withTime[0].storeName}</Text>
                                <Text style={{ color: '#ccc' }}>美疗师：<Text style={{ color: 'black' }}>{withTime[0].staffName}</Text></Text>
                            </View> :
                            <View style={[styles.iInfoChild]}>
                                <Text style={[styles.blueFont, { fontWeight: 'bold', fontSize: 16 }]}>{withTime[0].storeName}</Text>
                                <Text style={{ color: '#666' }}>美疗师：<Text style={{ color: 'black' }}>未关联</Text></Text>
                            </View>
                        }
                        <View style={[styles.iInfoChild, { height: 120 }]}>
                            <View style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: 3 }}>
                                <Image source={{ uri: photo }} style={{ width: 100, height: 100 }}></Image>
                            </View>
                            <View style={{
                                width: '50%', height: '100%', justifyContent: 'space-between',
                                alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10
                            }}>
                                <View>
                                    <Text>{withTime[0].name}</Text>
                                    <Text style={{ fontSize: 13, color: '#666', marginTop: 5 }}>VIP客户特供</Text>
                                </View>
                                <Text style={{ color: 'red' }}>共{withTime[0].stagesNumber}期，每期{withTime[0].stagesPrice}</Text>
                            </View>
                            <View style={{ height: '100%', justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
                                <Text style={{ fontSize: 15 }}>￥{withTime[0].amount}</Text>
                            </View>
                        </View>
                        <View style={[styles.iInfoChild]}>
                            <Text style={{ fontSize: 12 }}>温馨提示：暂时无法正常享受门店服务请及时还款，避免逾期给您带来的不便。</Text>
                        </View>
                    </TouchableOpacity>
                </BoxShadow>
        } else {
            if (data.length === 0) {
                dom =
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: 'red', fontSize: 13 }}>您目前还没有分期服务，快去寻找您心仪的产品吧！</Text>
                    </View>
            } else {
                let photo
                photo = data[0].photo.split(',')[0]
                dom =
                    <BoxShadow setting={shadowOpt}>
                        <TouchableOpacity style={styles.installInfo} onPress={this.goMyStage}>
                            {data[0].staffName ?
                                <View style={[styles.iInfoChild]}>
                                    <Text style={[styles.blueFont, { fontSize: 16 }]}>{data[0].storeName}</Text>
                                    <Text style={{ color: '#666' }}>美疗师：<Text style={{ color: 'black' }}>{data[0].staffName}</Text></Text>
                                </View> :
                                <View style={[styles.iInfoChild]}>
                                    <Text style={[styles.blueFont, { fontSize: 16 }]}>{data[0].storeName}</Text>
                                    <Text style={{ color: '#666' }}>美疗师：<Text style={{ color: 'black' }}>未关联</Text></Text>
                                </View>
                            }
                            <View style={[styles.iInfoChild, { height: 150 }]}>
                                <View style={{ width: 100, height: 100, overflow: 'hidden', borderRadius: 3 }}>
                                    <Image source={{ uri: photo }} style={{ width: 100, height: 100 }}></Image>
                                </View>
                                <View style={{
                                    width: '45%', height: 120, justifyContent: 'space-between',
                                    alignItems: 'flex-start', paddingTop: 10, paddingBottom: 10,
                                    // borderWidth:1
                                }}>
                                    <View>
                                        <Text>{data[0].name}</Text>
                                        <Text style={{ fontSize: 13, color: '#666', marginTop: 5 }}>VIP客户特供</Text>
                                    </View>
                                    <Text style={{ color: 'red' }}>共{data[0].stagesNumber}期，每期{data[0].stagesPrice}</Text>
                                </View>
                                <View style={{ height: 120, justifyContent: 'space-between', paddingTop: 10, paddingBottom: 10 }}>
                                    <Text style={{ fontSize: 15 }}>￥{data[0].amount}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </BoxShadow>
            }
        }
        let infoDom
        if (withTime.length === 0) {
            if (data.length === 0) {
                infoDom = <Text style={styles.blueFont}>暂无服务</Text>
            } else {
                infoDom = <Text style={styles.blueFont}>正常服务中</Text>
            }
        } else {
            infoDom = <Text style={[styles.blueFont, { color: 'red' }]}>服务已逾期</Text>
        }
        return (
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 10, backgroundColor: 'white' }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        colors={['rgb(255, 176, 0)', "#ffb100"]}
                        onRefresh={() => this.onRefresh()}
                    />
                }>
                <View style={{ alignItems: 'center' }}>

                    <Carousel {...this.props} refresh={this.onRefresh} />

                    <View style={styles.Installment}>
                        <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text style={[styles.ListTitle, { marginRight: 10 }]}>分期服务</Text>
                                {infoDom}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Text onPress={this.goMyStage}>更多</Text>
                                <Feather name='chevron-right'></Feather>
                            </View>
                        </View>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            {dom}
                        </View>
                    </View>
                    <View style={styles.NearbyStores}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={styles.ListTitle}>附近门店</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text onPress={this.storeMore}>更多</Text>
                                <Feather name='chevron-right' size={13}></Feather>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            {list}
                        </View>
                    </View>
                </View>
                <Modal
                    isVisible={copyModal}
                    backdropOpacity={0}
                    style={styles.addShoppingcartModal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <Text style={styles.addShoppingcartHint}>复制成功</Text>
                </Modal>
            </ScrollView>
        );
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
        borderRadius:10
    },
    addShoppingcartModal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    moreText: {
        fontSize: 13,
        color: '#595959',
        width: '100%',
        overflow: 'hidden',
    },
    Installment: {
        width: '94%',
        marginTop: 20,
        alignItems: 'center'
    },
    installInfo: {
        marginTop: 10,
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        backgroundColor: 'white',
        height: 200,
        width: '100%'
    },
    iInfoChild: {
        width: '95%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    NearbyStores: {
        marginTop: 20,
        width: '94%'
    },
    ListTitle: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    blueFont: {
        fontSize: 13,
        color: '#3186E5'
    },
    ListItem: {
        width: '94%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    itemMidInfo: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingBottom: 3,
        paddingTop: 3,
        width: '50%',
        height: 90,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    VMark: {
        position: 'absolute',
        width: 30,
        height: 20,
        backgroundColor: 'orange',
        top: 5
    },
    goodsImage: {
        width: 90,
        height: 90,
        borderRadius: 3,
        overflow: 'hidden'
    }
})

function mapStateToProps(state) {
    return {
        cityPosition: state.userReducer.cityPosition,
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(UserHome)