import React, { Component } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import Picker from 'react-native-picker';
import areaData from '../../assets/area';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/Feather';

export default class NewAddress extends Component {
    state = {
        province: '', // 省
        city: '', // 市
        district: '', // 区
        state: '', // 地址标签
        isDefault: false, // 是否设为默认
        addressDetail: '', // 详细地址
        phone: '', // 电话
        realName: '',
        showModal: false,
        id: '',
        telWrong: false,
        promptModal: false
    }
    // 挂载完毕获取数据
    componentDidMount() {
        if (this.props.route.params.isEdit) {
            axios({
                url: `/api/address/detail/${this.props.route.params.isEdit}`,
                method: 'GET',
            })
                .then(res => {
                    let data = res.data.data
                    this.setState({
                        province: data.province, // 省
                        city: data.city, // 市
                        district: data.district, // 区
                        state: '', // 地址标签
                        isDefault: data.isDefault, // 是否设为默认
                        addressDetail: data.detail, // 详细地址
                        phone: data.phone, // 电话
                        realName: data.realName,
                        id: data.id
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    // 收货人姓名
    realName = text => {
        this.setState({
            realName: text
        })
    }
    // 详细地址
    addressDetail = (text) => {
        this.setState({
            addressDetail: text
        })
    }
    // 标签
    checkLabel = (val) => {
        this.setState({
            state: val
        })
    }
    // 默认
    defaulted = () => {
        this.setState({
            isDefault: !this.state.isDefault, // 是否设为默认
        })
    }
    // 提交
    addAddress = () => {
        const { province, city, district, addressDetail,
            realName, state, phone, id, telWrong } = this.state
        if (telWrong || phone === '') {
            this.showPromptModal('手机号不存在或格式不正确')
        } else if (province === '' || city == '' || district === '') {
            this.showPromptModal('请选择您的地区')
        } else if (addressDetail === '') {
            this.showPromptModal('详细地址不能为空')
        } else if (realName === '') {
            this.showPromptModal('称呼不能为空')
        } else {
            axios({
                url: '/api/address/edit',
                method: 'POST',
                data: {
                    address: {
                        city: city,
                        district: district,
                        province: province
                    },
                    detail: addressDetail,
                    is_default: false,
                    phone: phone,
                    real_name: realName,
                    id: id
                },
            })
                .then(res => {
                    console.log(res)
                    if (res.data.status === 200) {
                        this.props.navigation.replace('MyAddress')
                        if (this.props.route.params.isEdit) {
                            this.showPromptModal('修改成功')
                        } else {
                            this.showPromptModal('添加成功')
                        }
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
    setPhone = (s) => {
        this.setState({
            phone: s,
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.phone))) {
                this.setState({
                    telWrong: true
                })
            } else {
                this.setState({
                    telWrong: false
                })
            }
        })
    }
    fetchData = () => {
        this.setState({
            showModal: true
        }, () => {
            Picker.init({
                //数据源
                pickerData: areaData,
                pickerConfirmBtnText: '确定',
                pickerCancelBtnText: '取消',
                pickerTitleText: '选择您的地址',
                pickerToolBarFontSize: 18,
                pickerToolBarBg: [255, 255, 255, 1],
                pickerBg: [255, 255, 255, 1],
                pickerFontSize: 18,
                onPickerConfirm: (pickedValue) => {
                    console.log(pickedValue)
                    Picker.hide()
                    this.setState({
                        showModal: false,
                        province: pickedValue[0], // 省
                        city: pickedValue[1], // 市
                        district: pickedValue[2] // 区
                    })
                },
                onPickerCancel: () => {
                    Picker.hide()
                    this.setState({
                        showModal: false
                    })
                }
            })
            setTimeout(() => {
                Picker.show()
            }, 1000)
            // Picker.show()
        })
    }
    hidePicker = () => {
        Picker.hide()
        this.setState({
            showModal: false
        })
    }
    showPromptModal = (text) => {
        this.setState({
            promptModal: true,
            promptInfo: text
        })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { state, showModal, province, city,
            district, addressDetail,
            realName, isDefault, phone, id, telWrong, promptModal, promptInfo } = this.state
        let addressDom
        if (province === '' || city == '' || district === '') {
            addressDom =
                <Text onPress={this.fetchData} style={{ color: '#A8A8A8' }}>请选择您的地址</Text>
        } else {
            addressDom =
                <Text onPress={this.fetchData} style={{ color: 'black' }}>{province}-{city}-{district}</Text>
        }
        return (
            <View style={{ backgroundColor: 'white', flex: 1, paddingTop:30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {
                            this.props.route.params.isEdit ? '修改收货地址' : '添加收货地址'
                        }
                    </Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.label}>联系人</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="用于收货时对您的称呼"
                        value={realName}
                        onChangeText={(text) => this.realName(text)}></TextInput>
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.label}>手机号码</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入您收货时的手机号"
                        value={phone}
                        onChangeText={text => this.setPhone(text)}></TextInput>
                    {telWrong ? <Text style={{ color: 'red' }}>请正确输入</Text> : null}
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.label}>地址</Text>
                    <View style={{ paddingLeft: 12 }}>
                        {addressDom}
                    </View>
                </View>
                <View style={styles.formItem}>
                    <Text style={styles.label}>门牌号</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="例：双流区复城国际T2203室"
                        value={addressDetail}
                        onChangeText={(text) => this.addressDetail(text)}></TextInput>
                </View>
                <Modal
                    isVisible={showModal}
                    onBackdropPress={() => {
                        Picker.hide()
                        this.setState({
                            showModal: false
                        })
                    }}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}>
                    {/* <Picker></Picker> */}
                </Modal>
                {/* <View style={styles.formItem}>
                    <TouchableOpacity onPress={this.defaulted}>
                        <View style={
                            [styles.defaultAddBtn,
                            this.state.isDefault ? styles.defaulted : null]}></View>
                    </TouchableOpacity>
                    <Text>设为默认地址</Text>
                </View> */}
                <View style={styles.addBtnBox}>
                    <TouchableOpacity style={styles.addBtn} onPress={this.addAddress}>
                        {
                            this.props.route.params.isEdit
                                ? <Text style={{ color: 'white', fontSize: 16 }}>确认修改</Text>
                                : <Text style={{ color: 'white', fontSize: 16 }}>确认添加</Text>
                        }
                    </TouchableOpacity>
                </View>
                <Modal
                    isVisible={promptModal}
                    onBackdropPress={() => this.setState({ promptModal: false })}
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
                            <Text>{promptInfo}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formItem: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderRadius: 3,
        paddingLeft: 10
    },
    input: {
        height: 40,
        width: '45%',
        marginLeft: 10,
    },
    sign: {
        padding: 5
    },
    label: {
        width: '30%'
    },
    title: {
        fontSize: 16,
        padding: 15
    },
    biaoqian: {
        borderWidth: 1,
        width: 50,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 5
    },
    checked: {
        borderColor: 'red'
    },
    defaultAddBtn: {
        width: 20,
        height: 20,
        backgroundColor: '#ccc',
        marginRight: 10
    },
    defaulted: {
        backgroundColor: 'skyblue'
    },
    addBtnBox: {
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addBtn: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#FF4444'
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    promptModal: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
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