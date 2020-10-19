import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';

class WithDrawal extends Component {
    state = {
        tixianAmount: '',
        allowMaxAmount: '',
        defaultCard: {
            bankCode: '',
            bankName: '',
            id: '',
            uid: ''
        },
        showModal: false,
        cardList: []
    }
    // 挂载完毕获取数据
    componentDidMount() {
        this.getBankList()
        this.setState({
            allowMaxAmount: Number(this.props.route.params.balance)
        })
    }
    // 如果有银行卡，则第一张卡为默认使用
    // 获取银行卡列表
    getBankList = () => {
        axios({
            method: 'GET',
            url: '/api/userStages/listBanks'
        })
            .then(res => {
                if (res.data.data === null) {

                } else {
                    this.setState({
                        cardList: res.data.data,
                        defaultCard: {
                            bankCode: res.data.data[0].bankCode,
                            bankName: res.data.data[0].bankName,
                            id: res.data.data[0].id,
                            uid: res.data.data[0].uid
                        }
                    })
                }
            })
            .catch(err => {
                console.log('获取银行卡列表失败', err)
            })
    }
    toback = () => {
        this.props.navigation.goBack()
    }
    changeAmount = text => {
        this.setState({
            tixianAmount: text
        }, () => {
            // const { allowMaxAmount } = this.state
            // console.log(parseInt(text), '输入')
            // console.log(parseInt(allowMaxAmount), '总的')
            // if (Number(text) > Number(allowMaxAmount)) {
            //     this.setState({
            //         tixianAmount: allowMaxAmount
            //     })
            // }
        })
    }
    allAmount = () => {
        this.setState({
            tixianAmount: this.state.allowMaxAmount
        })
    }
    chooseBank = () => {
        this.setState({
            showModal: true
        })
    }
    tixianBtn = () => {
        console.log('提现', this.state.defaultCard)
        axios({
            url:'/api/extract/bankCard',
            method:'POST',
            data:{
                "bankCode": this.state.defaultCard.bankCode,
                "money": this.state.tixianAmount
            }
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }
    moneyRecord = () => {
        this.props.navigation.navigate('MoneyRecord', { record: 'tixian' })
    }
    goAddBank = () => {
        this.setState({
            showModal: false
        }, () => {
            this.props.navigation.navigate('BankCard')
        })
    }
    changeBank = (i) => {
        this.setState({
            defaultCard: {
                bankCode: i.bankCode,
                bankName: i.bankName,
                id: i.id,
                uid: i.uid
            },
            showModal: false
        })
    }

    render() {
        const { tixianAmount, allowMaxAmount, defaultCard, showModal, cardList } = this.state
        const code = defaultCard.bankCode
        let bankDom
        if (cardList.length === 0) {
            bankDom
        } else {
            bankDom = cardList.map(item => {

                let code = item.bankCode.substr(item.bankCode.length - 4)
                return (
                    <TouchableOpacity onPress={() => this.changeBank(item)} key={item.id}>
                        <View style={[defaultCard.id === item.id ? styles.checkBank : styles.onchecked]}>
                            <View style={styles.alipayMode}>
                                <Text style={styles.checkColor}>{item.bankName}</Text>
                            </View>
                            <View style={{ width: 1, height: 30, backgroundColor: '#EEEEEE' }}></View>
                            <Text style={styles.hint}>尾号：{code}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: '#F4F6F8', flexGrow: 1, alignItems: 'center' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback} style={{ width: 50, height: 50 }}>
                        <Feather name="chevron-left" size={24} style={{ fontSize: 20, color: 'white', margin: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>提现</Text>
                    <TouchableOpacity onPress={this.moneyRecord}>
                        <Text style={styles.promoteFont}>提现记录</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.withdrawalBody}>
                    <View style={{ width: '100%', height: 50 }}>
                        <TouchableOpacity style={{ width: '100%', height: '100%' }}
                            onPress={this.chooseBank}>
                            <View style={styles.bankTop}>
                                <Text>到账银行</Text>
                                {
                                    code === ''
                                        ? <Text>请前往绑定银行卡！</Text>
                                        : <Text>{defaultCard.bankName + '(' + code.substr(code.length - 4) + ')'}</Text>
                                }
                                <Feather name='chevron-right' size={20}></Feather>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.bankTop, { height: 100, alignItems: 'flex-end' }]}>
                        <View style={{ height: '80%', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 40, fontWeight: 'bold' }}>￥</Text>
                        </View>
                        <TextInput
                            style={{ width: '60%', height: 80, fontSize: 40, padding: 0 }}
                            keyboardType='numeric'
                            textAlign='right'
                            value={tixianAmount}
                            onChangeText={text => {
                                let newText = (text != '' && text.substr(0, 1) == '.') ? '' : text;
                                newText = newText.replace(/^0+[0-9]+/g, "0"); //不能以0开头输入
                                newText = newText.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
                                newText = newText.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
                                newText = newText.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
                                newText = newText.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
                                this.changeAmount(newText)
                            }}
                        ></TextInput>
                        <View style={{ height: '80%', justifyContent: 'center' }}>
                            <Text style={{ alignContent: 'center', color: '#1295E4' }}
                                onPress={this.allAmount}>全部提现</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 50, alignItems: 'center' }}>
                        <View style={styles.shouxufei}>
                            <Text>可提现金额{allowMaxAmount}元</Text>
                            <Text>手续费：0元</Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', height: 80, alignItems: 'center', justifyContent: 'center', marginTop: 50 }}>
                    <TouchableOpacity style={{ width: '60%', height: 60 }}
                        onPress={this.tixianBtn}>
                        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1295E4', borderRadius: 10 }}>
                            <Text style={{ color: 'white', fontSize: 20 }}>提现</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* 银行卡列表 */}
                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => this.setState({ showModal: false })}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ backgroundColor: 'white', width: '100%', height: 400 }}>
                        <View style={{ width: '100%', flex: 1 }}>
                            <Text style={{ margin: 15, textAlign: 'left' }}>银行卡</Text>
                            <View style={{ alignItems: 'center', margin: 10 }}>
                                {bankDom}
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 50, alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.addbank} onPress={this.goAddBank}>
                                <Feather name='plus-square' style={{ color: 'white', marginRight: 10 }} size={16}></Feather>
                                <Text style={{ color: 'white' }}>添加一张新银行卡</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    addbank: {
        width: '90%',
        height: 40,
        borderRadius: 30,
        backgroundColor: '#1295E4',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    checkBank: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#FC5445',
        width: '94%',
        marginBottom: 10,
        borderRadius: 5
    },
    onchecked: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#eee',
        width: '94%',
        marginBottom: 10,
        borderRadius: 5
    },
    header: {
        width: '100%',
        backgroundColor: '#1295E4',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingRight: 15
    },
    withdrawalBody: {
        width: '100%',
        height: 200,
        backgroundColor: 'white',
        marginTop: 10,
    },
    bankTop: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#ccc'
    },
    shouxufei: {
        width: '94%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    promoteFont: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
})

export default WithDrawal