import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

class MerchantManagement extends Component {
    state = {
        src: null,
        nowCount: 0,
        nowTotal: 0
    }
    componentDidMount() {
        this.setState({
            src: this.props.personInfo.avatar
        })
        const id = this.props.personInfo.id
        this.getNowData(id)
    }
    // 今日订单及成交额
    getNowData = id => {
        const date = new Date()
        let Y = date.getFullYear()
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        let D = date.getDate();
        const nowDate = Y + '-' + M + '-' + D
        console.log(nowDate)

        fetch(`http://47.108.174.202:9010/statistics/stageLineChart?startTime=${nowDate}&endTime=${nowDate}&enterId=${id}`)
            .then(res => res.json())
            .then(resJSON => {
                // console.log('今日', resJSON)
                if (!resJSON) {
                    // console.log(1)
                } else {
                    // console.log(2)
                    let nowCount = 0, nowTotal = 0
                    resJSON.filter(item => {
                        nowCount = item.stageCount + nowCount
                        nowTotal = item.stageMoney + nowTotal
                        // return item
                    })
                    this.setState({
                        nowCount: nowCount,
                        nowTotal: nowTotal
                    })
                }
            })
    }
    // 门店分期
    toStageManage = () => {
        this.props.navigation.navigate('StageManage')
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { nowCount, nowTotal, src } = this.state
        return (
            <View style={{ backgroundColor: 'white', flex: 1, paddingTop:30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>商户管理</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={{ backgroundColor: '#E5E5E5' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: src }} style={styles.headPhoto} />
                        <Text>九十五熏浴散武侯2号分店</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={styles.infoItem}>
                            <Text>{nowCount}</Text>
                            <Text>今日订单数</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text>{nowTotal}</Text>
                            <Text>今日成交额</Text>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', margin: 25, justifyContent: 'space-around' }}>
                    {/* <Text style={styles.funItem} onPress={this.toStageManage}>分期管理</Text> */}
                    {/* <Text style={styles.funItem}>店务管理</Text> */}
                    {/* <Text style={styles.funItem}>财务报表</Text> */}
                    {/* <Text style={styles.funItem}>分期管理</Text>
                    <Text style={styles.funItem}>店务管理</Text>
                    <Text style={styles.funItem}>财务报表</Text> */}
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(MerchantManagement)

const styles = StyleSheet.create({
    headPhoto: {
        width: 60,
        height: 60,
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'space-evenly',
        margin: 10
    },
    infoItem: {
        alignItems: 'center',
        height: 40,
        margin: 10
    },
    funItem: {
        width: '25%',
        height: 60,
        textAlign: 'center',
        lineHeight: 60,
        backgroundColor: '#E5E5E5',
        marginBottom: 0
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