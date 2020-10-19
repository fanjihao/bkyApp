import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions, Platform, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { finInfo, cleanInfo } from '../../store/merchantRegister/merRegisterActions';
import SyanImagePicker from 'react-native-syan-image-picker';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import Picker from 'react-native-picker';
import areaData from '../../assets/area';
import Feather from 'react-native-vector-icons/Feather';

// 获取屏幕宽度
const { width } = Dimensions.get('window');

class SecondStep extends Component {
    state = {
        step: 2,
        storeName: '', // 门店名称
        businessTime: '', // 经营时间
        storeAddress: '', // 门店省市区
        businessArea: '', // 经营面积
        headPerson: '', // 负责人姓名
        headIDCard: '', // 负责人身份证
        headPhone: '', // 负责人电话
        signboardPhoto: '', // 门店招牌照片
        storePhoto: '', // 门店内照片
        instaPlacePhoto: '', // 门店街景照片
        otherPhoto: '', // 其他照片
        promptModal: false, // 提示框
        promptInfo: '', // 提示信息
        headIdCardWrong: false, // 负责人身份证正则
        headPhoneWrong: false, // 负责人电话正则
        detailedAddress: '', // 门店详细地址
        province: '', // 省
        city: '', // 市
        district: '', // 区
        showModal: false,
        padd: false,
        showNoRoute: false,
        showNoText: '已提交请等待片刻！'
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
            }, 100)
        })
    }
    hidePicker = () => {
        Picker.hide()
        this.setState({
            showModal: false
        })
    }
    componentDidMount() {
        this.setState({
            storeName: this.props.merchantObj.storeName, // 门店名称
            businessTime: this.props.merchantObj.businessTime, // 经营时间
            storeAddress: this.props.merchantObj.storeAddress, // 门店地址
            province: this.props.merchantObj.province, // 省
            city: this.props.merchantObj.city, // 市
            district: this.props.merchantObj.district, // 区
            detailedAddress: this.props.merchantObj.detailedAddress, // 详细地址
            signboardPhoto: this.props.merchantObj.signboardPhoto, // 门店招牌照片
            storePhoto: this.props.merchantObj.storePhoto, // 门店内照片
            instaPlacePhoto: this.props.merchantObj.instaPlacePhoto, // 门店街景照片
            otherPhoto: this.props.merchantObj.otherPhoto, // 其他照片
            businessArea: this.props.merchantObj.businessArea, // 经营面积
            headPerson: this.props.merchantObj.headPerson, // 负责人姓名
            headIDCard: this.props.merchantObj.headIDCard, // 负责人身份证
            headPhone: this.props.merchantObj.headPhone, // 负责人电话
        })
    }
    componentWillUnmount() {
        Picker.hide()
    }
    // 获取图片
    selectImage = who => {
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
            enableBase64: false,        // 是否返回base64编码
            freeStyleCropEnabled: false,     // 裁剪框是否可拖拽
            rotateEnabled: false,       // 裁剪框是否可旋转
            scaleEnabled: true,     // 裁剪是否可放大缩小图片
        }
        SyanImagePicker.asyncShowImagePicker(options)
            .then(photos => {
                // console.log('获取到剪切的图片', photos)
                if (who === 'signboardPhoto') {
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
                                signboardPhoto: 'https://www.bkysc.cn/api/files-upload/' + responseJson.data
                            })
                        })

                } else if (who === 'storePhoto') {
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
                                storePhoto: 'https://www.bkysc.cn/api/files-upload/' + responseJson.data
                            })
                        })
                } else if (who === 'instaPlacePhoto') {
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
                                instaPlacePhoto: 'https://www.bkysc.cn/api/files-upload/' + responseJson.data
                            })
                        })
                } else if (who === 'otherPhoto') {
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
                                otherPhoto: 'https://www.bkysc.cn/api/files-upload/' + responseJson.data
                            })
                        })
                }
            })
            .catch(err => {
                // 取消选择，err.message为"取消"
                console.log('失败', err)
            })
    }
    // 商家入驻第一步
    toFirstStep = () => {
        const { storeName, businessTime, storeAddress,
            businessArea, headPerson, headIDCard, headPhone,
            signboardPhoto, storePhoto, instaPlacePhoto,
            otherPhoto, detailedAddress,
            province, city, district } = this.state
        this.props.finInfo({
            storeName, businessTime, storeAddress,
            businessArea, headPerson, headIDCard, headPhone,
            signboardPhoto, storePhoto, instaPlacePhoto, otherPhoto,
            province, city, district, detailedAddress, businessArea,
            headPerson, headIDCard, headPhone
        })
        this.props.navigation.goBack()
    }
    // 提交审核
    toStepSucceed = () => {
        // this.props.navigation.reset({
        //     index: 1,
        //     routes: [{ name: 'StepSucceed' }],
        // })

        // debounce(() => {
        const { storeName, businessTime, storeAddress,
            businessArea, headPerson, headIDCard, headPhone,
            signboardPhoto, storePhoto, instaPlacePhoto,
            otherPhoto, headIdCardWrong, headPhoneWrong, detailedAddress,
            province, city, district } = this.state
        let obj = this.props.route.params.obj
        const { merchantObj } = this.props
        console.log(merchantObj, '=====')

        this.setState({
            showNoRoute: true,
            showNoText: '请等会儿再试！'
        }, () => {
            if (storeName === '' || businessTime === '' || province === '' ||
                businessArea === '' || headPerson === '' || headIDCard === '' ||
                headPhone === '' || signboardPhoto === '' || storePhoto === '' ||
                instaPlacePhoto === '' || otherPhoto === '' || city === '' ||
                district === '') {
                this.setState({
                    promptModal: true,
                    promptInfo: '请您再仔细查看一下，还有资料没填哦！'
                })
            } else if (headIdCardWrong === true || headPhoneWrong === true) {
                this.setState({
                    promptModal: true,
                    promptInfo: '您好,您输入的个别资料格式不正确哦!'
                })
            } else {
                console.log('222')
                this.setState({
                    showNoRoute: true,
                    showNoText: '已提交请等待片刻！'
                })
                axios({
                    url: '/api/appLogin/register',
                    method: 'POST',
                    data: {
                        type: 2,
                        // 商家入驻第二步数据
                        name: storeName,
                        businessTime: businessTime,
                        storeAddress: province + city + district,
                        detailedAddress: detailedAddress,
                        businessArea: businessArea,
                        signboardPhoto: signboardPhoto,
                        storePhoto: storePhoto,
                        instaPlacePhoto: instaPlacePhoto,
                        image: otherPhoto,
                        personCharge: headPerson,
                        personCard: headIDCard,
                        personPhone: headPhone,
                        province,
                        city,
                        district,
                        // 商家入驻第一步数据
                        natureMerchant: obj.NatureMerchant,
                        referenceNumber: obj.recommendCode,
                        registrationCode: obj.activeCode,
                        creditCode: obj.creditCode,
                        merchantName: obj.storeName,
                        legalPerson: obj.legalPerson,
                        idCard: obj.legalIDCard,
                        phone: obj.legalPhone,
                        humanFace: obj.idFace,
                        nationalEmblem: obj.idEmblem,
                        collectionName: obj.openPerson,
                        openCard: obj.openCard,
                        accountNo: obj.openAccount,
                        reservePhone: obj.bankPhone,
                        // 手机号，验证码，密码
                        code: merchantObj.code,
                        password: merchantObj.password,
                        accountNumber: merchantObj.accountNumber
                    }
                })
                    .then(res => {
                        this.props.navigation.reset({
                            index: 1,
                            routes: [{ name: 'StepSucceed' }],
                        })
                        console.log('注册成功，等待审核', res)
                        // if (res.data.status === 200) {
                        this.props.cleanInfo()
                        // }
                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({
                            showNoText: '系统繁忙，请等会再试！'
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    showNoRoute: false
                                })
                            }, 1000)
                        })
                    })
            }
        })

        // }, 2000)
    }
    storeName = (val) => { // 门店名称
        this.setState({
            storeName: val
        })
        console.log(this.props.merchantObj)
    }
    businessTime = (val) => { // 经营时间
        this.setState({
            businessTime: val
        })
    }
    storeAddress = (val) => { // 门店省市区
        this.setState({
            storeAddress: val
        })
    }
    detailedAddress = (val) => { // 详细地址
        this.setState({
            detailedAddress: val
        })
    }
    businessArea = (val) => { // 经营面积
        this.setState({
            businessArea: val
        })
    }
    headPerson = (val) => { // 负责人姓名
        this.setState({
            headPerson: val
        })
    }
    headIDCard = (val) => { // 负责人身份证
        this.setState({
            headIDCard: val
        }, () => {
            if (!(/^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.state.headIDCard))) {
                this.setState({
                    headIDCardWrong: true
                })
            } else {
                this.setState({
                    headIDCardWrong: false
                })
            }
        })
    }
    headPhone = (val) => { // 负责人电话
        this.setState({
            headPhone: val
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.headPhone))) {
                this.setState({
                    headPhoneWrong: true
                })
            } else {
                this.setState({
                    headPhoneWrong: false
                })
            }
        })
    }
    render() {
        const { storeName, businessTime, storeAddress,
            businessArea, headPerson, headIDCard, headPhone,
            signboardPhoto, storePhoto, instaPlacePhoto, otherPhoto,
            promptModal, promptInfo, detailedAddress, showModal,
            province, city, district, showNoRoute, showNoText
        } = this.state
        const { type } = this.props
        let addressDom
        if (province === '' && city === '' && district === '') {
            addressDom =
                <Text onPress={this.fetchData} style={[styles.input, { color: '#A8A8A8', lineHeight: 40 }]}>请选择您的地址</Text>
        } else {
            addressDom =
                <Text onPress={this.fetchData} style={[styles.input, { color: '#000', lineHeight: 40 }]}>{province}-{city}-{district}</Text>
        }
        return (
            <ScrollView contentContainerStyle={{ paddingTop: type === 1 ? 30 : 0 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>完善门店信息(2/3)</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.toFirstStep} />
                </View>

                {/* <StepIns step={this.state.step} /> */}

                <Text style={styles.title}>资质信息</Text>
                {/* 门店名称 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>门店名称</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入门店名称"
                        value={storeName}
                        onChangeText={text => this.storeName(text)}></TextInput>
                </View>
                {/* 营业时间 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>营业时间</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="营业时间,例：8:00-20:00"
                        value={businessTime}
                        onChangeText={text => this.businessTime(text)}></TextInput>
                </View>
                {/* 门店地址 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>门店地址</Text>
                    </View>
                    {addressDom}
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
                </Modal>
                <View style={[styles.formItem, { justifyContent: 'flex-end' }]}>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入详细地址"
                        value={detailedAddress}
                        onChangeText={text => this.detailedAddress(text)} />
                </View>
                {/* 经营面积 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>经营面积</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入经营面积"
                        keyboardType='numeric'
                        value={businessArea}
                        onChangeText={text => {
                            const newText = text.replace(/[^\d]+/, '');
                            //可以打印看看是否过滤掉了非数字
                            console.log(newText)
                            this.businessArea(newText)
                        }}></TextInput>
                </View>

                {/* 上传照片 */}
                <View style={[styles.formItem, styles.idcardImg]}>
                    <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
                        <Text style={[styles.sign, { color: 'red' }]}>*</Text>
                        <Text style={{ width: '100%' }}>门店招牌照片</Text>
                    </View>
                    <View>
                        {
                            signboardPhoto
                                ? <TouchableOpacity onPress={() => this.selectImage('signboardPhoto')}>
                                    <Image style={styles.uploadImage} source={{ uri: signboardPhoto }}></Image>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.uploadImage} onPress={() => this.selectImage('signboardPhoto')}>
                                    <Ionicons name="add-outline" size={24} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={[styles.formItem, styles.idcardImg]}>
                    <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
                        <Text style={[styles.sign, { color: 'red' }]}>*</Text>
                        <Text style={{ width: '100%' }}>门店内照片</Text>
                    </View>
                    <View>
                        {
                            storePhoto
                                ? <TouchableOpacity onPress={() => this.selectImage('storePhoto')}>
                                    <Image style={styles.uploadImage} source={{ uri: storePhoto }}></Image>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.uploadImage} onPress={() => this.selectImage('storePhoto')}>
                                    <Ionicons name="add-outline" size={24} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={[styles.formItem, styles.idcardImg]}>
                    <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
                        <Text style={[styles.sign, { color: 'red' }]}>*</Text>
                        <Text style={{ width: '100%' }}>门店街景照片</Text>
                    </View>
                    <View>
                        {
                            instaPlacePhoto
                                ? <TouchableOpacity onPress={() => this.selectImage('instaPlacePhoto')}>
                                    <Image style={styles.uploadImage} source={{ uri: instaPlacePhoto }}></Image>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.uploadImage} onPress={() => this.selectImage('instaPlacePhoto')}>
                                    <Ionicons name="add-outline" size={24} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>
                <View style={[styles.formItem, styles.idcardImg]}>
                    <View style={{ flexDirection: 'row', width: '50%', alignItems: 'center' }}>
                        <Text style={[styles.sign, { color: 'red' }]}>*</Text>
                        <Text style={{ width: '100%' }}>门店logo</Text>
                    </View>
                    <View>
                        {
                            otherPhoto
                                ? <TouchableOpacity onPress={() => this.selectImage('otherPhoto')}>
                                    <Image style={styles.uploadImage} source={{ uri: otherPhoto }}></Image>
                                </TouchableOpacity>
                                : <TouchableOpacity style={styles.uploadImage} onPress={() => this.selectImage('otherPhoto')}>
                                    <Ionicons name="add-outline" size={24} />
                                </TouchableOpacity>
                        }
                    </View>
                </View>

                <Text style={styles.title}>负责人信息</Text>
                {/* 负责人姓名 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>负责人姓名</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入负责人姓名"
                        value={headPerson}
                        onChangeText={text => this.headPerson(text)}></TextInput>
                </View>
                {/* 负责人身份证号 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>负责人身份证号</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入负责人身份证号"
                        value={headIDCard}
                        onChangeText={text => this.headIDCard(text)}></TextInput>
                </View>
                {/* 负责人手机号 */}
                <View style={styles.formItem}>
                    <View style={styles.formItemLeft}>
                        <Text style={styles.sign}>*</Text>
                        <Text style={styles.label}>负责人手机号</Text>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="请输入负责人手机号"
                        value={headPhone}
                        onChangeText={text => this.headPhone(text)}></TextInput>
                </View>
                {
                    showNoRoute
                        ? <Text style={styles.noClick}>{showNoText}</Text>
                        : <TouchableOpacity style={styles.next} onPress={this.toStepSucceed}>
                            <Text style={{ color: 'white' }}>提交审核</Text>
                        </TouchableOpacity>
                }

                <Modal
                    isVisible={promptModal}
                    // onBackdropPress={() => this.setState({ promptModal: false })}
                    backdropOpacity={0.5}
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
                        <TouchableOpacity style={styles.modalBtn} onPress={() => this.setState({ promptModal: false, showNoRoute: false })}>
                            <Text style={{ color: '#4EA4FB' }}>知道了</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
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
    title: {
        fontSize: 16,
        padding: 15,
        color: 'red'
    },
    formItem: {
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
        marginLeft: 10,
        // lineHeight:40
    },
    sign: {
        padding: 5,
        color: 'red'
    },
    label: {
        width: '90%'
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
    }
})

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type,
        merchantObj: state.merRegisterReducer.registerInfo
    }
}
function mapDispatchToProps(dispatch) {
    return {
        finInfo: (obj) => dispatch(finInfo(obj)),
        cleanInfo: () => dispatch(cleanInfo())
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SecondStep)