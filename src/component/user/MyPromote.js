import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class MyPromote extends Component {

    state = {
        data:''
    }

    // 挂载完毕获取数据
    componentDidMount() {
        this.getCommission()
    }
    getCommission = () => {
        axios({
            url: '/api/commission',
            method: "GET"
        })
            .then(res => {
                this.setState({
                    data:res.data.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    toback = () => {
        this.props.navigation.goBack()
    }
    mycard = () => {
        this.props.navigation.navigate('PromoteCard')
    }
    moneyRecord = () => {
        this.props.navigation.navigate('MoneyRecord', { record: 'tixian' })
    }
    // toWithDrawal = () => {
    //     this.props.navigation.navigate('WithDrawal')
    // }
    render() {
        const { data } = this.state
        return (
            <View style={{ backgroundColor: '#F4F6F8', flex: 1 }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback}>
                        <Feather name="chevron-left" size={24} style={{ color: 'white', margin: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, color: 'white' }}>渠道商推广</Text>
                    {/* <TouchableOpacity onPress={this.moneyRecord}>
                        <Text style={styles.promoteFont}>提现记录</Text>
                    </TouchableOpacity> */}
                    <View style={{width:50}}></View>
                </View>
                <View style={styles.promoteTop}>
                    <View style={styles.proTopFirView}>
                        <Text style={{ fontSize: 40, color: 'white' }}>{data.commissionCount}</Text>
                    </View>
                    <View style={styles.proTopSecView}>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.promoteFont}>昨日收益</Text>
                            <Text style={styles.promoteFont}>{data.lastDayCount}</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Text style={styles.promoteFont}>累计已提</Text>
                            <Text style={styles.promoteFont}>{data.extractCount}</Text>
                        </View>
                    </View>
                    <View style={styles.topAbsoView}>
                        <View style={styles.tixianBox}>
                            <View style={{ width: '85%' }}>
                                <TouchableOpacity onPress={this.toWithDrawal}>
                                    <View style={styles.tixianBtn}>
                                        <Text style={{ color: 'white', fontSize: 16 }}>立即提现</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.proFnBox}>
                    <View style={styles.boxSon}>
                        <TouchableOpacity onPress={this.mycard} style={styles.proFunct}>
                            <View style={styles.fnItem}>
                                <View style={styles.icons}>
                                    <Image source={require('../../assets/img/promote/tgmp.png')} style={{ width: '100%', height: '100%' }}></Image>
                                </View>
                                <Text style={styles.proItemFont}>推广名片</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.no}>
                            {/* <View style={styles.fnItem}>
                                <View style={styles.icons}>
                                    <Image source={require('../../assets/img/promote/tgrtj.png')} style={{ width: '100%', height: '100%' }}></Image>
                                </View>
                                <Text style={styles.proItemFont}>推广人统计</Text>
                            </View> */}
                        </TouchableOpacity>
                    </View>
                    {/* <View style={styles.boxSon}>
                        <TouchableOpacity style={styles.proFunct}>
                            <View style={styles.fnItem}>
                                <View style={styles.icons}>
                                    <Image source={require('../../assets/img/promote/yjmx.png')} style={{ width: '100%', height: '100%' }}></Image>
                                </View>
                                <Text style={styles.proItemFont}>佣金明细</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.proFunct}>
                            <View style={styles.fnItem}>
                                <View style={styles.icons}>
                                    <Image source={require('../../assets/img/promote/tgrdd.png')} style={{ width: '100%', height: '100%' }}></Image>
                                </View>
                                <Text style={styles.proItemFont}>推广人订单</Text>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                    {/* <View style={[styles.boxSon,{justifyContent:'flex-start'}]}>
                        <View style={styles.proFunct}>
                            <TouchableOpacity>
                                <View style={styles.fnItem}>
                                    <View style={styles.icons}></View>
                                    <Text style={styles.proItemFont}>渠道商权益</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 85,
        backgroundColor: '#1295E4',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
    },
    promoteTop: {
        width: '100%',
        height: 150,
        backgroundColor: '#1295E4',
        position: 'relative'
    },
    promoteFont: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    },
    proTopFirView: {
        height: 80,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    proTopSecView: {
        paddingLeft: 20,
        paddingRight: 20,
        height: 60,
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    topAbsoView: {
        position: 'absolute',
        bottom: -35,
        width: '100%',
        height: 70,
        alignItems: 'center'
    },
    tixianBox: {
        width: '45%',
        height: 60,
        borderRadius: 40,
        backgroundColor: '#F4F6F8',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tixianBtn: {
        backgroundColor: '#1295E4',
        width: '100%',
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    proFnBox: {
        width: '100%',
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    boxSon: {
        width: '94%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10
    },
    proFunct: {
        backgroundColor: 'white',
        width: '45%',
        height: 120,
        borderRadius: 10,
    },
    no: {
        // backgroundColor: 'white',
        width: '45%',
        height: 120,
        borderRadius: 10,
    },
    fnItem: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    icons: {
        width: 40,
        height: 40,
    },
    proItemFont: {
        color: '#606060',
    }
})