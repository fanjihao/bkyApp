import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const { width } = Dimensions.get('window')

export default class JoinStore extends Component {
    state = {
        joinList: [],
        refreshing: true,
        agentLevel: 4,

    }
    // 获取加盟商专区列表
    getJoinStoreList = () => {
        axios({
            method: 'GET',
            url: '/api/joinProducts?page=1&limit=10&keyword=&sid=0&news=0&priceOrder=&salesOrder=',
        })
            .then(res => {
                // console.log('加盟商专区列表数据', res)
                this.setState({
                    joinList: res.data.data,
                    refreshing: false
                })
            })
            .catch(err => {
                console.log('获取加盟商专区列表失败', err)
            })
    }
    componentDidMount() {
        this.getJoinStoreList()
        storage.load({ key: 'agentLevel' })
            .then(ret => {
                this.setState({ agentLevel: ret })
            })
            .catch(err => {

            })
    }
    // 商品详情
    toJoinStoreGoodsDetail = data => {
        this.props.navigation.navigate('JoinStoreGoodsDetail', { goods: data })
    }
    // 下拉刷新
    onRefresh = () => {
        this.getJoinStoreList()
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { joinList, agentLevel, refreshing } = this.state
        let dom = joinList.map((item, index) => {
            return (
                <TouchableOpacity key={index} style={{ margin: 5 }} onPress={() => this.toJoinStoreGoodsDetail(item)}>
                    <Image source={{ uri: item.image }} style={styles.images}></Image>
                    <View style={{ backgroundColor: 'white' }}>
                        <Text style={{ margin: 5 }}>{item.keyword}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                            <Text style={{ color: '#D43030', margin: 5 }}>￥{agentLevel === 4 ? item.price : item.vipPrice}</Text>
                            <Text style={{ color: '#FFA244', margin: 5 }}>已售{item.sales}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        })
        return (
            <ScrollView
                contentContainerStyle={{ backgroundColor: '#F5F5F5', flexGrow: 1, paddingTop:30 }}
                refreshControl={
                    <RefreshControl
                        title={'下拉刷新'}
                        refreshing={refreshing}
                        colors={['rgb(255, 176, 0)', "#ffb100"]}
                        onRefresh={() => this.onRefresh()}
                    />
                }
            >

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>加盟商专区</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                    {dom}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    images: {
        width: width / 2.2,
        height: width / 2.2,
        borderWidth: 1
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