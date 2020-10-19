import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import formatTime from '../modules/FormatTime';

class Evaluation extends Component {
    state = {
        orderDetail: '',
        agentLevel: null,
        commont: ''
    }
    componentDidMount() {
        storage.load({ key: 'agentLevel' })
            .then(ret => {
                this.setState({
                    orderDetail: this.props.route.params.detail,
                    agentLevel: ret
                })
            })
            .catch(err => {

            })
    }
    // 回到上一级
    toback = () => {
        this.props.navigation.goBack()
    }
    toComment = () => {
        console.log(this.state.orderDetail, this.state.commont)
        axios({
            url:'/api/order/comment',
            method:'POST',
            data:{
                productScore: 5,
                serviceScore: 5,
                unique: this.state.orderDetail.unique,
                pics: "asdasd",
                comment: this.state.commont
            }
        })
        .then(res => {
            this.props.navigation.goBack('OrderDetail')
        })
        .catch(err => {
            console.log(err)
        })
    }
    render() {
        const { agentLevel, commont } = this.state
        const orderDetail = this.props.route.params.detail
        return (
            <View style={{ backgroundColor: '#f5f5f5', elevation: 1, flex: 1, }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback}
                        style={{ width: 50, height: 50, justifyContent: 'center' }}>
                        <Ionicons
                            name="md-arrow-back"
                            style={{ fontSize: 20, color: 'white' }}></Ionicons>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, color: 'white', fontWeight: 'bold' }}>评价</Text>
                    <View style={{ width: 50 }}></View>
                </View>
                <View style={styles.orderDetailInfo}>

                    <View style={styles.goodsInfo}>
                        <View style={styles.productInfo}>
                            <Image source={{ uri: orderDetail.productInfo.image }} style={styles.goodsImage} />
                            <View style={{ justifyContent: 'space-evenly', height: 50 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ width: 195 }}>{orderDetail.productInfo.storeName}</Text>
                                    <Text>x{orderDetail.cartNum}</Text>
                                </View>
                                <Text style={{ color: '#E93323' }}>￥{agentLevel === 4 ? orderDetail.truePrice : orderDetail.vipTruePrice}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.evaPart}>
                    <TextInput
                        style={styles.textarea}
                        multiline={true}
                        numberOfLines={8}
                        value={commont}
                        onChangeText={text => this.setState({ commont: text })}
                        placeholder='商品满足你的期待么？说说你的想法，分享给想买的他们吧~'></TextInput>
                    <Text style={styles.evaBtn} onPress={this.toComment}>立即评价</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    evaBtn: {
        width: '94%',
        height: 50,
        lineHeight: 50,
        textAlign: 'center',
        backgroundColor: '#E93323',
        color: 'white',
        borderRadius: 100,
        fontSize: 16,
        marginTop: 50
    },
    textarea: {
        backgroundColor: '#FAFAFA',
        textAlignVertical: 'top',
        width: '94%',
        borderRadius: 5,
        marginTop: 20,
        padding: 15
    },
    header: {
        width: '100%',
        height: 75,
        borderColor: 'rgba(0,0,0,0.1)',
        backgroundColor: '#E93323',
        alignItems: 'center',
        flexDirection: 'row',
        position: 'relative',
        zIndex: 999,
        paddingTop: 30,
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 20,
    },
    orderDetailInfo: {
        marginTop: 10,
        backgroundColor: 'white'
    },
    totalNum: {
        height: 37,
        lineHeight: 37,
        paddingLeft: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7F7'
    },
    productInfo: {
        marginLeft: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F7F7F7',
        // justifyContent: 'space-between',
        alignItems: 'center',
        height: 77
    },
    goodsImage: {
        width: 56,
        height: 56,
        marginRight: 10
    },
    orderInfo: {
        marginTop: 10,
        backgroundColor: 'white'
    },
    orderInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 10
    },
    info: {
        color: '#9C9C9C'
    },
    evaPart: {
        width: '100%',
        height: 500,
        backgroundColor: 'white',
        alignItems: 'center'
    },
})

export default Evaluation