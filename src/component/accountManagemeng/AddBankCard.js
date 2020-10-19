import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import bankCardAttribution from '../modules/bankCard';
import Modal from 'react-native-modal';

class AddBankCard extends Component {
    state = {
        card: '',
        bank: '',
        identity: '',
        phone: '',
        name:'',
        promptModal:false, 
        promptInfo:'', 
        account:'', 
    }
    componentDidMount() {
        let account
        if(this.props.accountNumber) {
            account = this.props.personInfo.accountNumber
        } else {
            account = this.props.personInfo.account
        }
        this.setState({
            account
        })
    }

    // 银行卡号
    setCard = value => {
        this.setState({
            card: value
        })
    }
    bankInfo = () => {
        let obj = bankCardAttribution(this.state.card)
        this.setState({
            bank:obj.bankName
        })
    }
    // 所属银行
    setBank = value => {
        this.setState({
            bank: value
        }, () => {
        })
    }
    // 本人身份证号
    setIdentity = value => {
        this.setState({
            identity: value
        })
    }
    // 银行卡预留手机号
    setPhone = value => {
        this.setState({
            phone: value
        })
    }
    addBankCard = () => {
        const { card, bank, identity, phone, name, account } = this.state
        if(card === '' || bank === '' || identity === '' || phone === '' || name === '') {
            this.setState({
                promptModal:true,
                promptInfo:'银行卡信息均不能为空！'
            })
        } else {
            axios({
                method: 'GET',
                url: '/api/userStages/bindingBank',
                params: {
                    bankCode: card,
                    bankName: bank,
                    phone,
                    name,
                    idCard:identity,
                    account
                }
            })
                .then(res => {
                    console.log(res)
                    if(res.data.status === 200) {
                        // 跳转到切换账号页
                        this.props.navigation.replace('BankCard')
                    } else {
                        this.setState({
                            promptModal:true,
                            promptInfo:res.data.message
                        })
                    }
                })
                .catch(err => {
                    console.log('添加银行卡失败', err)
                })
        }
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { card, bank, identity, phone, promptModal, name, promptInfo } = this.state
        return (
            <View style={{ paddingTop:30}}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>添加银行卡</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>
                <View style={{ backgroundColor: 'white' }}>
                    <View style={styles.infoItem}>
                        <Text>账户姓名</Text>
                        <TextInput placeholder="请输入" style={{ width: '60%' }} value={name} 
                            onChangeText={value => this.setState({ name:value })}></TextInput>
                    </View>
                    <View style={styles.infoItem}>
                        <Text>卡号</Text>
                        <TextInput placeholder="请输入卡号" 
                            style={{ width: '60%' }} value={card} 
                            onChangeText={value => this.setCard(value)}
                            onBlur={this.bankInfo}></TextInput>
                    </View>
                    <View style={styles.infoItem}>
                        <Text>所属银行</Text>
                        <Text style={{ width: '60%' }}>{bank}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text>本人身份证号</Text>
                        <TextInput placeholder="请输入" style={{ width: '60%' }} value={identity} onChangeText={value => this.setIdentity(value)}></TextInput>
                    </View>
                    <View style={styles.infoItem}>
                        <Text>银行卡预留手机号</Text>
                        <TextInput placeholder="请输入" style={{ width: '60%' }} value={phone} onChangeText={value => this.setPhone(value)}></TextInput>
                    </View>
                </View>
                <Modal
                    isVisible={promptModal}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '90%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{promptInfo}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <Text style={styles.save} onPress={this.addBankCard}>确定</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
    },
    infoItem: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F6F9',
    },
    save: {
        width: '70%',
        height: 40,
        backgroundColor: '#0F96E4',
        color: 'white',
        borderRadius: 5,
        textAlign: 'center',
        lineHeight: 40,
        marginLeft: '15%',
        marginBottom: 20,
        marginTop: 60,
        fontSize: 18
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

export default connect(mapStateToProps)(AddBankCard)