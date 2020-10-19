import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, Dimensions, Platform, ScrollView, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import SyanImagePicker from 'react-native-syan-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import { personInfoAction } from '../../store/user/userActions';
import Feather from 'react-native-vector-icons/Feather';

// 获取屏幕宽度
const { width } = Dimensions.get('window');

class AccountManagemeng extends Component {
    state = {
        showModal: false,
        type: this.props.type,
        // 银行卡列表
        cardList: [],
        defaultCard: {
            bankCode: '',
            bankName: '',
            id: '',
            uid: ''
        },
        promptModal: false,
        // 编辑信息
        editPersonInfo: {
            nickname: this.props.personInfo.nickname,
            avatar: this.props.personInfo.avatar
        },
        editInfo: false,
        hint: '',
        refreshing: false,
        routes: this.props.route.params,
        account:'', 
    }

    // 如果有银行卡，则第一张卡为默认使用
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
                    this.setState({
                        refreshing: false,
                        defaultCard: {
                            bankCode: '',
                            bankName: '',
                            id: '',
                            uid: ''
                        }
                    })
                } else {
                    this.setState({
                        cardList: res.data.data,
                        refreshing: false
                    })
                    this.setState({
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
    // 银行卡列表
    toBankCard = () => {
        this.props.navigation.navigate('BankCard')
    }

    toBack = () => {
        this.setState({ showModal: false })
    }

    // 退出登录
    loginOut = () => {
        this.setState({
            promptModal: true
        })
    }
    onPress = () => {
        this.setState({
            promptModal: false
        }, () => {
            storage.remove({ key: 'token' })
            storage.remove({ key: 'userInfo' })
            storage.remove({ key: 'agentLevel' })
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        })
    }
    // 修改昵称
    setNickname = value => {
        this.setState({
            editPersonInfo: {
                ...this.state.editPersonInfo,
                nickname: value
            }
        })
    }

    // 提交修改的信息
    saveInfo = () => {
        const { editPersonInfo } = this.state
        const { personInfo } = this.props
        if (editPersonInfo.nickname === '' || editPersonInfo.avatar === '') {
            this.setState({ editInfo: true, hint: '昵称或头像不能为空！' })
        }
        if (editPersonInfo.nickname === personInfo.nickname && editPersonInfo.avatar === personInfo.avatar) {
            this.setState({ editInfo: true, hint: '请确认修改了头像及昵称！' })
        } else {
            axios({
                method: 'POST',
                url: '/api/user/edit',
                data: {
                    // 昵称
                    nickname: editPersonInfo.nickname,
                    // 头像
                    avatar: editPersonInfo.avatar
                }
            })
                .then(res => {
                    console.log('修改成功')
                    let newPersonInfo = {
                        ...personInfo,
                        nickname: editPersonInfo.nickname,
                        avatar: editPersonInfo.avatar,
                        refreshing: false
                    }
                    this.props.getPersonInfo(newPersonInfo)
                    this.props.navigation.navigate('Tab')
                })
                .catch(err => {
                    console.log('修改失败', err)
                })
        }
    }
    // 更换头像
    selectImage = () => {
        const options = {
            imageCount: 1,      // 最大选择图片数目，默认6
            isCamera: false,        // 是否允许用户在内部拍照，默认true
            isCrop: true,       // 是否允许裁剪，默认false
            CropW: ~~(width * 0.4),     // 裁剪宽度，默认屏幕宽度60%
            CropH: ~~(width * 0.4),     // 裁剪高度，默认屏幕宽度60%
            isGif: false,       // 是否允许选择GIF，默认false，暂无回调GIF数据
            showCropCircle: true,       // 是否显示圆形裁剪区域，默认false
            showCropFrame: false,       // 是否显示裁剪区域，默认true
            showCropGrid: true,         // 是否隐藏裁剪区域网格，默认false
            enableBase64: true,        // 是否返回base64编码
            freeStyleCropEnabled: false,     // 裁剪框是否可拖拽
            rotateEnabled: false,       // 裁剪框是否可旋转
            scaleEnabled: true,     // 裁剪是否可放大缩小图片
        }
        SyanImagePicker.asyncShowImagePicker(options)
            .then(photos => {
                console.log('剪切的图片文件名', photos[0].uri.split('/')[photos[0].uri.split('/').length - 1])
                console.log('剪切的图片的本地路径', photos[0].uri.replace('file://', ''))
                // 上传到服务器
                let source
                if (Platform.OS === 'android') {
                    source = photos[0].uri
                } else {
                    source = photos[0].uri.replace('file://', '')
                }
                RNFetchBlob.fetch(
                    'POST',
                    'http://47.108.174.202:8009/api/upload/files-upload',
                    {
                        'Content-Type': 'multipart/form-data'
                    },
                    [{
                        name: 'file',
                        type: 'image/jpeg',
                        data: RNFetchBlob.wrap(source),
                        filename: photos[0].uri.split('/')[photos[0].uri.split('/').length - 1]
                    }]
                )
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log('上传成功', responseJson)
                        this.setState({
                            editPersonInfo: {
                                ...this.state.editPersonInfo,
                                avatar: 'https://www.bkysc.cn/api/files-upload/' + responseJson.data
                            }
                        })
                    })
            })
            .catch(err => {
                // 取消选择，err.message为"取消"
                console.log('失败', err)
            })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    // 下拉刷新
    onRefresh = () => {
        this.getBankList(this.state.account)
    }
    read = () => {
        this.props.navigation.navigate('UserAgree')
    }

    render() {
        const { showModal, type, defaultCard, promptModal, editInfo, editPersonInfo, hint, refreshing } = this.state
        const { personInfo } = this.props
        return (
            <ScrollView style={{ paddingTop: 30 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        colors={['rgb(255, 176, 0)', "#ffb100"]}
                        onRefresh={() => this.onRefresh()}
                    />
                }>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>管理我的账号</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={{ backgroundColor: 'white', marginBottom: 5 }}>
                    <Text style={{ margin: 10 }}>管理我的账号</Text>
                    <View style={[styles.identity, { position: 'relative' }]}>
                        <TouchableOpacity onPress={this.selectImage}>
                            <Image style={styles.headImage} source={{ uri: editPersonInfo.avatar }}></Image>
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                {this.props.type === 1
                                ? <Text style={{ marginBottom: 5 }}>用户：{personInfo.nickname}</Text>
                                : <Text style={{ marginBottom: 5 }}>商户：{personInfo.merchantName}</Text>}
                                <Text style={{ color: '#CBC4C6', fontSize: 12 }}>
                                    绑定手机号：
                                    {type === 1 
                                    ? personInfo.account.substr(0, 3) + '****' + personInfo.account.substr(personInfo.account.length - 4)
                                    : personInfo.accountNumber.substr(0, 3) + '****' + personInfo.accountNumber.substr(personInfo.accountNumber.length - 4)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ backgroundColor: 'white' }}>
                    <View style={styles.info}>
                        <Text style={styles.title}>昵称</Text>
                        <TextInput value={editPersonInfo.nickname} style={{ color: '#A7A6A7' }} onChangeText={value => this.setNickname(value)}></TextInput>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>ID号</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput style={{ color: '#A7A6A7' }} editable={false}>{personInfo.uid}</TextInput>
                            <Ionicons name="ios-lock-closed-outline" size={18} />
                        </View>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>手机号码</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput style={{ color: '#A7A6A7' }} editable={false}>
                                {
                                    this.props.type === 1 
                                    ? personInfo.account.substr(0, 3) + '****' + personInfo.account.substr(personInfo.account.length - 4)
                                    // :null
                                    : personInfo.accountNumber.substr(0, 3) + '****' + personInfo.accountNumber.substr(personInfo.accountNumber.length - 4)
                                }
                            </TextInput>
                            <Ionicons name="ios-lock-closed-outline" size={18} />
                        </View>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>银行卡</Text>
                        <Text style={{ color: '#0F96E4' }} onPress={defaultCard.id === '' ? this.toAddBankCard : this.toBankCard}>{defaultCard.id === '' ? '添加' : '查看'}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.title}>《用户协议与隐私政策》</Text>
                        <Text style={{ color: '#0F96E4' }} onPress={this.read}>查看</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.save} onPress={this.saveInfo}>
                    <Text style={{ color: 'white' }}>保存修改</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.goBack} onPress={this.loginOut}>
                    <Text style={{ color: '#B7B4B7' }}>退出登录</Text>
                </TouchableOpacity>
                {/* 退出登录提示 */}
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
                            <Text>确认是否退出登录？</Text>
                        </View>
                        <View style={styles.modalBtn}>
                            <TouchableOpacity style={styles.modalcan} onPress={() => this.setState({ promptModal: false })}>
                                <Text style={{ color: '#4EA4FB', }}>取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalcan, { borderLeftWidth: 1, borderColor: '#ccc' }]} onPress={this.onPress}>
                                <Text style={{ color: '#4EA4FB', }}>确定</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* 修改信息提示 */}
                <Modal
                    isVisible={editInfo}
                    onBackdropPress={() => this.setState({ editInfo: false })}
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
                            <Text>{hint}</Text>
                        </View>
                        <Text style={styles.toEdit} onPress={() => this.setState({ editInfo: false })}>去修改</Text>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    identity: {
        width: '94%',
        height: 80,
        borderWidth: 2,
        borderColor: '#D78E8A',
        borderRadius: 10,
        marginLeft: '3%',
        marginBottom: '3%',
        backgroundColor: '#FFF9FB',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        margin: 15,
        backgroundColor: 'white'
    },
    info: {
        borderBottomWidth: 1,
        borderBottomColor: '#F8F6F9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        marginLeft: 15,
        marginRight: 15
    },
    save: {
        width: '70%',
        height: 40,
        backgroundColor: '#0F96E4',
        color: 'white',
        borderRadius: 5,
        marginLeft: '15%',
        marginBottom: 20,
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    goBack: {
        width: '70%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        marginLeft: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        color: '#444B4D',
        fontWeight: "bold"
    },
    cut: {
        width: '30%',
        height: 25,
        backgroundColor: 'white',
        textAlign: 'center',
        lineHeight: 25,
        borderWidth: 1,
        borderColor: '#EDEDED',
        position: 'absolute',
        top: 0,
        right: 10
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    submit: {
        backgroundColor: '#1196E4',
        height: 40,
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 40,
        color: 'white'
    },
    user: {
        height: 50,
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 18,
        color: '#747474',
        fontWeight: 'bold'
    },
    merchant: {
        height: 50,
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 18,
        color: '#747474',
        fontWeight: 'bold'
    },
    check: {
        color: '#86D5E9',
        height: 50,
        textAlign: 'center',
        lineHeight: 50,
        fontSize: 18,
        fontWeight: 'bold'
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
    toEdit: {
        width: '100%',
        height: 50,
        borderTopWidth: 1,
        borderColor: '#ccc',
        textAlign: 'center',
        lineHeight: 50,
        color: '#4EA4FB',
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
        type: state.loginReducer.type,
        personInfo: state.userReducer.personInfo
    }
}
// 修改个人信息到redux
function mapDispatchToProps(dispatch) {
    return {
        getPersonInfo: (personInfo) => dispatch(personInfoAction(personInfo))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagemeng)