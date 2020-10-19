import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, RefreshControl } from 'react-native';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

export default class MyAddress extends Component {
    state = {
        addressList: [],
        defaultId: '',
        refreshing: true,
        isShow: false,
        delid: ''
    }
    getAddress = () => {
        axios({
            url: '/api/address/list',
            method: 'GET',
        })
            .then(res => {
                console.log('请求成功====', res.data.data)
                this.setState({
                    addressList: res.data.data,
                    refreshing: false
                })
            })
            .catch(err => {
                console.log('请求失败', err)
            })
    }
    // 挂载完毕获取数据
    componentDidMount() {
        this.getAddress()
        console.log(this.props)
    }
    onRefresh = () => {
        this.getAddress()
    }
    setDefault = (i) => {
        axios({
            url: '/api/address/default/set',
            method: 'POST',
            data: {
                id: i
            }
        })
            .then(res => {
                this.getAddress()
            })
            .catch(err => {
                console.log(err)
            })
    }
    toEdit = (id) => {
        this.props.navigation.navigate('NewAddress', { isEdit: id, defaultId: this.state.defaultId })
    }
    toDel = (id) => {
        this.setState({
            isShow: true,
            delid: id
        })
    }

    onPress = () => {
        axios({
            url: '/api/address/del',
            method: 'POST',
            data: {
                id: this.state.delid
            }
        })
            .then(res => {
                this.setState({
                    isShow: false,
                })
                this.getAddress()
            })
            .catch(err => {
                console.log(err)
            })
    }
    addNewAddress = () => {
        this.props.navigation.replace('NewAddress')
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { addressList, isShow } = this.state
        let addressDom
        if (addressList.length === 0) {
            addressDom =
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name='ios-add-circle-outline' size={50}></Ionicons>
                    <Text style={{ color: 'red', fontSize: 16, marginTop: 20 }}>您还没有收货地址，请点击新增收货地址</Text>
                </View>
        } else {
            addressDom =
                <View style={{ alignItems: 'center' }}>
                    {addressList.map(item => {
                        return (
                            <View key={item.id} style={{
                                width: '96%',
                                padding: 10,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor:'white',
                                marginBottom:10,
                                borderRadius:5
                            }}>
                                <View style={{ width: '100%', borderBottomWidth: 1, paddingBottom: 10, borderColor: '#eee' }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>收货人：{item.realName},{item.phone}</Text>
                                    <Text style={{ fontSize: 12, color: '#A6A6A6', marginTop: 5 }}>
                                        收货地址：{item.province}{item.city}{item.district}{item.detail}
                                    </Text>
                                </View>
                                <View style={{ width: '100%', height: 30, flexDirection: 'row', alignItems: 'center', justifyContent:'space-between', marginTop:10 }}>
                                    <TouchableOpacity onPress={() => this.setDefault(item.id)}
                                        style={{ flexDirection: 'row' }}>
                                        <View style={styles.littleDont}>
                                            <Ionicons name='ios-checkmark-circle-outline' size={20} style={{color:item.isDefault ? 'red' : 'black'}}></Ionicons>
                                        </View>
                                        <Text>设为默认</Text>
                                    </TouchableOpacity>
                                    <View style={{ width: '40%', flexDirection: 'row', alignItems: 'center', justifyContent:'space-between' }}>
                                        <TouchableOpacity onPress={() => this.toEdit(item.id)}
                                            style={{flexDirection:'row'}}>
                                            <View style={styles.littleDont}>
                                                <Ionicons name='ios-create-outline' size={22} style={{ color: 'blue' }}></Ionicons>
                                            </View>
                                            <Text>编辑</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => this.toDel(item.id)}
                                            style={{flexDirection:'row'}}>
                                            <View style={styles.littleDont}>
                                                <Ionicons name='md-trash' size={22} style={{ color: 'red' }}></Ionicons>
                                            </View>
                                            <Text>删除</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
        }
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: 'white', flex: 1, paddingTop: 30 }}
                refreshControl={
                    <RefreshControl
                        title={'下拉刷新'}
                        refreshing={this.state.refreshing}
                        colors={['rgb(255, 176, 0)', "#ffb100"]}
                        onRefresh={() => this.onRefresh()}
                    />
                }>

                <View style={styles.header}>
                    <Text style={styles.headerTitle}>地址管理</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={{ alignItems: 'center', flex: 1, backgroundColor:'#F5F5F5' }}>
                    <View style={{ flex: 1, width: '100%' }}>
                        {addressDom}
                    </View>
                    <Modal
                        isVisible={isShow}
                        onBackdropPress={() => this.setState({ isShow: false, delid: '' })}
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
                                <Text>您正在进行删除操作，确认是否继续？</Text>
                            </View>
                            <View style={styles.modalBtn}>
                                <TouchableOpacity style={styles.modalcan} onPress={() => this.setState({ isShow: false, delid: '' })}>
                                    <Text style={{ color: '#4EA4FB', }}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalcan, { borderLeftWidth: 1, borderColor: '#ccc' }]} onPress={this.onPress}>
                                    <Text style={{ color: '#4EA4FB', }}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.fixedFoot}>
                        <TouchableHighlight onPress={this.addNewAddress} style={styles.addAddress}>
                            <Text style={{ color: 'white', fontSize: 16, }}>新增收货地址</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    fixedFoot: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center'
    },
    addAddress: {
        backgroundColor: '#FF4444',
        width: '90%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:20
    },
    littleDont: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    modal: {
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
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
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