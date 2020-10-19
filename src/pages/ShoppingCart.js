import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, RefreshControl, StatusBar, Platform } from 'react-native';
import { unitWidth, unitHeight } from '../utils/AdapterUtil';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';

export default class ShoppingCart extends Component {
    state = {
        // 购物车列表
        shoppingGoodsList: [],
        // 是否切换为删除
        isDel: false,
        // 购物数量
        count: 0,
        // 是否全选
        isAll: false,
        // 选中的商品价格
        total: 0,
        refreshing: true,
        promptModal: false,
        agentLevel: 4,
    }

    // 获取购物车列表
    getShoppingCar = () => {
        axios({
            method: 'GET',
            url: '/api/cart/list',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log('获取购物车列表成功', res.data.data.valid)
                let newData = res.data.data.valid
                let list = []
                if (newData.length > 0) {
                    list = newData.map(item => {
                        item.isChecked = false
                        return item
                    })
                }
                this.setState({
                    shoppingGoodsList: list,
                    refreshing: false
                })
            })
            .catch(err => {
                console.log('获取购物车列表失败', err)
            })
    }
    componentDidMount() {
        this.getShoppingCar()
        this.getCartNum()
        
        storage.load({ key: 'agentLevel' })
            .then(ret => {
                this.setState({ agentLevel: ret })
            })
            .catch(err => {

            })
    }
    // 下拉刷新
    onRefresh = () => {
        this.getShoppingCar()
        this.getCartNum()
    }
    // 修改数量
    changeNum = (i, num) => {
        axios({
            url: '/api/cart/num',
            method: 'POST',
            data: {
                id: i,
                number: num
            }
        })
            .then(res => {
                console.log('数量加减成功', res)
                this.getTotal()
                this.getCartNum()
            })
            .catch(err => {
                console.log('数量加减失败', err)
            })
    }
    // 减
    redCount = (i) => {
        const { shoppingGoodsList } = this.state
        let data = shoppingGoodsList.filter(item => {
            if (item.id === i) {
                if (item.cartNum > 1) {
                    item.cartNum--
                }
                return item
            }
        })
        this.changeNum(i, data[0].cartNum)
    }
    // 加
    addCount = (i) => {
        const { shoppingGoodsList } = this.state
        let data = shoppingGoodsList.filter(item => {
            if (item.id === i) {
                item.cartNum++
                return item
            }
        })
        this.changeNum(i, data[0].cartNum)
    }
    // 切换删除、管理
    checkDel = () => {
        this.setState({
            isDel: !this.state.isDel
        })
    }
    // 选中商品
    checked = (i) => {
        const { shoppingGoodsList } = this.state
        let newData = shoppingGoodsList
        if (newData.length > 0) {
            newData.filter((item, index) => {
                if (index === i) {
                    item.isChecked = !item.isChecked
                }
            })
        }
        this.setState({ shoppingGoodsList: newData })

        this.isAllChecked()
        this.getTotal()
    }
    // 全选
    checkedAll = (s) => {
        const { shoppingGoodsList } = this.state
        if (shoppingGoodsList.length > 0) {
            if (s === 'all') {
                this.setState({
                    shoppingGoodsList: shoppingGoodsList.map(item => {
                        item.isChecked = true
                        return item
                    }),
                    isAll: true
                })
            } else {
                this.setState({
                    shoppingGoodsList: shoppingGoodsList.map(item => {
                        item.isChecked = false
                        return item
                    }),
                    isAll: false
                })
            }
        }
        this.getTotal()
    }
    // 判断是否全选
    isAllChecked = () => {
        const { shoppingGoodsList } = this.state
        if (shoppingGoodsList.length === 0) {
            this.setState({ isAll: false })
        } else {
            shoppingGoodsList.filter(item => item.isChecked === false).length === 0
                ? this.setState({ isAll: true })
                : this.setState({ isAll: false })
        }
    }

