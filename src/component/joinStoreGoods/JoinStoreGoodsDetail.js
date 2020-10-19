import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import Swiper from 'react-native-swiper';

export default class GoodsDetail extends Component {
    state = {
        goodsInfo: this.props.route.params.goods,
        showModal: false,
        num: 1,
        agentLevel: null,
        addShow: false,
        hint: '添加到购物车成功',
        showImage: false
    }
    // 挂载完毕获取数据
    componentDidMount() {
        // console.log('商品信息', this.props.route.params.goods)
        storage.load({ key: 'agentLevel' })
            .then(ret => {
                this.setState({ agentLevel: ret })
            })
            .catch(err => {

            })
    }
    // 选择商品
    checkGoods = () => {
        this.setState({ showModal: true })
    }
    // 加
    add = () => {
        this.setState({ num: this.state.num + 1 })
    }
    // 减
    red = () => {
        if (this.state.num > 1) {
            this.setState({ num: this.state.num - 1 })
        }
    }
    // 立即购买
    toPay = () => {
        const { showModal } = this.state
        if (showModal === false) {
            this.setState({ showModal: true })
        } else if (showModal === true) {
            axios({
                method: 'POST',
                url: '/api/cart/add',
                data: {
                    cartNum: this.state.num,
                    new: 0,
                    productId: this.props.route.params.goods.id,
                    uniqueId: ""
                }
            })
                .then(res => {
                    // console.log('添加购物车成功', res.data.data.cartId)
                    axios({
                        url: '/api/order/confirm',
                        method: 'POST',
                        data: {
                            cartId: res.data.data.cartId
                        }
                    })
                        .then(res => {
                            this.setState({ showModal: false })
                            this.props.navigation.navigate('ShoppingOrder', { getOrderList: res.data.data.cartInfo, orderInfo: res.data.data })
                        })

                })
                .catch(err => {
                    console.log('确认订单失败', err)
                })
        }
    }
    // 加入购物车
    addShoppingcart = () => {
        const { showModal } = this.state
        if (showModal === false) {
            this.setState({ showModal: true })
        } else if (showModal === true) {
            axios({
                method: 'POST',
                url: '/api/cart/add',
                data: {
                    cartNum: this.state.num,
                    new: 0,
                    productId: this.props.route.params.goods.id,
                    uniqueId: ""
                }
            })
                .then(res => {
                    // console.log('添加成功', res)
                    // this.setState({cartId: res.data.data.cartId})
                    this.setState({
                        showModal: false,
                        hint: '添加到购物车成功',
                        addShow: true
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                addShow: false
                            })
                        }, 1000)
                    })
                })
                .catch(err => {
                    console.log('添加失败', err)
                    this.setState({
                        showModal: false,
                        hint: '添加到购物车失败',
                        addShow: true
                    }, () => {
                        setTimeout(() => {
                            this.setState({
                                addShow: false
                            })
                        }, 1000)
                    })
                })
        }
    }
    // 展示商品图片
    toShowImage = () => {
        this.setState({ showImage: true })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { goodsInfo, showModal, num, agentLevel, addShow, hint, showImage } = this.state
        console.log(goodsInfo.sliderImageArr)
        return (
            <View style={{ flex: 1, paddingTop:30 }}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>加盟商专区商品详情</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableOpacity style={{ position: 'relative' }} onPress={this.toShowImage}>
                        <Image source={{ uri: goodsInfo.image }} style={styles.goodsImage} />
                        <View style={styles.images}>
                            <Text style={styles.imageNums}>
                                1/{goodsInfo.sliderImageArr.length}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <Modal
                        isVisible={showImage}
                        onBackdropPress={() => this.setState({ showImage: false })}
                        backdropOpacity={1}
                        style={styles.modal}
                        animationInTiming={20}
                        animationOutTiming={20}>
                        <View style={{ justifyContent: 'center', width: '100%', height: '100%', position: 'relative' }}>
                            {/* <Text style={{ color: 'white', textAlign: 'center', position: 'absolute', top: 10, width: '100%' }}>
                                {'1/2'}
                            </Text> */}
                            <View style={{ height: 300 }}>
                                <Swiper
                                    horizontal={true}           // 水平轮播
                                    showsPagination={false}     // 控制小圆点的显示
                                    showsButtons={false}        // 控制左右箭头按钮显示
                                    autoplay={false}             // 自动轮播
                                    index={0}                   // 初始图片的索引号
                                    loop={false}                 // 循环轮播
                                    style={{ height: 300 }}

                                >
                                    {goodsInfo.sliderImageArr.map((item, index) => {
                                        return (
                                            <Image source={{ uri: item }} style={[styles.goodsImage, { height: 300 }]} key={index} />
                                        )
                                    })}
                                </Swiper>
                            </View>
                        </View>
                    </Modal>

                    <View style={styles.goodsInfo}>
                        <View>
                            <Text style={styles.goodsPrice}>￥{agentLevel === 4 ? goodsInfo.price : goodsInfo.vipPrice}</Text>
                            <Text style={{ fontWeight: 'bold' }}>
                                {/* {goodsInfo.keyword} */}
                                {goodsInfo.keyword === '远红外频谱仪' ? goodsInfo.keyword + '（租赁4000/年）' : goodsInfo.keyword}
                            </Text>
                        </View>
                        <Ionicons name='ios-share-outline' size={24}></Ionicons>
                    </View>

                    <TouchableOpacity style={styles.check} onPress={this.checkGoods}>
                        <Text>请选择：</Text>
                        <Feather name="chevron-right" size={18} />
                    </TouchableOpacity>

                    <Text style={{ height: 40, lineHeight: 40, textAlign: 'center', backgroundColor: 'white', fontSize: 16 }}>产品介绍</Text>
                    <Text style={{ height: 40 }}>{goodsInfo.keyword}</Text>

                </ScrollView>

                <TouchableOpacity style={styles.fixedFoot}>
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons name="heart-outline" size={18}></Ionicons>
                        <Text>收藏</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons name="cart" size={18}></Ionicons>
                        <Text>购物车</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.joinCart} onPress={this.addShoppingcart}>加入购物车</Text>
                        <Text style={styles.pay} onPress={this.toPay}>立即购买</Text>
                    </View>
                </TouchableOpacity>

                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => this.setState({ showModal: false })}
                    backdropOpacity={0.4}
                    style={styles.modal}
                    animationInTiming={300}
                    animationOutTiming={300}
                >
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                        <View style={{ flexDirection: 'row', margin: 15, justifyContent: 'space-between', marginBottom: 25 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={{ uri: goodsInfo.image }} style={{ width: 100, height: 100 }} />
                                <View style={{ marginLeft: 15, justifyContent: 'space-around' }}>
                                    <Text>{goodsInfo.keyword}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                                        <Text style={{ color: '#E90058', fontSize: 16, marginRight: 5 }}>
                                            ￥{agentLevel === 4 ? goodsInfo.price : goodsInfo.vipPrice}
                                        </Text>
                                        <Text>库存：{goodsInfo.stock}</Text>
                                    </View>
                                </View>
                            </View>
                            <Feather name="x" size={24} onPress={() => this.setState({showModal: false})}/>
                        </View>

                        <View style={{ margin: 15 }}>
                            <Text>数量</Text>

                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Text style={styles.num} onPress={this.red}>—</Text>
                                <Text style={styles.num}>{num}</Text>
                                <Text style={styles.num} onPress={this.add}>+</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.fixedFoot}>
                            <TouchableOpacity style={{ alignItems: 'center' }}>
                                <Ionicons name="heart-outline" size={18}></Ionicons>
                                <Text>收藏</Text>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <Ionicons name="cart" size={18}></Ionicons>
                                <Text>购物车</Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.joinCart} onPress={this.addShoppingcart}>加入购物车</Text>
                                <Text style={styles.pay} onPress={this.toPay}>立即购买</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </Modal>

                {/* 加入购物车成功、失败提示 */}
                <Modal
                    isVisible={addShow}
                    backdropOpacity={0}
                    style={styles.addShoppingcartModal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <Text style={styles.addShoppingcartHint}>{hint}</Text>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    fixedFoot: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 999,
        borderTopWidth: 1,
        borderTopColor: '#E6E6E6'
    },
    goodsImage: {
        width: '100%',
        height: 350
    },
    goodsInfo: {
        justifyContent: 'space-evenly',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    goodsPrice: {
        color: '#E90058',
        fontSize: 24
    },
    check: {
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-between'
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
        zIndex: 998
    },
    num: {
        width: 30,
        height: 25,
        borderWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        lineHeight: 25
    },
    joinCart: {
        width: 100,
        height: 40,
        backgroundColor: '#FEA10F',
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
        borderBottomLeftRadius: 20,
        borderTopLeftRadius: 20
    },
    pay: {
        width: 100,
        height: 40,
        backgroundColor: '#E90058',
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20
    },
    addShoppingcartModal: {
        margin: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addShoppingcartHint: {
        width: 200,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        backgroundColor: 'black',
        opacity: 0.7,
        color: 'white'
    },
    images: {
        width: 35,
        backgroundColor: '#CEC4C3',
        position: 'absolute',
        bottom: 5,
        right: 5,
        opacity: 0.75,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageNums: {
        color: 'white'
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