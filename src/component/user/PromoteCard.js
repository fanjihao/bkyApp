import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import QRCode from 'react-native-qrcode-svg';

class PromoteCard extends Component {
    state = {
        zhuceCode: '',
        noNum: false
    }
    // 挂载完毕获取数据
    componentDidMount() {
    }
    refreshZhuce = () => {
        axios({
            url: '/api/userStages/registrationCode',
            method: 'GET',
            params: {
                account: this.props.personInfo.account
            }
        })
            .then(res => {
                console.log('注册码', res)
                if (res.data.message.length > 6) {
                    this.setState({ noNum: true })
                } else {
                    this.setState({ zhuceCode: res.data.message })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { zhuceCode, noNum } = this.state
        return (
            <ScrollView style={{ backgroundColor: '#F4F6F8', flexGrow: 1, paddingTop: 30 }}>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>推广名片</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={{ backgroundColor: '#f6f6f6', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20 }}>
                    <View style={{ height: 30, marginBottom: 10 }}>
                        {noNum
                            ? <Text style={{ color: '#EF9E05', marginBottom: 20, fontSize: 15 }}>您的推广次数已用完，请重新购买渠道商次数！</Text>
                            : null}
                    </View>

                    <View style={styles.cardPart}>
                        <View style={{ width: '100%', position: 'relative', overflow: 'hidden', height: 130 }}>
                            <Image source={require('../../assets/img/promote/tgmp-bg.png')}
                                resizeMode='contain'
                                style={{ width: '100%', height: 110, position: 'absolute', top: -10, zIndex: -1 }}
                            ></Image>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', padding: 10 }}>
                                <Image source={require('../../assets/img/promote/tgmp-logo.png')}></Image>
                                <Text style={{ color: 'white', marginLeft: 10 }}>博客云</Text>
                            </View>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontSize: 17 }}>自购优惠福利</Text>
                                <Text style={{ color: 'white', fontSize: 17 }}>分享多赚多级奖金</Text>
                            </View>
                        </View>
                        <View style={{ borderColor: '#eee', borderWidth: 5 }}>
                            <QRCode
                                // logo={require('../../assets/img/promote/favicon.png')}
                                // logoBorderRadius={2}
                                // logoMargin={3}
                                // logoBackgroundColor={'#eee'}
                                // logoSize={40}
                                value={'http://vip.bkysc.cn/bkyapp.apk'}
                                size={200}
                            />
                        </View>
                        <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, color: '#22A1EB' }}>推荐码：</Text>
                            <Image style={styles.promoteAvatar}
                                source={{ uri: this.props.personInfo.avatar }}>
                            </Image>
                            <Text style={{ fontSize: 16, color: '#22A1EB' }}>{this.props.personInfo.account}</Text>
                        </View>
                        <Text style={{ color: '#666', marginTop: 15 }}>
                            <Text style={{ color: 'red' }}>*</Text>
                            使用手机浏览器扫描二维码，下载安装App
                        </Text>
                    </View>
                    <View style={styles.jihuoNum}>
                        <Text style={{ color: 'white', fontSize: 17 }} onPress={this.refreshZhuce}>注册码：{zhuceCode === '' ? '******' : zhuceCode}</Text>
                        {/* <Text style={{ color: 'white', fontSize:17 }}>点击刷新</Text> */}
                    </View>
                    {/* <TouchableOpacity style={{ width: '80%', height: 45, marginBottom: 10 }}>
                        <View style={styles.saveImg}>
                            <Text style={{ color: 'white', }}>保存图片</Text>
                        </View>
                    </TouchableOpacity> */}
                    <Text style={{ color: '#666' }}>
                        <Text style={{ color: 'red' }}>*</Text>
                        点击注册码即可刷新，注册码为注册商户的必填项
                    </Text>
                    {/* <Text>通过扫描二维码下载App</Text> */}
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    cardPart: {
        width: '80%',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        paddingBottom: 15,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#F4F2F5'
    },
    promoteAvatar: {
        width: 25,
        height: 25,
        backgroundColor: '#ccc',
        borderRadius: 15,
        marginLeft: 5,
        marginRight: 5
    },
    jihuoNum: {
        width: '80%',
        height: 50,
        backgroundColor: '#428FE4',
        marginTop: 50,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        paddingLeft: 25,
        paddingRight: 25,
        alignItems: 'center',
        borderRadius: 10
    },
    saveImg: {
        width: '100%',
        height: '100%',
        backgroundColor: '#1294E6',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
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

function mapStateToProps(state) {
    return {
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(PromoteCard)