import React, { Component } from 'react'
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class IntegralSignIn extends Component {

    componentDidMount() {
    }
    toInteMall = () => {
        this.props.navigation.navigate('IntegralMall')
    }
    inteSign = () => {
        console.log('签到')
    }
    share = () => {
        console.log('分享')
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ paddingTop:30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>积分签到</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={styles.mallBox}>
                    <View style={styles.topSignIn}>
                        <View style={[styles.SignInChild, styles.myInte]}>
                            <Text style={{ color: '#B2B2B2' }}>我的积分</Text>
                            <Text style={{ fontSize: 28, color: 'skyblue' }}>2000</Text>
                        </View>
                        <View style={[styles.SignInChild, styles.topBtn]}>
                            <TouchableOpacity onPress={this.inteSign}
                                style={styles.SignInNow}>
                                <Text style={{ color: 'white' }}>立即签到</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.toInteMall}
                                style={[styles.SignInNow, styles.InteMa]}>
                                <Text style={{ color: 'white' }}>积分商城</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.continuSign}>
                        <Text style={{ fontSize: 16 }}>
                            已连续签到
                            <Text style={{ color: 'blue' }}>4天</Text>
                        </Text>
                        <Text style={{ fontSize: 10, color: '#b2b2b2', marginTop: 10, marginBottom: 10 }}>
                            明日签到可获得
                            <Text style={{ color: 'blue' }}>5 积分</Text>
                        </Text>
                        <View style={styles.weekInfo}>
                            <View style={styles.dayItem}>
                                <View style={styles.checkRound}></View>
                                <Text>周一</Text>
                            </View>
                            <View style={styles.dayItem}>
                                <View style={styles.checkRound}></View>
                                <Text>周二</Text>
                            </View>
                            <View style={styles.dayItem}>
                                <View style={styles.checkRound}></View>
                                <Text>周三</Text>
                            </View>
                            <View style={styles.dayItem}>
                                <View style={styles.checkRound}></View>
                                <Text>周四</Text>
                            </View>
                            <View style={styles.dayItem}>
                                <View style={styles.checkRound}></View>
                                <Text>周五</Text>
                            </View>
                            <View style={styles.dayItem}>
                                <View style={styles.checkRound}></View>
                                <Text>周六</Text>
                            </View>
                            <View style={styles.dayItem}>
                                <View style={styles.checkRound}></View>
                                <Text>周日</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.workTitle}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>积分任务</Text>
                        <Text>更多{'>'}</Text>
                    </View>
                    <View style={styles.shareWork}>
                        <View style={{ width: 55, height: 55, borderRadius: 30, backgroundColor: 'yellowgreen' }}>

                        </View>
                        <View style={{ height: 50, justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>分享活动，邀请好友赚钱积分</Text>
                            <Text style={{ color: '#b2b2b2' }}>好友参与活动您可获得积分</Text>
                        </View>
                        <Text style={styles.share} onPress={this.share}>分享</Text>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    mallBox: {
        width: '100%',
        alignItems: 'center'
    },
    topSignIn: {
        width: '100%',
        height: 120,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    SignInChild: {
        width: '35%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    topBtn: {
        width: '65%',
        justifyContent: 'space-evenly'
    },
    myInte: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 20,
        justifyContent: 'center'
    },
    SignInNow: {
        width: 90,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: 'orange'
    },
    InteMa: {
        backgroundColor: 'blue'
    },
    continuSign: {
        width: '100%',
        height: 150,
        marginTop: 15,
        backgroundColor: 'white',
        padding: 20
    },
    weekInfo: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    dayItem: {
        width: 50,
        height: 60,
        alignItems: 'center'
    },
    checkRound: {
        width: 35,
        height: 35,
        borderWidth: 1,
        borderRadius: 20
    },
    workTitle: {
        flexDirection: 'row',
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 20,
        paddingRight: 5
    },
    shareWork: {
        width: '100%',
        height: 100,
        backgroundColor: 'white',
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    share: {
        width: 50,
        height: 25,
        backgroundColor: 'orange',
        borderRadius: 20,
        textAlign: 'center',
        lineHeight: 25,
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