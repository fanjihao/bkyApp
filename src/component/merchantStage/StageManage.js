import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Modal from 'react-native-modal';
import Picker from 'react-native-picker';
import { connect } from 'react-redux';

class StageManage extends Component {
    state = {
        status: 1,
        showModal: false,
        stageList: [
            {
                id: 1,
                stageStore: '十七养生美疗美来1号店',
                state: 1,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '',
                howlong: '刚刚'
            },
            {
                id: 5,
                stageStore: '十七养生美疗美来1号店',
                state: 1,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '',
                howlong: '刚刚'
            },
            {
                id: 7,
                stageStore: '十七养生美疗美来1号店',
                state: 1,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '',
                howlong: '刚刚'
            },
            {
                id: 2,
                stageStore: '十七养生美疗美来2号店',
                state: 2,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '0522',
                howlong: '一月前',
                shengyuqi: 2
            },
            {
                id: 8,
                stageStore: '十七养生美疗美来2号店',
                state: 2,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '0522',
                howlong: '一月前',
                shengyuqi: 2
            },
            {
                id: 10,
                stageStore: '十七养生美疗美来2号店',
                state: 2,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '0522',
                howlong: '一月前',
                shengyuqi: 2
            },
            {
                id: 3,
                stageStore: '十七养生美疗美来3号店',
                state: 3,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '2322',
                howlong: '一周前'
            },
            {
                id: 9,
                stageStore: '十七养生美疗美来3号店',
                state: 3,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '2322',
                howlong: '一周前'
            },
            {
                id: 11,
                stageStore: '十七养生美疗美来3号店',
                state: 3,
                finishStage: '2020-02-20 20:30:12',
                time: '1598344304308',
                emply: '2322',
                howlong: '一周前'
            },
        ],
        data: [],
        list: [
            {
                id: 1,
                no: '0221',
                name: '刘晓晓'
            },
            {
                id: 2,
                no: '0222',
                name: '张三'
            },
            {
                id: 3,
                no: '0223',
                name: '五五'
            },
            {
                id: 4,
                no: '0224',
                name: '李四'
            },
        ],
        employModal: false,
        pickerEmploy: [],
    }
    componentDidMount() {
        this.getStage(4)
        this.getEmploy()
    }
    getEmploy = () => {
        axios({
            url: '/api/userStages/listStoreStaff',
            method: 'POST',
        })
            .then(res => {
                console.log('门店员工', res.data.data)
                let pickerEmploy = res.data.data.map(item => {
                    return 'NO:' + item.id + '——' + item.staffName
                })
                this.setState({
                    pickerEmploy
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    getStage = (i) => {
        this.setState({
            status: i
        })
        // axios({
        //     url: '/api/userStages/merchantStagesDetails',
        //     method: 'POST',
        //     data: {
        //         id: this.props.personInfo.id,
        //         limit: 10,
        //         offset: 1,
        //         type: i
        //     }
        // })
        //     .then(res => {
        //         console.log('请求成功', res)
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
    }
    toAssociate = () => {
        this.fetchData()
    }
    fetchData = () => {
        this.setState({
            employModal: true
        }, () => {
            Picker.init({
                //数据源
                pickerData: this.state.pickerEmploy,
                pickerConfirmBtnText: '确定',
                pickerCancelBtnText: '取消',
                pickerTitleText: '选择关联员工',
                pickerToolBarFontSize: 18,
                pickerToolBarBg: [255, 255, 255, 1],
                pickerBg: [255, 255, 255, 1],
                pickerFontSize: 18,
                onPickerConfirm: (pickedValue) => {
                    console.log(pickedValue)
                    Picker.hide()
                    this.setState({
                        employModal: false,
                    })
                },
                onPickerCancel: () => {
                    Picker.hide()
                    this.setState({
                        employModal: false
                    })
                }
            })
            setTimeout(() => {
                Picker.show()
            }, 100)
            // Picker.show()
        })
    }
    hidePicker = () => {
        Picker.hide()
        this.setState({
            employModal: false
        })
    }
    componentWillUnmount() {
        Picker.hide()
    }
    render() {
        const { status, data, employModal } = this.state
        let newDom = data.map(item => {
            let insideDom, stateDom, detailStage, timeDom
            insideDom =
                <Text style={styles.stageItemTitle}>{item.emply}</Text>
            detailStage =
                <View style={styles.midDirect}>
                    <Text style={[styles.nameFont, { marginRight: 10 }]}>剩余{item.shengyuqi}期</Text>
                    <Text style={[styles.nameFont, { color: 'red' }]}>共￥320</Text>
                </View>
            timeDom = <Text style={{ color: '#999' }}>{item.howlong}</Text>

            if (item.state === 1) {
                insideDom =
                    <Text style={{ color: '#1195E3' }} onPress={this.toAssociate}>未关联</Text>
                stateDom = <Text style={styles.redState}>待付款</Text>
                detailStage =
                    <View style={styles.midDirect}>
                        <Text style={[styles.nameFont, { marginRight: 10 }]}>共一项分期，合计</Text>
                        <Text style={[styles.nameFont, { color: '#E90058', fontSize: 15 }]}>￥120*3期</Text>
                    </View>
            } else if (item.state === 2) {
                stateDom = <Text style={styles.redState}>分期中</Text>
            } else if (item.state === 3) {
                stateDom = <Text style={styles.stageItemTitle}>已完成</Text>
                detailStage =
                    <View style={styles.midDirect}>
                        <Text style={[styles.nameFont, { color: '#929292' }]}>已还清</Text>
                    </View>
                timeDom = <Text style={{ color: '#999' }}>{item.finishStage}</Text>
            } else {
                stateDom = <Text style={styles.redState}>逾期{item.yuqiTime}天</Text>
                timeDom = <Text style={{ color: '#999' }}>{item.finishStage}</Text>
            }
            return (
                <View key={item.id} style={{ width: '100%', paddingLeft: 15, paddingRight: 15, paddingTop:30 }}>
                    <View style={{ height: 50, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.stageItemTitle}>{item.stageStore}</Text>
                        <Text style={styles.stageItemTitle}>员工：
                            {insideDom}
                        </Text>
                    </View>
                    <View style={styles.stageListItemCon}>
                        <View style={styles.stageItemConTop}>
                            {timeDom}
                            {stateDom}
                        </View>
                        <View style={styles.itemMidInfo}>
                            <View style={styles.midInfoChild}>
                                <View style={styles.infoImgAndName}>
                                    <Image source={require('../../assets/img/goods/95xys1.jpg')} style={{ width: 60, height: 60 }} ></Image>
                                    <Text style={styles.nameFont}>浓香型白酒（洪）</Text>
                                </View>
                                <Text style={{ color: '#ccc' }}>￥395</Text>
                            </View>
                            {detailStage}
                        </View>
                        <View style={styles.itemFootBtn}>
                            <View style={styles.itemLookDe}>
                                <Text style={{ color: '#929292' }}>查看详情</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )
        })
        return (
            <View style={{ width: '100%', backgroundColor: '#F5F5F5', flex: 1 }}>
                <View style={styles.storeStageTop}>
                    <View style={styles.storeStageTab}>
                        <Text
                            style={[styles.TopTabItem, status === 4 ? styles.activeFont : null]}
                            onPress={() => this.getStage(4)}>待付款</Text>
                        <View style={
                            status === 4
                                ? styles.checkedUnderLine
                                : styles.noCheckedLine}></View>
                    </View>
                    <Modal
                        isVisible={employModal}
                        onBackdropPress={() => {
                            Picker.hide()
                            this.setState({
                                employModal: false
                            })
                        }}
                        backdropOpacity={0.2}
                        style={styles.modal}
                        animationInTiming={20}
                        animationOutTiming={20}>
                    </Modal>
                    <View style={styles.storeStageTab}>
                        <Text
                            style={[styles.TopTabItem, status === 1 ? styles.activeFont : null]}
                            onPress={() => this.getStage(1)}>分期中</Text>
                        <View style={
                            status === 1
                                ? styles.checkedUnderLine
                                : styles.noCheckedLine}></View>
                    </View>
                    <View style={styles.storeStageTab}>
                        <Text
                            style={[styles.TopTabItem, status === 2 ? styles.activeFont : null]}
                            onPress={() => this.getStage(2)}>已完成分期</Text>
                        <View style={
                            status === 2
                                ? styles.checkedUnderLine
                                : styles.noCheckedLine}></View>
                    </View>
                    <View style={styles.storeStageTab}>
                        <Text
                            style={[styles.TopTabItem, status === 3 ? styles.activeFont : null]}
                            onPress={() => this.getStage(3)}>异常分期</Text>
                        <View style={
                            status === 3
                                ? styles.checkedUnderLine
                                : styles.noCheckedLine}></View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}>
                    {newDom}
                </ScrollView>
                <View style={status === 3 ? styles.WarmPrompt : styles.noWarm}>
                    <Text style={{ color: '#929292' }}>温馨提示：</Text>
                    <Text style={{ color: 'red' }}>部分订单已逾期！
                        <Text style={{ color: '#929292' }}>请及时
                            <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>联系客户</Text>，尽快处理。</Text>
                    </Text>
                </View>
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        personInfo: state.userReducer.personInfo
    }
}

export default connect(mapStateToProps)(StageManage)

const styles = StyleSheet.create({
    storeStageTop: {
        width: '100%',
        height: 50,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end'
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end'
    },
    storeStageTab: {
        justifyContent: 'flex-end',
        height: '100%',
        alignItems: 'center'
    },
    TopTabItem: {
        color: '#929292',
        marginBottom: 10,
        borderWidth: 1
    },
    activeFont: {
        color: '#2A92CF'
    },
    checkedUnderLine: {
        width: 50,
        borderBottomWidth: 2,
        borderColor: '#2A92CF'
    },
    noCheckedLine: {
        width: 50,
        height: 2,
    },
    stageItemTitle: {
        color: '#666'
    },
    stageItemConTop: {
        width: '100%',
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    stageListItemCon: {
        width: '100%',
        height: 220,
        borderRadius: 5,
        backgroundColor: 'white'
    },
    itemMidInfo: {
        width: '100%',
        height: 120,
        borderColor: '#ccc',
        borderBottomWidth: 1,
        padding: 10,
        justifyContent: 'space-between'
    },
    midInfoChild: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoImgAndName: {
        width: '50%',
        height: '60%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    nameFont: {
        marginLeft: 10
    },
    midDirect: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row'
    },
    itemFootBtn: {
        width: '100%',
        height: 50,
        padding: 10,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    redState: {
        color: '#E90058'
    },
    itemLookDe: {
        width: 96,
        height: 36,
        borderWidth: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#999'
    },
    WarmPrompt: {
        // marginTop: -50,
        width: '100%',
        paddingLeft: 15,
        justifyContent: 'space-evenly',
        height: 60,
        backgroundColor: 'white',
        paddingRight: 15,
        borderTopWidth: 1,
        borderColor: '#ccc'
    },
    noWarm: {
        display: 'none'
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
    emplyGroup: {
        width: '100%',
        borderTopWidth: 1,
        borderColor: '#ccc',
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})