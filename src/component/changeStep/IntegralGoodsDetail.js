import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight } from 'react-native';

export default class IntegralGoodsDetail extends Component {
    state = {
        goodsInfo: [{
            id: 1,
            name: '我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称我是名称',
            price: 380,
            num: 198,
            intePrice: 375
        }]
    }
    // 挂载完毕获取数据
    componentDidMount() {
        console.log(JSON.stringify(this.props.route.params.goodsid))
    }

    toback = () => {
        this.props.navigation.goBack()
    }
    ToSure = (i) => {
        this.props.navigation.navigate('SureExchange', { goodsid: i })
    }
    render() {
        let item = this.state.goodsInfo[0]
        return (
            <View style={{ backgroundColor: 'white', flex: 1, paddingTop:30 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback}>
                        <Ionicons
                            name="md-arrow-back"
                            style={{ fontSize: 28 }}></Ionicons>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: 'black' }}>详情</Text>
                    <TouchableOpacity onPress={this.toback}>
                        <Ionicons
                            name="ios-cart-outline"
                            style={{ fontSize: 20 }}></Ionicons>
                    </TouchableOpacity>
                </View>
                <View
                    style={{ alignItems: 'center', flex: 1 }}
                >
                    <View style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={{ width: '100%', height: 400, backgroundColor: '#ccc' }}>
                            </View>
                            <View style={{ height: 200, padding: 20, justifyContent: 'space-evenly' }}>
                                <View style={styles.gInfo}>
                                    <Text style={{ fontWeight: 'bold', width: '80%' }}>{item.name}</Text>
                                    <View style={styles.fengeLine}></View>
                                    <View style={styles.gShareBtn}>
                                        <Ionicons name='ios-share-outline' size={24}></Ionicons>
                                        <Text style={{ color: '#ccc' }}>分享</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 24, color: 'red' }}>{item.intePrice}积分</Text>
                                    <View style={styles.qianggouMark}>
                                        <Text style={{ fontSize: 12, color: 'red' }}>限时抢购</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ color: '#ccc' }}>价格：<Text style={{ textDecorationLine: 'line-through' }}>￥{item.price}</Text></Text>
                                    <Text style={{ marginLeft: 10, color: '#ccc' }}>{item.num}人已兑换</Text>
                                </View>
                            </View>
                            <View style={{ height: 800, padding: 20, backgroundColor: '#F5F5F5' }}>
                                <Text>{item.name}</Text>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.fixedFoot}>
                        <View style={{ width: '40%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'red', fontSize: 20 }}>{item.intePrice} 积分</Text>
                        </View>
                        <View style={{ width: '60%' }}>
                            <TouchableHighlight onPress={() => this.ToSure(item.id)}>
                                <View style={styles.rightExchange}>
                                    <Text style={{ color: 'white', fontSize: 20, }}>兑换</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 55,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    fixedFoot: {
        width: '100%',
        height: 50,
        backgroundColor: 'pink',
        flexDirection: 'row'
    },
    gInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    fengeLine: {
        height: 40,
        borderRightWidth: 1,
        borderColor: '#ccc',
        marginLeft: 20,
        marginRight: 20
    },
    gShareBtn: {
        width: 50,
        height: 50,
        alignItems: 'center',
    },
    qianggouMark: {
        borderWidth: 1,
        borderColor: 'red',
        paddingLeft: 3,
        paddingRight: 3,
        borderRadius: 5,
        marginLeft: 10
    },
    rightExchange: {
        backgroundColor: 'red',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
})