    // 删除购物车商品
    delGoods = () => {
        const { shoppingGoodsList } = this.state
        let delList = []
        shoppingGoodsList.map(item => {
            if (item.isChecked === true) {
                delList.push(item.id)
            }
        })
        if (delList.length > 0) {
            axios({
                method: 'POST',
                url: '/api/cart/del',
                data: {
                    ids: delList
                }
            })
                .then(res => {
                    console.log('删除成功', res)
                    this.getShoppingCar()
                    this.getCartNum()
                    // this.isAllChecked()
                    // 判断是否全选
                    console.log('123', this.state.shoppingGoodsList)
                    if (delList.length === shoppingGoodsList.length) {
                        this.setState({
                            isAll: false
                        })
                    }
                })
                .catch(err => {

                })
        } else if (delList.length === 0) {
            this.setState({
                promptModal: true
            })
        }
    }
    // 下单
    toGetOrders = () => {
        console.log(this.props)
        const { shoppingGoodsList } = this.state
        let getOrderList = shoppingGoodsList.filter(item => {
            return item.isChecked === true
        })
        if (getOrderList.length > 0) {
            console.log('选中商品', getOrderList)
            let str
            if (getOrderList.length === 1) {
                str = getOrderList[0].id
            } else {
                getOrderList.map(item => {
                    str = str + "," + item.id
                })
            }
            console.log(str)
            axios({
                url: '/api/order/confirm',
                method: 'POST',
                data: {
                    cartId: str
                    // cartId: getOrderList[0].id
                }
            })
                .then(res => {
                    console.log('确认订单成功1', res.data.data.cartInfo)
                    // 判断是否全选
                    if (getOrderList.length === shoppingGoodsList.length) {
                        this.setState({
                            isAll: false
                        })
                    }
                    this.props.navigation.navigate('ShoppingOrder', { getOrderList: res.data.data.cartInfo, orderInfo: res.data.data })
                })
                .catch(err => {
                    console.log('确认订单失败', err)
                })
        } else if (getOrderList.length === 0) {
            this.setState({
                promptModal: true
            })
        }
    }
    // 获取购物数量
    getCartNum = () => {
        axios({
            method: 'GET',
            url: '/api/cart/count'
        })
            .then(res => {
                this.setState({
                    count: res.data.data.count,
                    refreshing: false
                })
            })
            .catch(err => {
                console.log('获取购物数量失败', err)
            })
    }
    // 获取选中商品的价格
    getTotal = () => {
        const { shoppingGoodsList, agentLevel } = this.state
        let newTotal = 0
        shoppingGoodsList.map(item => {
            if (item.isChecked === true) {
                if (agentLevel === 4) {
                    newTotal = item.cartNum * item.productInfo.price + newTotal
                } else {
                    newTotal = item.cartNum * item.productInfo.vipPrice + newTotal
                }
            }
        })
        this.setState({
            total: newTotal
        })
    }

