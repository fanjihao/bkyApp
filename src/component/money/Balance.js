import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather'

class Balance extends Component {
    state = {
        recomGoodsList: [
            {
                id: 1,
                name: '九十五熏浴散1',
                price: '3998'
            },
            {
                id: 2,
                name: '九十五熏浴散2',
                price: '25'
            },
            {
                id: 3,
                name: '九十五熏浴散3',
                price: '12'
            },
        ],
        personInfo: ''
    }
    // 挂载完毕获取数据
    componentDidMount() {
        axios({
            method: 'GET',
            url: '/api/user'
        })
            .then(res => {
                console.log('获取用户个人信息成功', res)
                this.setState({
                    personInfo: res.data.data
                })
            })
            .catch(err => {
                console.log('获取用户个人信息失败', err)
            })
    }
    toback = () => {
        this.props.navigation.goBack()
    }
    withdrawal = () => { // 提现
        console.log('提现')
        this.props.navigation.navigate('WithDrawal', { balance: this.state.personInfo.nowMoney })
    }
    topup = () => { // 充值
        console.log('充值')
        this.props.navigation.navigate('TopUp')
    }
    render() {
        const { recomGoodsList, personInfo } = this.state
        console.log('用户信息', personInfo)
        let goodsDom = recomGoodsList.map(item => {
            return (
                <View key={item.id} style={styles.goodsItem}>
                    <View style={styles.goodsImg}>
                        <Image source={require('../../assets/img/goods/95xys2.jpg')} style={{ width: '100%', height: '100%' }}></Image>
                    </View>
                    <Text>{item.name}</Text>
                    <Text>￥{item.price}</Text>
                </View>
            )
        })
        return (
            <ScrollView style={{ backgroundColor: '#F4F6F8', flexGrow: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback} style={{ width: 50, height: 50 }}>
                        <Feather name="chevron-left" size={24} style={{ fontSize: 20, color: 'white', margin: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>我的余额</Text>
                    <View style={{ width: 50 }}></View>
                </View>
                <View style={styles.promoteTop}>
                    <Image style={styles.headImg}
                        source={{ uri: personInfo.avatar }}>
                    </Image>
                    <Text style={{ color: 'white', fontSize: 16 }}>我的账户余额（元）</Text>
                    <Text style={styles.myBalance}>{personInfo.nowMoney}</Text>
                    {/* <Text style={{ color: 'white', fontSize: 16 }}>昨日收益+500.00</Text> */}
                </View>
                <View style={styles.balanceMid}>
                    <TouchableOpacity style={{ width: '40%', height: '50%', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#1295E4', borderRadius: 18, }}
                        onPress={this.withdrawal}>
                        <Text style={{ color: 'white', fontSize: 18 }}>提现</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '40%', height: '50%', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#1295E4', borderRadius: 18, }}
                        onPress={this.topup}>
                        <Text style={{ color: 'white', fontSize: 18 }}>充值</Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={styles.recommend}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 50, borderWidth: 1 }}></View>
                        <Text style={{ fontSize: 18 }}>为你推荐</Text>
                        <View style={{ width: 50, borderWidth: 1 }}></View>
                    </View>
                    <Text style={{ color: '#ABABAB', marginBottom: 10, marginTop: 10 }}>你的喜欢，我都懂得</Text>
                    <View style={styles.recomGoods}>
                        {goodsDom}
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>查看更多</Text>
                        <Feather name='chevron-right'></Feather>
                    </View>
                </View> */}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        // height: 55,
        backgroundColor: '#1295E4',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 30,
    },
    promoteTop: {
        width: '100%',
        height: 300,
        backgroundColor: '#1295E4',
        alignItems: 'center',
        paddingTop: 20
    },
    headImg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 20,
        overflow: 'hidden'
    },
    myBalance: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        marginTop: 20
    },
    balanceMid: {
        width: '100%',
        height: 100,
        backgroundColor: 'white',
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent:'space-evenly',
    },
    balanceBtn: {
        width: '80%',
        height: '100%',
        backgroundColor: '#1295E4',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    recommend: {
        width: '100%',
        paddingBottom: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        paddingTop: 30,
    },
    recomGoods: {
        width: '90%',
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    goodsItem: {
        alignItems: 'center'
    },
    goodsImg: {
        width: 100,
        height: 100,
        backgroundColor: '#ccc'
    }
})

export default Balance