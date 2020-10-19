import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

class MoneyRecord extends Component {
    state = {
        recordList: [],
        data: [],
        initNo: ''
    }
    // 挂载完毕获取数据
    componentDidMount() {
        this.setState({
            initNo: 2
        }, () => {
            this.showRecord(this.state.initNo)
        })
    }
    showRecord = (n) => {

        const { recordList, initNo } = this.state
        this.setState({
            initNo: n
        }, () => {
            axios({
                url:'/api/userStages/myWithdrawal',
                method:'POST',
                data: {
                    enterId: this.props.uid,
                    limit: n,
                    offset: 1
                }
            })
            .then(res => {
                console.log(res.data.data.info.list)
                let data = res.data.data.info.list.slice(0, initNo)
                this.setState({
                    data: data
                })
            })
            .catch(err => {
                console.log(err)
            })
        })
        
    }
    showMore = () => {
        this.showRecord(this.state.initNo + 1)
    }
    toback = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { initNo, recordList } = this.state
        let data = recordList.slice(0, initNo)
        let recordDom = data.map(item => {
            return (
                <View key={item.id} style={styles.recordItem}>
                    <Text style={{ width: '25%', textAlign: 'center' }}>{item.amount}</Text>
                    <Text style={{ width: '50%', textAlign: 'center' }}>{item.record}</Text>
                    <Text style={{ width: '25%', textAlign: 'center' }}>{item.time}</Text>
                </View>
            )
        })
        return (
            <ScrollView contentContainerStyle={{ backgroundColor: '#F4F6F8', flexGrow: 1, alignItems: 'center' }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={this.toback} style={{ width: 50, height: 50 }}>
                        <Feather name="chevron-left" size={24} style={{ fontSize: 20, color: 'white', margin: 15 }} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>
                        {this.props.route.params.record === 'tixian'
                            ? '提现记录'
                            : '充值记录'}
                    </Text>
                    <View style={{ width: 40 }}></View>
                </View>
                <View style={styles.mingxiTop}>
                    <Text style={{ width: '25%', textAlign: 'center' }}>金额</Text>
                    <Text style={{ width: '50%', textAlign: 'center' }}>明细</Text>
                    <Text style={{ width: '25%', textAlign: 'center' }}>时间</Text>
                </View>
                <View style={styles.recordBox}>
                    {recordDom}
                </View>
                <View style={{ width: '100%', height: 50, backgroundColor: 'white' }}>
                    <TouchableOpacity style={{ width: '100%', height: '100%' }} onPress={this.showMore}>
                        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text>查看更多</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        backgroundColor: '#1295E4',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 30,
    },
    mingxiTop: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        justifyContent: 'space-evenly',
        borderColor: '#ccc'
    },
    recordBox: {
        width: '100%',
        backgroundColor: 'white'
    },
    recordItem: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center'
    }
})

function mapStateToProps(state) {
    return {
        uid: state.userReducer.uid,
    }
}
export default connect(mapStateToProps)(MoneyRecord)