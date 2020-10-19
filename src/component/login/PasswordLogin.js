import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { personInfoAction } from '../../store/user/userActions';
import Modal from 'react-native-modal';

class PasswordLogin extends Component {
    state = {
        userPhone: '',
        userPass: '',
        telNone: false,
        promptModal: false,
        promptInfo: '',
        loadingModal: false
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

    toAuthCodeLogin = () => { // 验证码登录
        this.props.toAuthCodeLogin()
    }

    toFindPassword = () => {
        this.props.toFindPassword()
    }


    login = () => { // 登录
        const { userPass, userPhone, telNone } = this.state
        if (userPhone === '' || telNone) {
            this.setState({
                promptModal: true,
                promptInfo: '手机号为空或者格式不正确'
            })
        } else if (userPass === '') {
            this.setState({
                promptModal: true,
                promptInfo: '密码不能为空'
            })
        } else {
            axios({
                method: 'POST',
                url: '/api/appLogin/merchantLogin',
                data: {
                    accountNumber: this.state.userPhone,
                    password: this.state.userPass,
                    type: this.props.type
                }
            })
                .then(res => {
                    console.log('login登录成功',res.data.token)
                    if (res.data.status === 200) {
                        // 保存token到本地
                        storage.save({
                            key: 'token',
                            data: res.data.token
                        })
                        // 保存当前账户、密码
                        storage.save({
                            key: 'userInfo',
                            data: {
                                account: this.state.userPhone,
                                password: this.state.userPass,
                                type: this.props.type
                            }
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
                            promptInfo: res.data.message,
                            userPass: '',
                        })
                    }
                })
                .catch(err => {
                    console.log('登录失败', err)
                    this.setState({
                        promptModal: true,
                        promptInfo: '登录失败',
                        userPass: '',
                    })
                })
        }
    }
    register = () => {
        this.props.navigation.navigate('Register')
    }
    userPhone = (text) => { // 手机号
        this.setState({
            userPhone: text,
        }, () => {
            if (!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.state.userPhone))) {
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
    userPass = (text) => { // 密码
        this.setState({
            userPass: text
        })
    }

    render() {
        const { telNone, userPass, userPhone, promptModal, promptInfo, loadingModal } = this.state
        return (
            <>
                {/* 手机号输入框 */}
                <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center' }]}>
                    <TextInput
                        style={{ width: '65%' }}
                        placeholder="手机号"
                        maxLength={11}
                        onChangeText={text => this.userPhone(text)}
                        value={userPhone} />
                    {telNone ? <Text style={{ color: 'red' }}>请正确输入</Text> : null}
                </View>
                {/* 密码输入框 */}
                <TextInput
                    secureTextEntry={true}
                    maxLength={16}
                    style={styles.textInput}
                    placeholder="密码"
                    onChangeText={text => this.userPass(text)}
                    value={userPass} />
                {/* 登陆的方式默认为密码登录 */}
                <Modal
                    isVisible={promptModal}
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
                    {/* 验证码登录 */}
                    <Text onPress={this.toAuthCodeLogin}>验证码登录</Text>
                    {/* 忘记密码的操作 */}
                    <Text onPress={this.toFindPassword}>忘记密码</Text>
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
            </>
        )
    }
}

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type
    }
}
// 保存个人信息到redux
function mapDispatchToProps(dispatch) {
    return {
        getPersonInfo: (personInfo) => dispatch(personInfoAction(personInfo))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PasswordLogin)

const styles = StyleSheet.create({
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
        width: '40%',
        justifyContent: 'center',
        backgroundColor: '#1195E3',
        // backgroundColor:'pink',
        marginTop: 40,
        marginTop: 40,
        height: 40,
        alignItems: 'center',
        borderRadius: 8
    },
    register: {
        width: '40%',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 40,
        borderWidth: 1,
        height: 40,
        alignItems: 'center'
    },
    regiBtn: {
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white'
    }
})