import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class EditBankCard extends Component {
    state = {
        bankCode: this.props.route.params.cardInfo.bankCode,
        bankName: this.props.route.params.cardInfo.bankName,
        name:this.props.route.params.cardInfo.name, 
        identity:this.props.route.params.cardInfo.idCard, 
        phone:this.props.route.params.cardInfo.phone,
        id: this.props.route.params.cardInfo.id,
        account:this.props.route.params.cardInfo.account
    }
    componentDidMount() {
    }
    // 保存银行卡信息
    editBankCard = () => {
        const { bankCode, bankName, name, identity, phone, account } = this.state
        axios({
            method: 'GET',
            url: '/api/userStages/updateBank',
            params: {
                bankCode: bankCode,
                bankName: bankName,
                id: this.props.route.params.cardInfo.id,
                phone,
                name,
                idCard:identity,
                account
            }
        })
        .then(res => {
            this.props.navigation.goBack('BankCard')
        })
        .catch(err => {
            console.log('修改失败',err)
        })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { bankCode, bankName, name, identity, phone } = this.state
        return (
            <View style={{ paddingTop:30}}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>修改银行卡</Text>
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
                            style={{ width: '60%' }} value={bankCode} 
                            onChangeText={value => this.setState({ bankCode:value })}
                            onBlur={this.bankInfo}></TextInput>
                    </View>
                    <View style={styles.infoItem}>
                        <Text>所属银行</Text>
                        <Text style={{ width: '60%' }}>{bankName}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text>本人身份证号</Text>
                        <TextInput placeholder="请输入" style={{ width: '60%' }} value={identity} onChangeText={value => this.setState({ identity:value })}></TextInput>
                    </View>
                    <View style={styles.infoItem}>
                        <Text>银行卡预留手机号</Text>
                        <TextInput placeholder="请输入" style={{ width: '60%' }} value={phone} onChangeText={value => this.setState({ phone:value })}></TextInput>
                    </View>
                </View>

                <Text style={styles.save} onPress={this.editBankCard}>立即保存</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
        width: '90%',
        height: 40,
        backgroundColor: '#0F96E4',
        color: 'white',
        textAlign: 'center',
        lineHeight: 40,
        marginLeft: '5%',
        marginTop: 20,
        fontSize: 18,
        borderRadius: 20
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