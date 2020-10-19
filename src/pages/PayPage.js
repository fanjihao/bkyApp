import React, { Component } from 'react';
import { SafeAreaView, Linking } from 'react-native';
import { WebView } from 'react-native-webview';



/**
 * APP端注入JS脚本到H5端，供H5页面调用。
 * @type {string}
 */
const H5AppBridge = `
    window.H5AppBridge={
        sayHello:function(data){
            let objData = {};
            // 声明事件类型。
            objData.type='sayHello';
            objData.data = data;
            // 这里注意要把data转化为JSON字符串，postMessage()只接受字符串参数。
            window.ReactNativeWebView.postMessage(JSON.stringify(objData));
        }
    };   
    true;
`;

class PayPage extends Component {
    state = {
        dom: ''
    }
    componentDidMount() {
        this.setState({
            dom: this.props.route.params.dom
        })
    }
    onShouldStartLoadWithRequest = (event) => {
        let reqUrl = event.url;
        console.log('url=======', reqUrl)
        // if (reqUrl.indexOf("https://mclient.alipay.com") > -1 || reqUrl.indexOf("alipays://alipayclient") > -1) {
        //     let strUrl = reqUrl.replace("http:", "baidu.com");
        //     Linking.openURL(strUrl);
        //     return false; //这一行是新加入了，必须加，如果不加，就返回不了app
        // }
        return true; //这一行是新加入了，必须加，如果不加，就返回不了app
    }
    render() {
        const html = `
                <html>
                <head></head>
                <style>
                </style>
                <body>
                ${this.state.dom}
                </body>
                </html>
                `;
        return (
            <SafeAreaView style={{ flex: 1, }}>
                <WebView
                    ref={'webview_ref'}
                    source={{ html: html }}
                    domStorageEnabled={true}
                    scrollEnabled={true}
                    javaScriptEnabled={true}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                />
            </SafeAreaView>
        );
    }
}
export default PayPage