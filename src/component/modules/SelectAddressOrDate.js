/*该组件只能在 react-native中使用
 * 先安装 yarn add  react-native-picker 
 * 然后 链接 react-native link react-native-picker
 * cback -- 选择后的回调方法 返回值
 * type -- 组件类型 看 componentWillMount() 方法定义
 * 还可以定义其他的，自己传数据，需要进行扩展，但是有缺陷，就是 只能按照这种格式，去到的值也是文字，而不能是id，
 * 如果后端需要id就不能用这个组件
 * */
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';
import Picker from 'react-native-picker';
class SelectAddressOrDate extends Component {
    static defaultProps = {
        // 默认显示北京(省)
        selectedProvince: '北京',
        // 默认显示北京省会市)
        selectedCity: '北京',
        // 默认显示(区)
        selectedArea: '东城区'
    }
    state = {
        val: this.props.title,
        data: [],
    }
    //组件渲染后
    componentDidMount() {
    }
    //组件销毁
    componentWillUnmount() {
        Picker.hide();
    }
    pickerType = () => {
        //根据类型判断 要显示的 组件数据
        switch (this.props.type) {
            case 'time'://时间
                this.time();
                break;
            case 'date'://日期
                this.dates();
                break;
            case 'dateMonth'://日期选择年月份
                this.dateMonth();
                break;
            case 'dateYear'://日期选择年份份
                this.dateYear();
                break;
            case 'provincialUrbanArea'://省市区
                this.provincialUrbanArea();
                break;
            case 'provincialUrban'://省市
                this.provincialUrban();
                break;
            case 'employee':
                this.employee();
                break;
        }
    }
    //时间
    time = () => {
        let date = new Date();
        let h = date.getHours();
        let m = date.getMinutes();
        let data = [
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            []
        ]
        for (let i = 0; i < 60; i++) {
            data[1].push(i);
        }
        this.pickerInit(data, [h, m], '时间选择');
    }
    //日期 - 天
    dates = () => {
        let date = new Date();
        let y = date.getFullYear();
        let m = String(date.getMonth() + 1);
        let d = String(date.getDate());
        let data = [];
        let year = null;
        let month = null;
        let maxY = y + 10;
        let minY = y - 10;
        for (let i = minY; i <= maxY; i++) {
            year = new Object();
            year[i] = [];
            for (let j = 1; j <= 12; j++) {
                month = new Object();
                month[j] = [];
                let monthDay = currentMonth(j, i);
                let day = [];
                for (let k = 1; k <= monthDay; k++) {
                    month[j].push(k);
                }
                year[i].push(month);
            }
            data.push(year);
        }
        this.pickerInit(data, [y, m, d], '日期选择');
    }
    // 员工-编号
    employee = () => {
        let data = []
        let no, name
        let list = [
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
        ]
        for (var i = 1; i < list.length + 1; i++) {
            let arr = []
            let str = list[i].no + ' ' + list[i].name
            arr.push(str)
            data.push(arr)
        }
        this.pickerInit(data, [no], '员工选择');
    }
    //日期 - 月份
    dateMonth = () => {
        let date = new Date();
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let maxY = y + 10;
        let minY = y - 10;
        let data = [
            [],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        ]
        for (let i = minY; i <= maxY; i++) {
            data[0].push(i);
        }
        this.pickerInit(data, [y, m], '年月选择');
    }
    //日期 - 年份
    dateYear = () => {
        let y = new Date().getFullYear();
        let maxY = y + 10;
        let minY = y - 10;
        let data = []
        for (let i = minY; i <= maxY; i++) {
            data.push(i);
        }
        this.setState({
            data: data
        }, function () {
            this.pickerInit([y], '年份选择');
        }.bind(this));

    }
    //省市区
    provincialUrbanArea = () => {
        let jsonData = require('../../assets/area.json');
        let data = [];
        for (let i in jsonData) {
            let obj = new Object();
            obj[i] = jsonData[i];
            data.push(obj);
        }
        this.pickerInit(data, ['北京', '北京', '东城区'], '省市区');
    }
    //省市
    provincialUrban = () => {
        let jsonData = require('../../assets/area.json');
        let data = [];
        for (let i in jsonData) {
            let obj = new Object();
            let arr = jsonData[i];
            for (let j in arr) {
                obj[i] = [];
                for (let k in arr[j]) {
                    obj[i].push(k);
                }
            }
            data.push(obj);
        }
        this.pickerInit(data, ['北京', '北京'], '省市');
    }
    //显示Picker组件
    onPresss = () => {
        this.pickerType(this.props.type);
    }
    render() {
        return (
            <TouchableHighlight
                underlayColor="#f1f1f1"
                style={styles.picker}
                onPress={this.onPresss}
            >
                <Text style={styles.txt}>
                    {this.state.val}
                </Text>
            </TouchableHighlight>
        );
    }
    //组件初始化
    pickerInit = (data, selectedValue, title) => {
        Picker.init({
            pickerData: data,
            selectedValue: selectedValue,
            pickerTitleText: title,
            pickerConfirmBtnText: '确定',
            pickerCancelBtnText: '取消',
            //确定
            onPickerConfirm: data => {
                switch (this.props.type) {
                    case 'time'://时间
                        data = data.join(':');
                        break;
                    case 'date'://日期
                        data = data.join('-');
                        break;
                    case 'dateMonth'://日期选择年月份
                        data = data.join('-');
                        break;
                    case 'dateYear'://日期选择年份
                        this.dateYear();
                        break;
                    case 'employee':
                        data = data.join(':');
                        break;
                    case 'provincialUrbanArea'://省市区
                        data = data.join(' ');
                        break;
                    case 'provincialUrban'://省市
                        data = data.join(' ');
                        break;
                }
                this.setState({
                    val: data
                });
                this.props.cback(data);
            },
            //取消
            onPickerCancel: data => {
                console.log(data);
            },
            //选择
            onPickerSelect: data => {
                console.log(data);
            }
        });
        // _Picker = Picker;
        Picker.show();
    }
}
const styles = StyleSheet.create({
    picker: {
        height: 40,
        paddingLeft: 15,
        borderRadius: 3,
        borderColor: '#ccc'
    },
    txt: {
        flex: 1,
        lineHeight: 38,
        textAlign: 'center',
        color: 'black',
        fontSize: 15,
    }
});
//计算当月天数
currentMonth = (m, y) => {
    var monthDay = 0;
    switch (m) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12: monthDay = 31; break;
        case 4:
        case 6:
        case 9:
        case 11: monthDay = 30; break;
        case 2:
            if (y % 4 == 0 && y % 100 != 0 || y % 400 == 0) {
                monthDay = 29;

            } else {
                monthDay = 28;
            }
    }
    return monthDay;
}
export default SelectAddressOrDate;