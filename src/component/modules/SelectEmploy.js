import React, { Component } from 'react';
import Picker from 'react-native-picker';
import { View } from 'react-native';

class SelectEmploy extends Component {
    state = {
        employList: []
    }
    componentDidMount() {

    }
    fetchData = () => {
        Picker.init({
            //数据源
            pickerData: ["我不想买了", "信息填写错误，重新拍", "卖家缺货", "其他原因",],
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
                this.props.navigation.push('StageManage')
            },
            onPickerCancel: () => {
                Picker.hide()
                this.props.navigation.push('StageManage')
            }
        })
        Picker.show()
    }
    componentDidMount() {
        this.fetchData()
    }
    componentWillUnmount() {
        Picker.hide()
    }
    render() {
        return (
            <View>

            </View>
        )
    }
}

export default SelectEmploy