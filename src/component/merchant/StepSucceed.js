import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

class StepSucceed extends Component {

    toLogin = () => {
        this.props.navigation.navigate('Login')
    }

    toHome = () => {
        this.props.navigation.navigate('Tab')
    }

    render() {

        const { type } = this.props
        return (
            <View style={{ flex: 1, backgroundColor: 'white',justifyContent:'space-between' }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>提交成功(3/3)</Text>
                </View>

                <View style={styles.content}>
                    <Image source={require('../../assets/img/succeed.png')} style={{ }} />
                    <Text style={{ color: '#329DE5', fontSize: 20, margin: 20 }}>本次操作成功！</Text>
                    <Text style={styles.account}>您的资料已经成功提交</Text>
                    <Text style={styles.account}>我们会在2个工作日之内审核</Text>
                    <Text style={styles.account}>尽快给您答复</Text>
                    <Text style={[styles.account]}>请耐心等待</Text>
                </View>

                <TouchableOpacity style={styles.next} onPress={type === 1 ? this.toHome : this.toLogin}>
                    <Text style={{ color: 'white' }}>完成</Text>
                </TouchableOpacity>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    next: {
        margin: 40,
        height: 50,
        backgroundColor: '#1195E3',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    content: {
        alignItems: 'center',
    },
    account: {
        color: '#999999'
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
        type: state.loginReducer.type
    }
}

export default connect(mapStateToProps)(StepSucceed)