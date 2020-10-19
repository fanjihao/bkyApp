// 对 axios 的二次封装
// 导入axios
import axios from 'axios';
import * as RootNavigation from '../router/RootNavigation';

// 创建一个新的 axios 实例
var http = axios.create({
    // baseURL: 'http://192.168.3.98:8009', // 请求地址前缀
    baseURL: 'http://47.108.174.202:8009', // 请求地址前缀

    // timeout: 6000 // 请求超时
})

// 请求拦截（在请求发出去之前拦截），给所有的请求都带上 token
http.interceptors.request.use(

    async config => {
        await storage.load({ key: 'token' })
            .then(ret => {
                // console.log('axios获取token',ret)
                // 设置 token ，一般是在 headers 里加入 Authorization，并加上 Bearer 标注
                // 最好通过此种形式设置 request.headers['Authorization']
                config.headers['token'] = ret;
            })
            .catch(err => {
                console.log('token获取失败', err)
            })
        return config;
    },
    error => {
        console.log('请求拦截失败', error);
        return Promise.reject(error);
    });

// 拦截响应，遇到 token 不合法则报错
http.interceptors.response.use(
    response => {
        // console.log('响应的数据',response)
        // 将返回的最新的 token 保存
        if (response.data.token) {
            console.log('token验证成功', response.data.token)
            // storage.save({
            //     key: 'token',
            //     data: response.data.token
            // })
        }
        if (response.data.status === 401) {
            console.log('token验证失败', response)
            RootNavigation.navigate('Login')
        }
        return response;
    },
    error => {
        console.log('响应错误', error)
        if (error.response.status === 401) {
            // 401 说明 token 验证失败
            storage.remove({ key: 'token' })
            storage.remove({ key: 'userInfo' })
            storage.remove({ key: 'agentLevel' })
            RootNavigation.navigate('Login')
            console.log('401', error.response.data.error.message);

        } else if (error.response.status === 500) {
            // 服务器错误
            return Promise.reject('服务器出错：', error.response.data);
        }
        return Promise.reject(error.response.data);   // 返回接口返回的错误信息
    });

export default http;