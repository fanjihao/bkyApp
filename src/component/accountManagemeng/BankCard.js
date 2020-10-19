import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

class BankCard extends Component {
    state = {
        cardList: [],
        isShow: false,
        delID: 0,
        delShow: false,
        hint: '',
        refreshing: true,
        account:''
    }
    // 获取银行卡列表
    getBankList = (account) => {
        axios({
            method: 'GET',
            url: '/api/userStages/listBanks',
            params:{
                account
            }
        })
            .then(res => {
                if (res.data.data === null) {
                    this.props.navigation.goBack()
                } else {
                    this.setState({ 
                        cardList: res.data.data, 
                        refreshing: false 
                    })
                }
            })
            .catch(err => {
                console.log('获取银行卡列表失败', err)
            })
    }
    componentDidMount() {
        let account
        if(this.props.personInfo.account) {
            account = this.props.personInfo.account
        } else {
            console.log('商家')
            account = this.props.personInfo.accountNumber
        }
        this.setState({
            account
        }, () => {
            this.getBankList(account)
        })
    }

    // 添加银行卡
    toAddBankCard = () => {
        this.props.navigation.navigate('AddBankCard')
    }
    // 删除银行卡提示框
    showDelModal = id => {
        this.setState({
            isShow: true,
            delID: id
        })
    }
    // 删除银行卡
    delCard = () => {
        const { cardList, delID } = this.state
        axios({
            method: 'GET',
            url: `/api/userStages/deleteBank?id=${delID}`
        })
            .then(res => {
                this.props.navigation.goBack()
                this.setState({
                    isShow: false,
                    delShow: true,
                    hint: '银行卡删除成功！'
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            delShow: false
                        })
                    }, 1000)
                })
            })
            .catch(err => {
                console.log('删除失败', err)
                this.setState({
                    isShow: false,
                    delShow: true,
                    hint: '银行卡删除失败！'
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            delShow: false
                        })
                    }, 1000)
                })
            })
    }
    // 编辑银行卡信息
    editCard = card => {
        this.props.navigation.navigate('EditBankCard', { cardInfo: card })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    // 下拉刷新
    onRefresh = () => {
        this.getBankList(this.state.account)
    }
    render() {
        const { cardList, isShow, delShow, hint, refreshing } = this.state
        return (
            <View style={{ flex: 1, paddingTop: 30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>银行卡管理</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} 
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            colors={['rgb(255, 176, 0)', "#ffb100"]}
                            onRefresh={() => this.onRefresh()}
                        />
                    }>
                    {
                        cardList.length === 0 ? null : cardList.map((item, index) => {
                            console.log(item)
                            return (
                                <View key={item.id} style={styles.cardItem}>
                                    <View style={styles.cardItemInfo}>
                                        <Text style={{ fontWeight: 'bold' }}>卡号：
                                            {item.bankCode.substr(0, 4)}****{item.bankCode.substr(item.bankCode.length - 4)}
                                        </Text>
                                        <Text>所属银行：{item.bankName}</Text>
                                    </View>

                                    <View style={styles.cardHandle}>
                                        <View style={styles.cardHandleItem}>
                                            <Ionicons name='ios-create-outline' size={20}></Ionicons>
                                            <Text onPress={() => this.editCard(item)}>编辑</Text>
                                        </View>
                                        <View style={styles.cardHandleItem}>
                                            <Feather name="trash-2" size={18} />
                                            <Text onPress={() => this.showDelModal(item.id)}>删除</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.addBtn} onPress={this.toAddBankCard}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Feather name='plus-square' style={{ color: 'white', marginRight: 10 }} size={16}></Feather>
                            <Text style={{ color: 'white' }}>添加一张新银行卡</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* 删除银行卡提示 */}
                <Modal
                    isVisible={isShow}
                    onBackdropPress={() => this.setState({ isShow: false })}
                    backdropOpacity={0.2}
                    style={styles.promptModal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '90%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>确认是否删除此银行卡？</Text>
                        </View>
                        <View style={styles.modalBtn}>
                            <TouchableOpacity style={styles.modalcan} onPress={() => this.setState({ isShow: false })}>
                                <Text style={{ color: '#4EA4FB', }}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalcan, { borderLeftWidth: 1, borderColor: '#ccc' }]} onPress={this.delCard}>
                                <Text style={{ color: '#4EA4FB', }}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                {/* 删除银行卡成功提示 */}
                <Modal
                    isVisible={delShow}
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
    cardItem: {
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5
    },
    cardItemInfo: {
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        paddingBottom: 10
    },
    cardHandle: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 10
    },
    cardHandleItem: {
        flexDirection: 'row',
        marginLeft: 20,
        alignItems: 'center'
    },
    footer: {
        height: 55,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    addBtn: {
        backgroundColor: '#1195E3',
        width: '95%',
        height: 40,
        borderRadius: 20,
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
    },
    promptModal: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#ccc'
    },
    modalcan: {
        color: '#4EA4FB',
        height: '100%',
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center'
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
})

function mapStateToProps(state) {
    return {
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(BankCard)