import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

export default class UserStageDetail extends Component {
    state = {
        nowTime: '',
        orderCheck: false,
        data: '',
        rePayPlan: [],
        photo:''
    }

    componentDidMount() {
        let formData = new FormData()
        formData.append('orderId', this.props.route.params.orderId)
        axios({
            url: '/api/userStages/userOrderDetails',
            method: 'POST',
            data: formData
        })
            .then(res => {
                console.log('分期项目详情：', res.data.data)
                this.setState({
                    data: res.data.data,
                    rePayPlan: res.data.data.list
                }, () => {
                    const { data } = this.state
                    let photo
                    if (data.photo.indexOf(',') === -1) {
                        photo = data.photo
                    } else {
                        photo = data.photo.split(',')[0]
                    }
                    this.setState({
                        photo
                    })
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    // 展开订单
    orderSwitch = () => {
        this.setState({ orderCheck: !this.state.orderCheck })
    }

    // 还款
    toRefund = (item, num, orderId, id) => {
        this.props.navigation.navigate('UserRefund', { item, num, orderId, id })
    }
    already = (item, num, orderId, id) => {
        this.props.navigation.navigate('AlreadyPay', { item, num, orderId, id })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { orderCheck, data, rePayPlan, photo } = this.state
        const order =
            <View>
                <View style={{ flexDirection: 'row', borderBottomColor: '#EEEEEE', borderBottomWidth: 1, alignItems: 'center' }}>
                    <Image style={styles.goodsImage} source={{ uri: photo }}>
                    </Image>
                    <View style={{ justifyContent: 'space-around', height: 70 }}>
                        <Text style={styles.orderDetailTitle}>{data.name}</Text>
                        <Text style={{ color: '#E90058' }}>￥{data.stagesPrice}/{data.stagesNumber}期</Text>
                    </View>
                </View>

                <View style={{ marginBottom: 15 }}>
                    <View style={styles.orderDetail}>
                        <Text style={styles.orderDetailTitle}>订单编号：</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.text}>{data.orderId}</Text>
                            <Text style={styles.copy}>复制</Text>
                        </View>
                    </View>
                    <View style={styles.orderDetail}>
                        <Text style={styles.orderDetailTitle}>下单时间：</Text>
                        <Text style={styles.text}>{data.createTime}</Text>
                    </View>
                    <View style={styles.orderDetail}>
                        <Text style={styles.orderDetailTitle}>订单状态：</Text>
                        {data.type === 1 ?<View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#1195E3', fontSize: 16, fontWeight: 'bold', marginRight: 5 }}>正常分期中</Text>
                            <Text style={styles.text}>剩余{data.surplusNum}期共￥{data.totalAmount}</Text>
                        </View> : null}
                        {data.type === 2 ?<View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#1195E3', fontSize: 16, fontWeight: 'bold', marginRight: 5 }}>已还清</Text>
                        </View> : null}
                        {data.type === 3 ?<View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', marginRight: 5 }}>已逾期,请尽快还款</Text>
                        </View> : null}
                    </View>
                    <View style={styles.orderDetail}>
                        <Text style={styles.orderDetailTitle}>支付方式</Text>
                        {data.payType === 'alipay' ? <Text style={styles.text}>支付宝支付</Text> : null}
                    </View>
                </View>
            </View>
        return (
            <ScrollView contentContainerStyle={{ paddingTop:30}}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>分期详情</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                {data.type === 2 ?
                <View style={{ alignItems: 'center', backgroundColor: '#279EE4', padding: 20, height:150, justifyContent:'center' }}>
                    <Text style={{ fontSize: 30, color: 'white' }}>已还清</Text>
                </View> : null}
                {data.type === 1 ? 
                <View style={{ alignItems: 'center', backgroundColor: '#279EE4', padding: 20 }}>
                    <Text style={{ color: 'white' }}>待还{data.surplusNum}期</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'white' }}>￥</Text>
                        <Text style={{ fontSize: 40, margin: 10, color: 'white' }}>{data.stagesPrice}</Text>
                    </View>
                    <Text style={{ color: 'white' }}>合计需还￥{data.stagesPrice * data.surplusNum}  免息分期</Text>
                </View> : null}
                {data.type === 3 ? 
                <View style={{ alignItems: 'center', backgroundColor: '#279EE4', padding: 20 }}>
                    <Text style={{ color: 'red' }}>当前已逾期,待还{data.surplusNum}期</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ color: 'red' }}>￥</Text>
                        <Text style={{ fontSize: 40, margin: 10, color: 'red' }}>{data.stagesPrice}</Text>
                    </View>
                    <Text style={{ color: 'red' }}>合计需还￥{data.stagesPrice * data.surplusNum}  免息分期</Text>
                </View> : null}

                <TouchableHighlight onPress={this.orderSwitch}>
                    <View style={{ backgroundColor: 'white' }}>
                        <View style={styles.title}>
                            <Text style={styles.orderDetailTitle}>订单详情</Text>
                            <AntDesign name={orderCheck === false ? 'right' : 'down'} size={16} />
                        </View>
                        {orderCheck === false ? null : order}
                    </View>
                </TouchableHighlight>

                <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                    {rePayPlan.map((item, index) => {
                        if (item.type === 1) {
                            return (
                                <TouchableOpacity style={styles.stage} key={item.id} onPress={() => this.already(item, index + 1)}>
                                    <View>
                                        <Text style={styles.stageText}>{index + 1}/{rePayPlan.length}期</Text>
                                        <Text style={styles.stageText}>{item.repaymentTime} 期已还清</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.stageText}>￥{item.repaymentAmount}</Text>
                                        <AntDesign name="right" size={16} style={styles.stageIcon} />
                                    </View>
                                </TouchableOpacity>
                            )
                        } else {
                            return (
                                <TouchableOpacity onPress={() => this.toRefund(item, index + 1, this.props.route.params.orderId, data.id)} key={item.id}>
                                    <View style={styles.stage}>
                                        <View>
                                            <Text>{index + 1}/{rePayPlan.length}期</Text>
                                            <Text>{item.repaymentTime} 期待还</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text>￥{item.repaymentAmount}</Text>
                                            <AntDesign name="right" size={16} style={styles.stageIcon} />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    })}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    title: {
        flexDirection: 'row',
        margin: 15,
        height: 40,
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: 1,
        marginBottom: 0
    },
    goodsImage: {
        width: 70,
        height: 70,
        margin: 15,
    },
    orderDetail: {
        flexDirection: 'row',
        margin: 15,
        justifyContent: 'space-between',
        marginBottom: 0
    },
    orderDetailTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    text: {
        color: '#999999'
    },
    copy: {
        borderWidth: 1,
        marginLeft: 10,
        width: 40,
        textAlign: 'center',
        borderColor:'#ccc',
        color:'#999'
    },
    stage: {
        margin: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#EEEEEE',
        borderBottomWidth: 1,
        marginBottom: 0,
        paddingBottom: 15
    },
    stageText: {
        color: '#B6B6B6'
    },
    stageIcon: {
        marginLeft: 10
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