    render() {
        const { shoppingGoodsList, isDel, isAll, total, count, promptModal, refreshing, agentLevel } = this.state

        return (
            <View style={styles.body}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>购物车</Text>
                </View>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            // title={'下拉刷新'}
                            refreshing={refreshing}
                            colors={['rgb(255, 176, 0)', "#ffb100"]}
                            onRefresh={() => this.onRefresh()}
                        />
                    }>

                    <View style={styles.management}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>购物数量</Text>
                            <Text style={{ color: 'red', marginLeft: 5 }}>{count}</Text>
                        </View>
                        <TouchableOpacity onPress={this.checkDel}>
                            <Text style={styles.del}>{isDel === false ? '管理' : '取消'}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 10, backgroundColor: '#EEEEEE' }}></View>
                    <View>
                        {shoppingGoodsList === [] ? null : shoppingGoodsList.map((item, index) => {
                            let img = item.productInfo.image.split(',')[0]
                            return (
                                <View key={item.id} style={styles.list}>

                                    {
                                        item.isChecked === true
                                            ? <TouchableOpacity style={styles.checked} onPress={() => this.checked(index)}>
                                                <Feather name="check" color={'white'} />
                                            </TouchableOpacity>
                                            : <TouchableOpacity style={styles.circle} onPress={() => this.checked(index)}></TouchableOpacity>
                                    }

                                    <View style={styles.info}>
                                        <Image source={{ uri: img }} style={styles.image}></Image>
                                        <View style={styles.textInfo}>
                                            <Text>{item.productInfo.storeName}</Text>
                                            <View style={styles.detail}>
                                                <Text>
                                                    ￥{agentLevel === 4 ? item.productInfo.price : item.productInfo.vipPrice}
                                                </Text>
                                                <View style={{ flexDirection: 'row', height: 30 }}>
                                                    <TouchableOpacity style={styles.changeAmountBtn} onPress={() => this.redCount(item.id)}>
                                                        <Text>—</Text>
                                                    </TouchableOpacity>
                                                    <View style={styles.goodsCount}>
                                                        <Text>
                                                            {item.cartNum}
                                                        </Text>
                                                    </View>
                                                    <TouchableOpacity style={styles.changeAmountBtn} onPress={() => this.addCount(item.id)}>
                                                        <Text>+</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                        }
                    </View>

                    {
                        shoppingGoodsList.length === 0
                            ? <View style={{ alignItems: 'center' }}>
                                <Image source={require('../assets/img/notInfo/shoppingCartIsNot.png')} style={styles.notGoods} />
                            </View>
                            : <View style={{ height: 50, borderWidth: 1, justifyContent: 'center', borderColor: '#F0F0F0' }}>
                                <Text style={{ marginLeft: 50 }}>已享全店包邮</Text>
                            </View>
                    }

                </ScrollView>
                <Modal
                    isVisible={promptModal}
                    onBackdropPress={() => this.setState({ promptModal: false })}
                    backdropOpacity={0.2}
                    style={styles.promptModal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '90%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>您还没有选中商品，请选择！</Text>
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了,去选择</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View style={styles.getOrder}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {
                            isAll === true
                                ? <TouchableOpacity style={styles.checked} onPress={() => this.checkedAll('none')} >
                                    <Feather name="check" color={'white'} />
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.circle} onPress={() => this.checkedAll('all')} />
                        }
                        <Text style={{ margin: 5 }}>全选</Text>
                        <Text>({shoppingGoodsList.filter(item => item.isChecked === true).length})</Text>
                    </View>
                    {
                        isDel === true
                            ? <Text style={styles.delete} onPress={this.delGoods}>删除</Text>
                            : <View style={styles.total}>
                                <Text style={{ color: '#E93323' }}>￥{total}</Text>
                                <Text style={styles.orders} onPress={this.toGetOrders}>立即下单</Text>
                            </View>
                    }
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'white',
        width: unitWidth * 375,
        flex: 1, paddingTop: 30
    },
    list: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 100
    },
    circle: {
        width: 20,
        height: 20,
        borderColor: '#F0F0F0',
        borderWidth: 1,
        borderRadius: 10,
        margin: 7
    },
    checked: {
        width: 20,
        height: 20,
        borderColor: '#F0F0F0',
        borderWidth: 1,
        backgroundColor: '#E93323',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 7
    },
    image: {
        width: 100,
        height: 80,
    },
    info: {
        flexDirection: 'row',
        width: '100%',
        borderColor: 'blue',
        height: 80,
    },
    textInfo: {
        marginLeft: 15,
        width: '50%',
        height: '100%',
        justifyContent: 'space-around'
    },
    detail: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    count: {
        width: 30,
        textAlign: 'center',
        borderColor: '#D4D4D4',
        borderWidth: 1
    },
    changeAmountBtn: {
        width: 30,
        height: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    goodsCount: {
        width: 30,
        height: 25,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center'
    },
    del: {
        width: 50,
        height: 25,
        lineHeight: 25,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE'
    },
    management: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 10,
        marginLeft: 10
    },
    getOrder: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        position: "absolute",
        bottom: 0,
        backgroundColor: '#FAFAFA',
        // width: unitWidth * 375,
        width: '100%',
        justifyContent: 'space-between'
    },
    orders: {
        width: 120,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E93323',
        textAlign: 'center',
        lineHeight: 36,
        color: 'white',
        fontSize: 16,
        marginLeft: 15,
        marginRight: 15
    },
    total: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    delete: {
        width: 90,
        height: 36,
        lineHeight: 36,
        textAlign: 'center',
        borderRadius: 18,
        borderColor: '#9A9A9A',
        borderWidth: 1,
        color: '#C3C3C3',
        marginRight: 15
    },
    promptModal: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
    },
    notGoods: {
        width: 175,
        height: 145,
        marginTop: 50
    },
    header: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: 'white'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
})