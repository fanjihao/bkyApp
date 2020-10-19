import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { personInfoAction } from '../../store/user/userActions';

class AuthCodeLogin extends Component {
    state = {
        telNone: false,
        telPhone: '', // 手机号
        phoneCode: '', // 验证码
        time: 60,
        codeShow: false,
        promptModal: false,
        promptInfo: '',
        loadingModal:false
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    cleanInput = () => {
        this.setState({
            telPhone: '',
            phoneCode: '',
            telNone: false
        })
    }
    toPasswordLogin = () => {
        this.props.toPasswordLogin()
    }
    register = () => {
        this.props.navigation.navigate('Register')
    }
    login = () => { // 登录
        const { phoneCode, telNone, telPhone } = this.state
        if (telNone || telPhone === '') {
            this.setState({
                promptModal: true,
                promptInfo: '手机号为空或者格式不正确'
            })
        } else if (phoneCode === '') {
            this.setState({
                promptModal: true,
                promptInfo: '验证码不能为空'
            })
        } else {
            axios({
                url: '/api/appLogin/merchantLogin',
                method: 'POST',
                data: {
                    accountNumber: this.state.telPhone,
                    code: this.state.phoneCode,
                    type: this.props.type
                }
            })
                .then(res => {
                    if (res.data.status === 200) {
                        // 保存token到本地
                        storage.save({
                            key: 'token',
                            data: res.data.token
                        })
                        // 加盟商等级不同，加盟店专区商品价格也有所不同，商家专有
                        if (this.props.type === 2) {
                            // 加盟商等级
                            storage.save({
                                key: 'agentLevel',
                                data: res.data.data.agentLevel
                            })
                        }
                        this.props.getPersonInfo(res.data.data)
                        this.setState({
                            loadingModal: true,
                            userPass: '',
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    loadingModal: false,
                                }, () => {
                                    this.props.navigation.replace('Tab')
                                })
                            }, 1000)
                        })
                    } else {
                        this.setState({
                            promptModal: true,
                            promptInfo: '账号或验证码不正确'
                        })
                    }
                    this.setState({
                        phoneCode: '',
                    })
                })
                .catch(err => {
                    this.setState({
                        promptModal: true,
                        promptInfo: '登录失败',
                        phoneCode: '',
                    })
                })
        }
    }
    codePhone = text => { // 手机号
        this.setState({
            telPhone: text,
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.telPhone))) {
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
    phoneCode = text => { // 验证码
        this.setState({
            phoneCode: text
        })
    }
    // 倒计时
    timer = () => {
        if (this.state.telPhone) {
            this.setState({
                codeShow: true
            }, () => {
                axios({
                    url: '/api/appLogin/register/verify',
                    method: 'POST',
                    data: 'phone=' + this.state.telPhone,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                    }
                })
                    .then(res => {
                        // console.log('验证码获取成功',res)
                    })
                    .catch(err => {
                        console.log('验证码获取失败', err)
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
        const { radios, code, token, telNone, codeShow, telPhone, phoneCode, promptModal, promptInfo, loadingModal } = this.state
        return (
            <>
                {/* 手机号输入框 */}
                <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                        style={{ width: '65%' }}
                        placeholder="手机号"
                        maxLength={11}
                        onChangeText={text => this.codePhone(text)}
                        value={telPhone} />
                    {telNone ? <Text style={{ color: 'red' }}>请正确输入</Text> : null}
                </View>
                {/* 验证码输入框 */}
                <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                        style={{ width: '65%' }}
                        placeholder="验证码"
                        onChangeText={text => this.phoneCode(text)}
                        value={phoneCode}></TextInput>
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
                
                <Modal
                    isVisible={loadingModal}
                    backdropOpacity={0.2}
                    style={styles.modal}
                    animationInTiming={20}
                    animationOutTiming={20}
                >
                    <View style={{ width: '90%', height: 150, backgroundColor: 'white', borderRadius: 20, justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>正在登录......</Text>
                        <ActivityIndicator size="small" color="#1195E3" />
                    </View>
                </Modal>
                {/* 登陆的方式默认为密码登录 */}
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

                <View style={styles.loginMode}>
                    {/* 密码登录 */}
                    <Text onPress={this.toPasswordLogin}>密码登录</Text>
                </View>

                {/* 登录按钮 */}
                <View style={{ width: '90%', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <TouchableOpacity style={styles.submit} onPress={this.register}>
                        <Text style={{ fontSize: 16, color: 'white' }}>注册</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.submit} onPress={this.login}>
                        <Text style={{ fontSize: 16, color: 'white' }}>登录</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    modal: {
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
    textInput: {
        width: '80%',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginTop: 20
    },
    loginMode: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginTop: 20
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
    submit: {
        width: '40%',
        justifyContent: 'center',
        backgroundColor: '#1195E3',
        // backgroundColor:'pink',
        marginTop: 40,
        height: 40,
        alignItems: 'center'
    },
})

// 保存个人信息到redux
function mapDispatchToProps(dispatch) {
    return {
        getPersonInfo: (personInfo) => dispatch(personInfoAction(personInfo))
    }
}
export default connect(null, mapDispatchToProps)(AuthCodeLogin)