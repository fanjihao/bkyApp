import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class StageGoodsDetail extends Component {
    state = {
        goodsInfo: this.props.route.params.goods,
        num: 1
    }
    // 挂载完毕获取数据
    componentDidMount() {
        console.log('商品信息', this.props.route.params.goods)
    }
    // 返回上一级
    back = () => {
        this.props.navigation.goBack()
    }

    render() {
        const { goodsInfo } = this.state
        return (
            <View style={{ flex: 1, paddingTop:30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>分期项目详情</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Image source={{ uri: goodsInfo.photo.split(',')[0] }} style={styles.goodsImage} />

                    <View style={styles.goodsInfo}>
                        <View>
                            <Text style={styles.goodsPrice}>￥{goodsInfo.price}</Text>
                            <Text style={{ fontWeight: 'bold' }}>{goodsInfo.name}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.check}>
                        <Text>请选择：</Text>
                        <Feather name="chevron-right" size={18} />
                    </TouchableOpacity>

                    <Text style={{ height: 40, lineHeight: 40, textAlign: 'center', backgroundColor: 'white', fontSize: 16 }}>产品介绍</Text>
                    <Text style={{ height: 40 }}>{goodsInfo.name}</Text>

                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    goodsImage: {
        width: '100%',
        height: 350,
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
    header: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#EDEDED'
    },
    headerTitle: {
        fontWeight: 'bold'
    },
    headerLeft: {
        position: 'absolute',
        left: 20,
    }
})