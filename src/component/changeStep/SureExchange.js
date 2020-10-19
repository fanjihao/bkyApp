import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';

export default class SureExchange extends Component {
    state = {
        goodsInfo: [{
            id: 1,
            name: '我是名称我是名称',
            price: 380,
            num: 198,
            intePrice: 375
        }],
        address: [{
            address: '北京市朝阳区青年汇佳园10号楼102',
            person: 'piu先生',
            tel: '13154624893',
            defaultAddress: 1
        }]
    }
    // 挂载完毕获取数据
    componentDidMount() {
        console.log(JSON.stringify(this.props.route.params.goodsid))
    }

    toback = () => {
        this.props.navigation.goBack()
    }
    toAdd = () => {
        this.props.navigation.navigate('MyAddress')
    }
    toChange = () => {
        this.props.navigation.navigate('MyAddress')
    }
    SureExchange = () => {
        this.props.navigation.navigate('ExchangeSuccess')
    }
    render() {
        let item = this.state.goodsInfo[0]
        const { address } = this.state
        let addressDom
        if (address.length === 0) {
            addressDom =
                <TouchableOpacity onPress={this.toAdd}>
                    <View style={styles.NoAddress}>
                        <Ionicons name='md-add' size={24}></Ionicons>
                        <Text style={{ fontSize: 16 }}>您还没有添加收货地址，请移步添加收货地址</Text>
                    </View>
                </TouchableOpacity>
        } else {
            let data = address.filter(item => item.defaultAddress === 1)[0]
            addressDom =
                <TouchableOpacity onPress={this.toChange}>
                    <View style={styles.DefaultAddress}>
                        <Text>收货地址</Text>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.addressFont}>{data.address}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.addressFont, { marginRight: 5 }]}>{data.person}</Text>
                                <Text style={styles.addressFont}>{data.tel}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
        }
        return (
            <View style={{ backgroundColor: 'white', flex: 1, paddingTop:30 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback}>
                        <Ionicons
                            name="md-arrow-back"
                            style={{ fontSize: 28 }}></Ionicons>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, color: 'black' }}>确认兑换</Text>
                    <TouchableOpacity onPress={this.toback}>
                        <Ionicons
                            name="ios-cart-outline"
                            style={{ fontSize: 20 }}></Ionicons>
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', flex: 1, width: '100%' }}>
                    <View style={{ flex: 1, width: '98%' }}>
                        <View style={{ width: '100%', height: 60, marginBottom: 20 }}>
                            {addressDom}
                        </View>
                        <View style={{
                            width: '100%', height: 200,
                            justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#b1b1b1'
                        }}>
                            <View style={styles.SEgoodsInfo}>
                                <View style={{ width: 100, height: 100, backgroundColor: '#ccc' }}></View>
                                <View style={{ width: '70%', height: 100, justifyContent: 'space-evenly' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>x1</Text>
                                </View>
                            </View>
                            <View style={styles.childLine}></View>
                            <View style={styles.heji}>
                                <Text>积分合计</Text>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{ fontWeight: 'bold' }}>{item.intePrice}</Text>
                                    <Text style={{ fontSize: 12, color: 'red' }}>积分剩余{item.intePrice}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.fixedFoot}>
                        <View style={{ width: '40%', backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'red', fontSize: 16 }}>合计 {item.intePrice} 积分</Text>
                        </View>
                        <View style={{ width: '60%' }}>
                            <TouchableHighlight onPress={this.SureExchange}>
                                <View style={styles.rightExchange}>
                                    <Text style={{ color: 'white', fontSize: 16, }}>确认兑换</Text>
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
        flexDirection: 'row'
    },
    rightExchange: {
        backgroundColor: 'red',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    NoAddress: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingLeft: 20,
        width: '100%',
        borderWidth: 1
    },
    DefaultAddress: {
        padding: 10,
        flexDirection: 'row',
        height: 70,
        width: '100%',
        borderWidth: 1,
        justifyContent: 'space-between',
        borderColor: '#b1b1b1'
    },
    addressFont: {
        color: '#B1B1B1'
    },
    SEgoodsInfo: {
        width: '100%',
        height: 100,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
    },
    childLine: {
        borderBottomWidth: 1,
        borderColor: '#b1b1b1',
        width: '100%'
    },
    heji: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        alignItems: 'center'
    }
})