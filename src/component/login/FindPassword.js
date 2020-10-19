import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';


class FindPassword extends Component {
    state = {
        time: 60,
        codeShow: false,
        telphone: '', // 用户手机号
        telNone: false,
        userPass: '', // 用户密码
        code: '', // 手机验证码
        promptModal: false,
        promptInfo: ''
    }
    componentDidMount() {
        this.props.onRef(this)
    }
    cleanInput = () => {
        this.setState({
            userPhone: '',
            userPass: '',
            telNone: false
        })
    }
    setPassword = () => {
        const { userPass, telphone, code, telNone } = this.state
        if (telNone || telphone === '') {
            this.setState({
                promptModal: true,
                promptInfo: '手机号为空或不正确'
            })
        } else if (code === '') {
            this.setState({
                promptModal: true,
                promptInfo: '验证码为空或不正确'
            })
        } else if (userPass === '') {
            this.setState({
                promptModal: true,
                promptInfo: '密码为空或不正确'
            })
        } else {
            if (userPass.length < 6) {
                this.setState({
                    promptModal: true,
                    promptInfo: '密码太短，请重新输入'
                })
            } else {
                axios({
                    url: '/api/appLogin/retrievePassword',
                    method: 'POST',
                    data: {
                        code: code,
                        password: userPass,
                        type: this.props.type,
                        accountNumber: telphone
                    }
                })
                    .then(res => {
                        // console.log('重置密码成功', res)
                        this.setState({
                            promptInfo: res.data.message,
                            promptModal: true
                        })
                        if (res.data.status === 200) {
                            this.props.toPasswordLogin()
                        }
                    })
                    .catch(err => {
                        console.log('重置密码失败',err)
                    })
            }
        }
        this.setState({
            userPass: '',
            telphone: '',
            code: ''
        })
    }
    findPhone = (text) => { // 手机号
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
    findPwd = (text) => { // 密码
        this.setState({
            userPass: text
        })
    }
    findCode = (text) => { // 验证码
        this.setState({
            code: text
        })
    }
    // 倒计时
    timer = () => {
        if (this.state.telphone) {
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
                        // console.log('验证码获取成功',res)
                    })
                    .catch(err => {
                        console.log('验证码获取失败', err)
                    })
                if (this.state.time >= 0) {
                    this.codeTime = setInterval(() => {
                        this.setState({
                            time: this.state.time - 1,
                        }, () => {
                            if (this.state.time === 0) {
                                clearInterval(this.codeTime)
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
    componentWillUnmount() {
        clearInterval(this.codeTime)
    }
    goBack = () => {
        this.props.toPasswordLogin()
    }
    render() {
        const { telNone, codeShow, userPass, telphone, code, promptInfo, promptModal } = this.state
        return (
            <>
                {/* 手机号输入框 */}
                <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                        style={{ width: '65%' }}
                        placeholder="手机号"
                        maxLength={11}
                        onChangeText={text => this.findPhone(text)}
                        value={telphone} />
                    {telNone ? <Text style={{ color: 'red' }}>请正确输入</Text> : null}
                </View>
                {/* 验证码输入框 */}
                <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                        style={{ width: '65%' }}
                        placeholder="验证码"
                        onChangeText={text => this.findCode(text)}
                        value={code}></TextInput>
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
                {/* 设置登录密码输入框 */}
                <TextInput
                    secureTextEntry={true}
                    maxLength={16}
                    style={styles.textInput}
                    placeholder="设置新的密码（6-16位）"
                    onChangeText={text => this.findPwd(text)}
                    value={userPass} />
                <View style={{ width: '80%', marginTop: 20 }}>
                    <Text onPress={this.goBack}>返回登录页</Text>
                </View>
                {/* 找回密码按钮 */}
                <TouchableOpacity style={styles.submit} onPress={this.setPassword}>
                    <Text style={{ fontSize: 16, color: 'white' }}>确认并登录</Text>
                </TouchableOpacity>
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type
    }
}

export default connect(mapStateToProps)(FindPassword)

const styles = StyleSheet.create({
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
    submit: {
        width: '80%',
        justifyContent: 'center',
        backgroundColor: '#1195E3',
        marginTop: 40,
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
})
