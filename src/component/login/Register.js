import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TextInput, TouchableOpacity, Button } from 'react-native';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { connect } from 'react-redux';
import { toUserAction, toMerchantAction } from '../../store/login/loginActions';
import storage from '../../storage/storage';
import { phoneInfo } from '../../store/merchantRegister/merRegisterActions';
import Modal from 'react-native-modal';

class Register extends Component {
    state = {
        token: '',
        radios: [
            {
                label: '用户',
                type: 1
            },
            {
                label: '商家',
                type: 2
            },
        ],
        time: 60,
        codeShow: false,
        telphone: '', // 用户手机号
        telNone: false,
        userPass: '', // 用户密码
        code: '', // 手机验证码,
        promptInfo: '',
        promptModal: false,
        passErr:false
    }

    componentDidMount() {
    }
    register = () => { // 用户注册
        const { userPass, telphone, code } = this.state
        if (userPass === '' || telphone === '' || code === '') {
            this.setState({
                promptModal: true,
                promptInfo: '请先输入！'
            })
        } else {
            axios({
                url: '/api/appLogin/register',
                method: 'POST',
                data: {
                    password: userPass,
                    accountNumber: telphone,
                    type: 1,
                    code: code
                }
            })
                .then(res => {
                    storage.save({
                        key: 'token',
                        data: res.data.token
                    })
                    this.setState({
                        telphone: '',
                        code: '',
                        userPass: ''
                    })
                    this.props.navigation.push('Tab')
                })
                .catch(err => {
                    console.log('注册失败', err)
                    this.setState({
                        promptModal: true,
                        promptInfo: '注册失败,请过会儿再试！'
                    })
                })
        }

    }
    next = () => {
        const { telphone, code, userPass, telNone, passErr } = this.state
        this.props.phoneInfo({
            telphone,
            code,
            userPass
        })
        if (telphone === '' || code === '' || userPass === '') {
            this.setState({
                promptModal: true,
                promptInfo: '账号密码很重要，不能为空'
            })
        } else if(telNone || passErr) {
            this.setState({
                promptModal: true,
                promptInfo: '资料格式不对'
            })
        } else {
            // 商家入驻第一步
            this.props.navigation.navigate('FirstStep', { userTOmarchant: false })
        }
    }
    registerPhone = (text) => { // 手机号
        this.setState({
            telphone: text,
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.telphone))) {
                this.setState({
                    telNone: true
                })
            } else {
                this.setState({
                    telNone: false
                })
            }
        })
    }
    registerPwd = (text) => { // 密码
        this.setState({
            userPass: text
        }, () => {
            if(this.state.userPass.length < 6) {
                this.setState({
                    passErr:true
                })
            } else {
                this.setState({
                    passErr:false
                })
            }
        })
    }
    phoneCode = (text) => { // 验证码
        this.setState({
            code: text
        })
    }
    // 倒计时
    timer = () => {
        if (this.state.telphone && !this.state.telNone) {
            this.setState({
                codeShow: true
            }, () => {
                axios({
                    url: '/api/appLogin/register/verify',
                    method: 'POST',
                    data: 'phone=' + this.state.telphone,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                })
                    .then(res => {
                        console.log(res)
                    })
                    .catch(err => {
                        console.log(err)
                    })
                if (this.state.time >= 0) {
                    var codeTime = setInterval(() => {
                        this.setState({
                            time: this.state.time - 1,
                        }, () => {
                            if (this.state.time === 0) {
                                clearInterval(codeTime)
                                this.setState({
                                    codeShow: false,
                                    time: 60
                                })
                            }
                        })
                    }, 1000)
                }
            })
        } else {
            this.setState({
                telNone: true
            })
        }
    }
    render() {
        const { radios, code, token, telNone, codeShow, promptModal, promptInfo, passErr } = this.state
        const { type, toUser, toMerchant } = this.props
        return (
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}>
                <ImageBackground style={styles.body} source={require('../../assets/img/banner.png')}>
                    {/* LOGO */}
                    <View style={styles.header}>
                        <Image source={require('../../assets/img/logo.png')} />
                        <Text style={{ marginTop: 10, color: '#FAFBFD', fontSize: 16 }}>博客云</Text>
                    </View>
                    {/* 表单 */}
                    <View style={styles.content}>
                        <Text style={{ padding: 30, fontSize: 16 }}>注册</Text>
                        {/* 单选按钮 */}
                        <RadioForm
                            formHorizontal={true}
                            animation={true}
                            initial={type}>
                            {
                                radios.map((item, index) => (
                                    <RadioButton labelHorizontal={true} key={item.type}>
                                        <RadioButtonInput
                                            obj={item.label}
                                            index={item.type}
                                            isSelected={type === item.type}
                                            borderWidth={type === item.type ? 6 : 1}
                                            buttonInnerColor={'#EEEEEE'}
                                            buttonOuterColor={type === item.type ? '#1195E3' : '#E7E7E7'}
                                            buttonSize={5}
                                            buttonOuterSize={15}
                                            buttonWrapStyle={styles.radios}
                                            onPress={item.type === 1 ? () => toUser() : () => toMerchant()}
                                        />
                                        <RadioButtonLabel
                                            obj={item}
                                            index={item.type}
                                            labelHorizontal={true}
                                            labelStyle={{ fontSize: 16, color: type === item.type ? '#1195E3' : '#E7E7E7' }}
                                            labelWrapStyle={{ marginRight: 40 }}
                                            //改变redux里面的type值
                                            onPress={item.type === 1 ? () => toUser() : () => toMerchant()}
                                        />
                                    </RadioButton>
                                ))
                            }
                        </RadioForm>
                        <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                            <TextInput
                                style={{ width: '65%' }}
                                placeholder="手机号"
                                maxLength={11}
                                keyboardType='numeric'
                                onChangeText={text => this.registerPhone(text)} />
                            {telNone ? <Text style={{ color: 'red' }}>请正确输入</Text> : null}
                        </View>
                        <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                            <TextInput
                                style={{ width: '65%' }}
                                placeholder="验证码"
                                keyboardType='numeric'
                                onChangeText={text => this.phoneCode(text)}></TextInput>
                            {codeShow
                                ?
                                <View style={styles.timeView}>
                                    <Text style={{ color: 'white' }}>{this.state.time}s后重试</Text>
                                </View>
                                :
                                <View style={styles.codeView}>
                                    <Text style={{ color: 'white' }} onPress={this.timer}>发送验证码</Text>
                                </View>}
                        </View>
                        <TextInput
                            secureTextEntry={true}
                            maxLength={16}
                            style={{ width: '65%' }}
                            style={styles.textInput}
                            placeholder="设置登陆密码（6-16位）"
                            onChangeText={text => this.registerPwd(text)} />
                            {passErr ? <Text style={{ color: 'red' }}>密码太短</Text> : null}
                        <View style={{ width: '100%', alignItems: 'flex-start', paddingLeft: 25, marginTop: 15, marginBottom: 15 }}>
                            <Text onPress={() => this.props.navigation.goBack()}>返回登录</Text>
                        </View>
                        {/* 登录按钮 */}
                        <TouchableOpacity style={styles.submit} onPress={type === 1 ? this.register : this.next}>
                            {type === 1
                                ? <Text style={{ color: 'white' }}>注册并登录</Text>
                                : <Text style={{ color: 'white' }}>下一步</Text>}
                        </TouchableOpacity>
                        {/* 登陆协议 */}
                        <View style={{ marginTop: 20, flexDirection: 'row' }}>
                            <Text style={{ color: '#FC7590', marginRight: 5 }}>*</Text>
                            <Text>登录代表您同意</Text>
                            <Text style={{ color: '#1195E3' }}>《用户协议及隐私政策》</Text>
                        </View>
                    </View>
                </ImageBackground>

                {/* 注册提示框 */}
                <Modal
                    isVisible={promptModal}
                    onBackdropPress={() => this.setState({ promptModal: false })}
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
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 40,
        textAlign: 'center'
    },
    content: {
        width: '80%',
        // height: '70%',
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 5,
        paddingBottom: 30
    },
    radios: {
        justifyContent: 'center',
        marginLeft: 30
    },
    textInput: {
        width: '80%',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginTop: 20,
    },
    submit: {
        width: '80%',
        justifyContent: 'center',
        backgroundColor: '#1195E3',
        // marginTop: 40,
        height: 40,
        alignItems: 'center'
    },
    timeView: {
        width: 90,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginBottom: 5,
        backgroundColor: '#ccc'
    },
    codeView: {
        width: 90,
        height: 40,
        backgroundColor: '#1195E3',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginBottom: 5
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
})

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type
    }
}
function mapDispatchToProps(dispatch) {
    return {
        toUser: () => dispatch(toUserAction()),
        toMerchant: () => dispatch(toMerchantAction()),
        phoneInfo: (arr) => dispatch(phoneInfo(arr)), // 手机号验证码密码
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)