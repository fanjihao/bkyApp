import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Dimensions, Image, Platform } from 'react-native';
import RadioForm from 'react-native-simple-radio-button';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { openInfo } from '../../store/merchantRegister/merRegisterActions';
import SyanImagePicker from 'react-native-syan-image-picker';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import Feather from 'react-native-vector-icons/Feather';

// 获取屏幕宽度
const { width, height } = Dimensions.get('window');

class FirstStep extends Component {
    state = {
        step: 1,
        NatureMerchant: '渠道商',
        idFace: '', // 身份证人面
        idEmblem: '', // 身份证国徽
        promptInfo: '', // 提示信息
        promptModal: false, // 提示模态框
        creditWrong: false, // 统一信用正则
        idCardWrong: false, // 法人身份证正则
        leTelWrong: false, // 法人手机正则
        openCardWrong: false, // 开户人身份证正则
        openAccWrong: false, // 开户卡号正则
        bankPhoneWrong: false, // 银行预留卡号
        recommendCode: '', // 推荐码
        activeCode: '', // 注册码
        creditCode: '', // 统一信用代码
        merchantName: '', // 商户名称
        legalPerson: '', // 法人代表
        legalIDCard: '', // 法人身份证
        legalPhone: '', // 法人手机号
        openPerson: '', // 开户人
        openCard: '', // 开户人身份证
        openAccount: '', // 账户卡号
        bankPhone: '', // 银行预留手机号
        showNoText: '请等会儿再试！',
        showNoRoute: false,
        radios: [
            {
                label: '加盟商',
                value: '加盟商'
            },
            {
                label: '渠道商',
                value: '渠道商'
            },
        ],

        padd: false,
    }
    // 获取图片
    selectImage = (who) => {
        const options = {
            imageCount: 1,      // 最大选择图片数目，默认6
            isCamera: false,        // 是否允许用户在内部拍照，默认true
            isCrop: false,       // 是否允许裁剪，默认false
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
                // console.log('获取到剪切的图片', photos)
                if (who === 'idFace') {
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
                                idFace: 'https://www.bkysc.cn/api/files-upload/' + responseJson.data
                            })
                        })

                } else {
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
                                idEmblem: 'https://www.bkysc.cn/api/files-upload/' + responseJson.data
                            })
                        })
                }
            })
            .catch(err => {
                // 取消选择，err.message为"取消"
                console.log('失败', err)
            })
    }
    // 商家入驻第二步
    toSecondStep = () => {
        const { recommendCode, activeCode, creditCode, merchantName,
            legalPerson, legalIDCard, legalPhone, openPerson,
            openCard, openAccount, bankPhone, creditWrong,
            idCardWrong, leTelWrong, openCardWrong, openAccWrong,
            bankPhoneWrong, idFace, idEmblem, NatureMerchant } = this.state
        let obj = {
            recommendCode, activeCode, creditCode, merchantName,
            legalPerson, legalIDCard, legalPhone, openPerson,
            openCard, openAccount, bankPhone, idFace, idEmblem, NatureMerchant
        }

        // this.props.navigation.navigate('SecondStep', {
        //     obj
        // })

        this.setState({
            showNoRoute: true,
            showNoText: '请等会儿再试！'
        }, () => {
            if (creditCode === '' || merchantName === '' || legalPerson === '' || legalIDCard === '' ||
                legalPhone === '' || openPerson === '' || openCard === '' || openAccount === '' ||
                bankPhone === '' || idFace === '' || idEmblem === '') {
                this.setState({
                    promptInfo: '请您再仔细查看一下，还有资料没填哦！',
                    promptModal: true,
                    // showNoRoute: false
                })
            } else if (creditWrong === true || idCardWrong === true || leTelWrong === true || openCardWrong === true ||
                openAccWrong === true || bankPhoneWrong === true) {
                this.setState({
                    promptModal: true,
                    promptInfo: '您好,您输入的个别资料格式不正确哦!',
                    // showNoRoute: false
                })
            } else if (NatureMerchant === '渠道商' && (recommendCode === '' || activeCode === '')) {
                this.setState({
                    promptModal: true,
                    promptInfo: '您好,渠道商的推荐码注册码是必填项!',
                    // showNoRoute: false
                })
            } else {
                // 商家入驻第二步
                this.props.navigation.navigate('SecondStep', {
                    obj
                })
                this.setState({ showNoRoute: false })
            }
        })


    }

    toLogin = () => {
        this.props.navigation.navigate('Register')
    }

    toHome = () => {
        this.props.navigation.navigate('Tab')
    }
    recomCode = (val) => { // 推荐码
        this.setState({
            recommendCode: val
        })
    }
    actCode = (val) => { // 注册码
        this.setState({
            activeCode: val
        })
    }
    creditCode = (val) => { // 统一信用
        this.setState({
            creditCode: val,
        }, () => {
            if (!(/^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/.test(this.state.creditCode))) {
                this.setState({
                    creditWrong: true
                })
            } else {
                this.setState({
                    creditWrong: false
                })
            }
        })
    }
    merchantName = (val) => { // 商户名称
        this.setState({
            merchantName: val
        })
    }
    legalPerson = (val) => { // 法人代表
        this.setState({
            legalPerson: val
        })
    }
    legalIDCard = (val) => { // 法人身份证
        this.setState({
            legalIDCard: val
        }, () => {
            if (!(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.state.legalIDCard))) {
                this.setState({
                    idCardWrong: true
                })
            } else {
                this.setState({
                    idCardWrong: false
                })
            }
        })
    }
    legalPhone = (val) => { // 法人手机号
        this.setState({
            legalPhone: val
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.legalPhone))) {
                this.setState({
                    leTelWrong: true
                })
            } else {
                this.setState({
                    leTelWrong: false
                })
            }
        })
    }
    openPerson = (val) => { // 开户人
        this.setState({
            openPerson: val
        })
    }
    openCard = (val) => { // 开户人身份证
        this.setState({
            openCard: val
        }, () => {
            if (!(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.state.openCard))) {
                this.setState({
                    openCardWrong: true
                })
            } else {
                this.setState({
                    openCardWrong: false
                })
            }
        })
    }
    openAccount = (val) => { // 账户卡号
        this.setState({
            openAccount: val
        }, () => {
            if (!(/^([1-9]{1})(\d{15}|\d{18})$/.test(this.state.openAccount))) {
                this.setState({
                    openAccWrong: true
                })
            } else {
                this.setState({
                    openAccWrong: false
                })
            }
        })
    }
    bankPhone = (val) => { // 银行预留手机号
        this.setState({
            bankPhone: val
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.bankPhone))) {
                this.setState({
                    bankPhoneWrong: true
                })
            } else {
                this.setState({
                    bankPhoneWrong: false
                })
            }
        })
    }
    render() {
        const { type } = this.props
        const { recommendCode, activeCode, creditCode, merchantName,
            legalPerson, legalIDCard, legalPhone, openPerson,
            openCard, openAccount, bankPhone, creditWrong, idCardWrong, leTelWrong,
            openCardWrong, openAccWrong, bankPhoneWrong, promptModal, promptInfo, idFace, idEmblem,
            NatureMerchant, showNoRoute, showNoText } = this.state
        return (
            <ScrollView contentContainerStyle={{ paddingTop: type === 1 ? 30 : 0 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>完善注册信息(1/3)</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={type === 1 ? this.toHome : this.toLogin} />
                </View>
                {/* 提示 */}
                <Modal
                    isVisible={promptModal}
                    style={styles.modal}
                    animationInTiming={100}
                    animationOutTiming={20}
                >
                    <View style={{ width: '90%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-between' }}>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Text style={{ fontSize: 18, color: 'orange' }}>温馨提示</Text>
                        </View>
                        <View style={{ width: '100%', height: '30%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>{promptInfo}</Text>
                        </View>
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false, showNoRoute: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>



                <View style={[styles.formItem, { justifyContent: 'flex-start' }]}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>商户性质</Text>
                    </View>
                    <RadioForm
                        formHorizontal={true}
                        radio_props={this.state.radios}
                        initial={1}
                        animation={true}
                        onPress={(value) => this.setState({ NatureMerchant: value })}
                        style={{ width: '50%', justifyContent: 'space-between', alignItems: 'center' }}
                        buttonSize={10}
                        buttonOuterSize={20}>
                    </RadioForm>
                </View>

                {/* 推荐码 */}
                {NatureMerchant === '渠道商' ?
                    <View style={styles.formItem}>
                        <View style={styles.formItemLeft}>
                            <Text style={styles.sign}>*</Text>
                            <Text style={styles.label}>请输入推荐码</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="请输入推荐人手机号"
                            value={recommendCode}
                            onChangeText={text => this.recomCode(text)} />
                    </View> : null}
                {/* 激活码 */}
                {NatureMerchant === '渠道商' ?
                    <View style={styles.formItem}>
                        <View style={styles.formItemLeft}>
                            <Text style={styles.sign}>*</Text>
                            <Text style={styles.label}>请输入注册码</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="请输入6位注册码"
                            value={activeCode}
                            maxLength={6}
                            onChangeText={text => this.actCode(text)} />
                    </View> : null}


                <Text style={styles.title}>资质信息</Text>
                {/* 统一社会信用代码 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>统一社会信用代码</Text>
                    </View>
                    <TextInput style={[styles.input, creditWrong ? styles.errBor : null]}
                        value={creditCode}
                        placeholder="统一社会信用代码"
                        onChangeText={text => this.creditCode(text)}>
                    </TextInput>
                </View>
                {/* 商户名称 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>商户名称</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        value={merchantName}
                        placeholder="商户名称"
                        maxLength={20}
                        onChangeText={text => this.merchantName(text)}></TextInput>
                </View>
                {/* 法人代表 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>法人代表</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        value={legalPerson}
                        placeholder="请输入法人代表"
                        onChangeText={text => this.legalPerson(text)}></TextInput>
                </View>
                {/* 法人身份证号 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>法人身份证号</Text>
                    </View>
                    <TextInput style={[styles.input, idCardWrong ? styles.errBor : null]}
                        value={legalIDCard}
                        placeholder="请输入法人身份证号"
                        onChangeText={text => this.legalIDCard(text)}></TextInput>
                    {/* {idCardWrong ? <Text style={{ color: 'red', fontSize: 10 }}>请正确输入</Text> : null} */}
                </View>
                {/* 法人手机号 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>法人手机号</Text>
                    </View>
                    <TextInput style={[styles.input, leTelWrong ? styles.errBor : null]}
                        value={legalPhone}
                        placeholder="请输入法人手机号"
                        onChangeText={text => this.legalPhone(text)}></TextInput>
                    {/* {leTelWrong ? <Text style={{ color: 'red', fontSize: 10 }}>请正确输入</Text> : null} */}
                </View>
                {/* 上传身份证人像面 */}
                <View style={[styles.formItem, styles.idcardImg]}>
                    <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
                        <Text style={[styles.sign, { color: 'red' }]}>*</Text>
                        <Text style={{ width: '100%' }}>上传身份证人像面</Text>
                    </View>
                    <View>
                        {
                            idFace
                                ? <TouchableOpacity onPress={() => this.selectImage('idFace')}>
                                    <Image style={styles.uploadImage} source={{ uri: idFace }}></Image>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.uploadImage} onPress={() => this.selectImage('idFace')}>
                                    <Ionicons name="add-outline" size={24} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
                {/* 上传身份证国徽面 */}
                <View style={[styles.formItem, styles.idcardImg]}>
                    <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
                        <Text style={[styles.sign, { color: 'red' }]}>*</Text>
                        <Text style={{ width: '100%' }}>上传身份证国徽面</Text>
                    </View>
                    <View>
                        {
                            idEmblem
                                ? <TouchableOpacity onPress={() => this.selectImage('idEmblem')}>
                                    <Image style={styles.uploadImage} source={{ uri: idEmblem }}></Image>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.uploadImage} onPress={() => this.selectImage('idEmblem')}>
                                    <Ionicons name="add-outline" size={24} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>

                <Text style={styles.title}>账户信息：关系到您的收益入账，请认真核对!</Text>
                {/* 开户人 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>开户人</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        value={openPerson}
                        placeholder="请输入开户人姓名"
                        onChangeText={text => this.openPerson(text)}></TextInput>
                </View>
                {/* 开户人身份证号 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>开户人身份证号</Text>
                    </View>
                    <TextInput style={[styles.input, openCardWrong ? styles.errBor : null]}
                        value={openCard}
                        placeholder="请输入开户人身份证号"
                        onChangeText={text => this.openCard(text)}
                    ></TextInput>
                    {/* {openCardWrong ? <Text style={{ color: 'red', fontSize: 10 }}>请正确输入</Text> : null} */}
                </View>
                {/* 账户卡号 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>账户卡号</Text>
                    </View>
                    <TextInput style={[styles.input, openAccWrong ? styles.errBor : null]}
                        value={openAccount}
                        placeholder="请输入账户卡号"
                        onChangeText={text => this.openAccount(text)}></TextInput>
                    {/* {openAccWrong ? <Text style={{ color: 'red', fontSize: 10 }}>请正确输入</Text> : null} */}
                </View>
                {/* 银行预留手机号 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>银行预留手机号</Text>
                    </View>
                    <TextInput style={[styles.input, bankPhoneWrong ? styles.errBor : null]}
                        value={bankPhone}
                        placeholder="请输入银行预留手机号"
                        onChangeText={text => this.bankPhone(text)}></TextInput>
                    {/* {bankPhoneWrong ? <Text style={{ color: 'red', fontSize: 10 }}>请正确输入</Text> : null} */}
                </View>

                {
                    showNoRoute
                        ? <Text style={styles.noClick}>{showNoText}</Text>
                        : <TouchableOpacity style={styles.next} onPress={this.toSecondStep}>
                            <Text style={{ color: 'white' }}>下一步</Text>
                        </TouchableOpacity>
                }

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    radios: {
        justifyContent: 'center',
        marginLeft: 30
    },
    next: {
        margin: 15,
        height: 50,
        backgroundColor: '#1195E3',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    noClick: {
        margin: 15,
        height: 50,
        textAlign: 'center',
        lineHeight: 50,
        // backgroundColor: '#1195E3',
        backgroundColor: 'red',
        color: 'white',
        borderRadius: 5
    },
    formItem: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        borderRadius: 3,
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        width: '50%',
        marginLeft: 10
    },
    sign: {
        padding: 5,
        color: 'red'
    },
    label: {
        width: '90%',
    },
    title: {
        fontSize: 16,
        padding: 15,
        color: 'red'
    },
    uploadImage: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F8FA',
        overflow: 'hidden',
        borderRadius: 15
    },
    idcardImg: {
        alignItems: 'flex-start',
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 80,
        justifyContent: 'space-between',
        height: 140
    },
    errBor: {
        borderWidth: 1,
        borderColor: 'red'
    },
    modal: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalBtn: {
        width: '100%',
        height: '30%',
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ccc'
    },
    formItemLeft: {
        flexDirection: 'row',
        width: '35%',
        justifyContent: 'flex-start',
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
})

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        obj: state.merRegisterReducer.registerInfo
    }
}
function mapDispatchToProps(dispatch) {
    return {
        openInfo: (obj) => dispatch(openInfo(obj)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstStep)