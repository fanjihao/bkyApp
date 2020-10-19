import React, { Component } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, RefreshControl
} from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

class MyStage extends Component {
    state = {
        stageType: 4,
        stageList: [],
        data: [],
        tipsModal: false,
        tipsId: '',
        promptModal: false,
        refreshing: true,
    }
    componentDidMount() {
        this.getUserStageInfo(4)
    }
    // 用户分期信息
    getUserStageInfo = (type) => {
        axios({
            method: 'POST',
            url: '/api/userStages/userStagesDetails',
            data: {
                id: this.props.personInfo.uid,
                limit: 10,
                offset: 1,
                // 1分期中 2以完成分期 3异常分期 4未处理
                type: type
            }
        })
            .then(res => {
                console.log('分期中:', res.data.data.list)
                this.setState({
                    data: res.data.data.list,
                    refreshing: false,
                })
            })
            .catch(err => {
                console.log('用户分期信息查询失败', err)
            })
    }

    getNoPayStage = (id) => {
        let formData = new FormData()
        formData.append('orderId', id)
        axios({
            url: '/api/userStages/userOrderDetails',
            method: 'POST',
            data: formData
        })
            .then(res => {
                console.log('分期项目详情：', res.data.data.list[1])
                this.nowToPay(res.data.data.list[1].payOrderId)
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 待付款
    toObligation = () => {
        this.setState({ stageType: 4 },
            () => this.getUserStageInfo(4)
        )
    }
    // 分期中
    toUnderWay = () => {
        this.setState({ stageType: 1 },
            () => this.getUserStageInfo(1)
        )
    }
    // 已完成分期
    toDone = () => {
        this.setState({ stageType: 2 },
            () => this.getUserStageInfo(2)
        )
    }
    // 异常分期
    toUnusual = () => {
        this.setState({ stageType: 3 },
            () => this.getUserStageInfo(3)
        )
    }
    onRefresh = i => {
        this.getUserStageInfo(i)
    }
    // 查看详情
    toDetail = (id) => {
        this.props.navigation.navigate('UserStageDetail', id)
    }
    // 取消订单
    orderCancel = (id) => {
        this.setState({
            tipsModal: true,
            tipsId: id
        })
    }
    immediatelyOrder = () => {
        axios({
            url: '/api/userStages/cancelOrder',
            method: 'GET',
            params: {
                orderId: this.state.tipsId
            }
        })
            .then(res => {
                this.toObligation()
                this.setState({
                    tipsModal: false,
                    tipsId: ''
                }, () => {
                    this.setState({
                        promptModal: false
                    })
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    nowToPay = (id) => {
        let formData = new FormData()
        formData.append('orderId', id)
        // formData.append('orderId', id)
        // formData.append('orderId', id)
        // formData.append('orderId', id)
        // formData.append('orderId', id)
        axios({
            url: '/api/userStages/pay',
            method: 'POST',
            data: {
                orderId:id
            }
        })
            .then(res => {
                console.log('订单:', res.data.data)
                this.props.navigation.navigate('PayPage', { dom: res.data.data })
            })
            .catch(err => {
                console.log(err)
            })
    }
    orderDetail = (id) => {
        this.props.navigation.navigate('UserStageDetail', { orderId: id })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { stageType, data, tipsModal, promptModal, refreshing } = this.state
        let dom
        if (data.length === 0) {
            dom = <Image source={require('../../assets/img/notInfo/noStageOrder.png')} style={styles.notGoods}></Image>
        } else {
            dom = data.map(item => {
                let photo
                if (item.photo.indexOf(',') === -1) {
                    photo = item.photo
                } else {
                    photo = item.photo.split(',')[0]
                }
                return (
                    <View key={item.orderId} style={styles.stageItem}>
                        <View style={styles.serve}>
                            <Text>{item.storeName}</Text>
                            <Text>美疗师：{item.staffId ? item.staffName : '未关联'}</Text>
                        </View>
                        <View style={styles.goods}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ color: '#BFBFBF', margin: 10, fontWeight: 'bold' }}>{item.createTime}</Text>
                                {stageType === 4 ? <Text style={{ color: '#BFBFBF', margin: 10, fontWeight: 'bold' }}>待付款</Text> : null}
                                {stageType === 1 ? <Text style={{ color: '#EB2668', margin: 10, fontWeight: 'bold' }}>分期中</Text> : null}
                                {stageType === 2 ? <Text style={{ color: '#999', margin: 10, fontWeight: 'bold' }}>已完成</Text> : null}
                                {stageType === 3 ? <Text style={{ color: '#F04754', margin: 10, fontWeight: 'bold' }}>逾期</Text> : null}
                            </View>
                            <View style={{ borderWidth: 1, borderColor: '#EEEEEE' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Image style={styles.goodsImage} source={{ uri: photo }}>
                                        </Image>
                                        <Text style={{ marginTop: 20 }}>{item.name}</Text>
                                    </View>
                                    {stageType === 4 
                                    ? <Text style={{ margin: 10, color: '#A1A1A1' }}>首付款￥{item.amount}</Text> 
                                    : <Text style={{ margin: 10, color: '#A1A1A1' }}>分期总金额￥{item.amount + ((item.stagesNumber - 1) * item.stagesPrice)}</Text>}
                                </View>
                                {stageType === 4 ? <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'flex-end' }}>
                                    <Text>共一项分期，合计</Text>
                                    <Text style={{ marginLeft: 10, color: '#E90058' }}>
                                        ￥{item.stagesPrice.toFixed(2)}*{item.stagesNumber}期
                                                        </Text>
                                </View> : null}
                                {stageType === 1 ? <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'flex-end' }}>
                                    <Text style={{ marginLeft: 10, color: '#E90058' }}>
                                        ￥{item.stagesPrice.toFixed(2)}*{item.stagesNumber}期
                                                        </Text>
                                </View> : null}
                                {stageType === 2 ? <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'flex-end' }}>
                                    <Text>已还清</Text>
                                </View> : null}
                                {stageType === 3 ? <View style={{ flexDirection: 'row', margin: 10, justifyContent: 'flex-end' }}>
                                    <Text>已逾期</Text>
                                    <Text style={{ marginLeft: 10, color: '#E90058' }}>
                                        ￥{item.stagesPrice.toFixed(2)}*{item.stagesNumber}期
                                                        </Text>
                                </View> : null}
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                {stageType === 4 ? <Text style={styles.cancel} onPress={() => this.orderCancel(item.orderId)}>取消订单</Text> : null}
                                {stageType === 4 ? <Text style={styles.look} onPress={() => this.nowToPay(item.orderId)}>立即付款</Text> : null}
                                {stageType === 1 ? <Text style={styles.look} onPress={() => this.orderDetail(item.orderId)}>查看详情</Text> : null}
                                {stageType === 2 ? <Text style={[styles.look, { color:'white', backgroundColor:'#ccc'}]} onPress={() => this.orderDetail(item.orderId)}>查看详情</Text> : null}
                                {stageType === 3 ? <Text style={[styles.look, { color:'white', backgroundColor:'red'}]} onPress={() => this.orderDetail(item.orderId)}>查看详情</Text> : null}
                            </View>
                        </View>
                    </View>
                )
            })
        }
        return (
            <View style={{ backgroundColor: '#F5F5F5', paddingTop:30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>我的分期</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>
                <View style={styles.stageType}>
                    <Text style={stageType === 4 ? styles.nowStageType : styles.oldStageType} onPress={this.toObligation}>待付款</Text>
                    <Text style={stageType === 1 ? styles.nowStageType : styles.oldStageType} onPress={this.toUnderWay}>分期中</Text>
                    <Text style={stageType === 2 ? styles.nowStageType : styles.oldStageType} onPress={this.toDone}>已完成分期</Text>
                    <Text style={stageType === 3 ? styles.nowStageType : styles.oldStageType} onPress={this.toUnusual}>异常分期</Text>
                </View>
                <Modal
                    isVisible={tipsModal}
                    onBackdropPress={() => this.setState({ tipsModal: false, tipsId: '' })}
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
                            <Text>请问您是否要取消这份订单呢？</Text>
                        </View>
                        <View style={styles.modalBtn}>
                            <TouchableOpacity style={styles.modalcan} onPress={this.immediatelyOrder}>
                                <Text style={{ color: '#4EA4FB', }}>是</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalcan, { borderLeftWidth: 1, borderColor: '#ccc' }]} onPress={() => this.setState({ tipsModal: false, tipsId: '' })}>
                                <Text style={{ color: '#4EA4FB', }}>否</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    isVisible={promptModal}
                    onBackdropPress={() => this.setState({ promptModal: false })}
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
                            <Text>订单取消成功！</Text>
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <ScrollView contentContainerStyle={{ paddingBottom:100, alignItems: 'center' }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            colors={['rgb(255, 176, 0)', "#ffb100"]}
                            onRefresh={() => this.onRefresh(stageType)}
                        />}>
                    {dom}
                </ScrollView>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    notGoods: {
        width: 175,
        height: 145,
        marginTop: 50
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
        height: '100%',
    },
    stageType: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        // borderBottomWidth: 1,
        color: '#808080',
        borderBottomColor: '#C4C4C4',
        backgroundColor: 'white'
    },
    nowStageType: {
        width: '20%',
        color: '#108EE9',
        borderBottomColor: '#1195E3',
        borderBottomWidth: 2,
        height: 48,
        lineHeight: 48,
        textAlign: 'center'
    },
    oldStageType: {
        width: '20%',
        height: 48,
        lineHeight: 48,
        color: '#808080',
        textAlign: 'center'
    },
    stageItem: {
        // marginLeft: 10,
        // marginRight:10,
        width: '94%'
    },
    serve: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    goods: {
        backgroundColor: 'white',
        borderRadius: 5
    },
    goodsImage: {
        width: 70,
        height: 70,
        margin: 10
    },
    cancel: {
        width: 100,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
        borderRadius: 15,
        color: '#B8B8B8',
        borderWidth: 1,
        borderColor: '#B8B8B8',
        fontWeight: 'bold'
    },
    settle: {
        width: 100,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#E90058',
        borderRadius: 15,
        margin: 10,
        fontWeight: 'bold'
    },
    look: {
        width: 100,
        height: 30,
        lineHeight: 30,
        textAlign: 'center',
        borderRadius: 15,
        margin: 10,
        fontWeight: 'bold',
        backgroundColor: '#1195E3',
        color: 'white'
    },
    header: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#eee'
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
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(MyStage)