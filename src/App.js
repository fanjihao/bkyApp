import React, { Component } from 'react';
// 导航器容器
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './router/RootNavigation';
import * as RootNavigation from './router/RootNavigation';
// 堆栈导航
import { createStackNavigator } from '@react-navigation/stack';
// 底部tab导航
import Tab from './component/public/Tab';
// 本地存储
import storage from './storage/storage';
// axios请求
import axios from './http/index'
// 配置redux
import { connect } from 'react-redux';
import { getGeoLocationAction, toUserAction, toMerchantAction } from './store/login/loginActions';
import { personInfoAction } from './store/user/userActions';
// 配置APP启动页
import SplashScreen from 'react-native-splash-screen';
// 防抖
import debounce from './utils/debounce';
// 获取当前用户经纬度
import Geolocation from '@react-native-community/geolocation'

// 堆栈组件
import Login from './pages/Login';
import IndustryDynamic from './component/public/IndustryDynamic';
import MerChantManagement from './component/merchant/MerchantManagement';
import OrderInfo from './component/orderManagement/OrderInfo';
import IntegralMall from './component/intergral/IntegralMall';
import IntegralSignIn from './component/intergral/IntegralSignIn';
import IntegralGoodsDetail from './component/changeStep/IntegralGoodsDetail';
import SearchStore from './component/public/SearchStore';
import StoreDetail from './component/public/StoreDetail';
import SureExchange from './component/changeStep/SureExchange';
import ExchangeSuccess from './component/changeStep/ExchangeSuccess';
import MyAddress from './component/user/MyAddress';
import NewAddress from './component/user/NewAddress';
import JoinStore from './component/joinStoreGoods/JoinStore';
import MyStage from './component/userStage/MyStage';
import AccountManagement from './component/accountManagemeng/AccountManagement';
import AddBankCard from './component/accountManagemeng/AddBankCard';
import BankCard from './component/accountManagemeng/BankCard';
import MyPromote from './component/user/MyPromote';
import PromoteCard from './component/user/PromoteCard';
import StageManage from './component/merchantStage/StageManage'
import UserStageDetail from './component/userStage/UserStageDetail';
import UserRefund from './component/userStage/UserRefund';
import SelectEmploy from './component/modules/SelectEmploy';
import Register from './component/login/Register';
import FirstStep from './component/merchant/FirstStep';
import SecondStep from './component/merchant/SecondStep';
import StepSucceed from './component/merchant/StepSucceed';
import Balance from './component/money/Balance';
import WithDrawal from './component/money/WithDrawal';
import TopUp from './component/money/TopUp';
import MoneyRecord from './component/money/MoneyRecord';
import PayPage from './pages/PayPage';
import ShoppingOrder from './component/orderManagement/ShoppingOrder';
import JoinStoreGoodsDetail from './component/joinStoreGoods/JoinStoreGoodsDetail';
import AfterSale from './component/orderManagement/AfterSale';
import OrderDetail from './component/orderManagement/OrderDetail';
import Evaluation from './component/orderManagement/Evaluation';
import StageGoodsDetail from './component/userStage/StageGoodsDetail';
import OnlineGoodsDetail from './component/userStage/OnlineGoodsDetail';
import StageOrder from './component/userStage/StageOrder';
import AlreadyPay from './component/userStage/AlreadyPay';
import EditBankCard from './component/accountManagemeng/EditBankCard';
import NewsDetail from './component/public/NewsDetail';
import UserAgree from './component/accountManagemeng/UserAgree';

// 扫描二维码
import Scan from './component/camera/Scan';
import { PermissionsAndroid, Platform } from 'react-native';

// 定义一个全局对象storage
globalThis.storage = storage

// 配置axios到全局
globalThis.axios = axios

// 配置堆栈导航
const Stacks = createStackNavigator();

// 配置全局防抖
globalThis.debounce = debounce


class App extends Component {
	state = {
		initRoute: 'Login'
	}

	// 获取当前地理位置
	handleGetLocation = () => {
		this.setState({ loading: true })
		Geolocation.getCurrentPosition(
			position => {
				const { longitude } = position.coords
				const { latitude } = position.coords
				fetch(`http://restapi.amap.com/v3/geocode/regeo?key=49afbbb5e42e0409f9d35d1cc74a526a&location=${longitude},${latitude}&radius=1000&extensions=all&batch=false&roadlevel=0`, {
					method: 'POST',
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: ``
				})
					.then(response => response.json())
					.then(jsonData => {
						try {
							let data = jsonData.regeocode.addressComponent.city
							storage.save({
								key: 'cityPosition',
								data: data
							})
							this.setState({ loading: false })
						} catch (e) {
						}
					})
					.catch(err => {
						console.log('逆地理编码获取失败', err)
					})
			},
			error => {
				console.log('获取经纬度失败', error)
			},
			{
				enableHighAccuracy: true,
				timeout: 15000,
				maximumAge: 10000
			}
		)
	}

	componentDidMount() {

		// 获取权限
		async function requestPermission() {
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
				)
				const granted1 = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.CAMERA
				)
				const granted2 = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
				)
			} catch (err) {
				console.warn('错误警告', err)
			}
		}
		// 判断环境
		if (Platform.OS === 'android') {
			console.log('安卓包', Platform.OS)
			requestPermission()
		} else {
			console.log('ios包')
		}

		// 测试免登录
		storage.getBatchData([
			{ key: 'token' },
			{ key: 'userInfo' }
		])
			.then(results => {
				console.log('本地存储的数据', results)
				let accountNumber = results[1].account
				let password = results[1].password
				let type = results[1].type
				if (type === 1) {
					this.props.toUser()
				} else {
					this.props.toMerchant()
				}
				axios({
					method: 'POST',
					url: '/api/appLogin/merchantLogin',
					data: {
						accountNumber,
						password,
						type: this.props.type
					}
				})
					.then(res => {
						console.log('0000000')
						if (res.data.status === 200) {
							console.log('登陆成功', res.data.data)
							this.props.getPersonInfo(res.data.data)
							setTimeout(() => {
								storage.save({
									key: 'token',
									data: res.data.token
								})
								RootNavigation.reset()
								setTimeout(() => {
									// 启动页隐藏
									SplashScreen.hide()
								}, 1000)
							}, 1000)
						} else {
							SplashScreen.hide()
						}
					})
					.catch(err => {
						console.log('登录失败', err)
						SplashScreen.hide()
					})
			})
			.catch(err => {
				// 启动页隐藏
				console.log('加载本地数据失败', err)
				SplashScreen.hide()
			})
	}
	// 启动开启定位

	render() {
		return (
			<NavigationContainer ref={navigationRef}>
				<Stacks.Navigator screenOptions={{ headerShown: false }}>

					{/* 登录 */}
					<Stacks.Screen name="Login">
						{props => <Login {...props} />}
					</Stacks.Screen>
					{/* 底部导航菜单 */}
					<Stacks.Screen name="Tab" component={Tab} />
					{/* 注册 */}
					<Stacks.Screen name="Register">
						{props => <Register {...props} />}
					</Stacks.Screen>
					{/* 行业动态 */}
					<Stacks.Screen name="IndustryDynamic">
						{props => <IndustryDynamic {...props} />}
					</Stacks.Screen>
					{/* 新闻详情 */}
					<Stacks.Screen name="NewsDetail">
						{props => <NewsDetail {...props} />}
					</Stacks.Screen>
					{/* 商户注册第一步 */}
					<Stacks.Screen name="FirstStep">
						{props => <FirstStep {...props} />}
					</Stacks.Screen>
					{/* 商户注册第二步 */}
					<Stacks.Screen name="SecondStep">
						{props => <SecondStep {...props} />}
					</Stacks.Screen>
					{/* 商户注册第三步 */}
					<Stacks.Screen name="StepSucceed">
						{props => <StepSucceed {...props} />}
					</Stacks.Screen>

					{/* 商户管理 */}
					<Stacks.Screen name="MerchantManagement">
						{props => <MerChantManagement {...props} />}
					</Stacks.Screen>
					{/* 订单信息 */}
					<Stacks.Screen name="OrderInfo">
						{props => <OrderInfo {...props} />}
					</Stacks.Screen>
					{/* 订单详情 */}
					<Stacks.Screen name="OrderDetail">
						{props => <OrderDetail {...props} />}
					</Stacks.Screen>
					{/* 门店服务 */}
					<Stacks.Screen name="SearchStore">
						{props => <SearchStore {...props} />}
					</Stacks.Screen>
					{/* 我的收货地址 */}
					<Stacks.Screen name="MyAddress">
						{props => <MyAddress {...props} />}
					</Stacks.Screen>
					{/* 新增收货地址 */}
					<Stacks.Screen name="NewAddress" initialParams={{ isEdit: false }}>
						{props => <NewAddress {...props} />}
					</Stacks.Screen>
					{/* 门店详情 */}
					<Stacks.Screen name="StoreDetail">
						{props => <StoreDetail {...props} />}
					</Stacks.Screen>
					{/* 推广名片 */}
					<Stacks.Screen name="PromoteCard">
						{props => <PromoteCard {...props} />}
					</Stacks.Screen>
					{/* 加盟商专区 */}
					<Stacks.Screen name="JoinStore">
						{props => <JoinStore {...props} />}
					</Stacks.Screen>
					{/* 管理我的账号 */}
					<Stacks.Screen name="AccountManagement">
						{props => <AccountManagement {...props} />}
					</Stacks.Screen>
					{/* 添加银行卡 */}
					<Stacks.Screen name="AddBankCard">
						{props => <AddBankCard {...props} />}
					</Stacks.Screen>
					{/* 我的银行卡 */}
					<Stacks.Screen name="BankCard">
						{props => <BankCard {...props} />}
					</Stacks.Screen>
					{/* 修改银行卡 */}
					<Stacks.Screen name="EditBankCard">
						{props => <EditBankCard {...props} />}
					</Stacks.Screen>
					{/* 选择器-选择员工 */}
					<Stacks.Screen name="SelectEmploy">
						{props => <SelectEmploy {...props} />}
					</Stacks.Screen>
					{/* 用户我的分期 */}
					<Stacks.Screen name="MyStage">
						{props => <MyStage {...props} />}
					</Stacks.Screen>
					{/* 用户分期详情 */}
					<Stacks.Screen name="UserStageDetail">
						{props => <UserStageDetail {...props} />}
					</Stacks.Screen>
					{/* 用户还款 */}
					<Stacks.Screen name="UserRefund">
						{props => <UserRefund {...props} />}
					</Stacks.Screen>
					{/* 用户已还款 */}
					<Stacks.Screen name="AlreadyPay">
						{props => <AlreadyPay {...props} />}
					</Stacks.Screen>
					{/* 扫描二维码 */}
					<Stacks.Screen name="Scan">
						{props => <Scan {...props} />}
					</Stacks.Screen>
					{/* 加盟商商品详情 */}
					<Stacks.Screen name="JoinStoreGoodsDetail">
						{props => <JoinStoreGoodsDetail {...props} />}
					</Stacks.Screen>
					{/* 售后中心 */}
					<Stacks.Screen name="AfterSale">
						{props => <AfterSale {...props} />}
					</Stacks.Screen>
					{/* 用户协议与隐私政策 */}
					<Stacks.Screen name="UserAgree">
						{props => <UserAgree {...props} />}
					</Stacks.Screen>



					{/* 积分商城 */}
					<Stacks.Screen name="IntegralMall">
						{props => <IntegralMall {...props} />}
					</Stacks.Screen>
					{/* 积分签到 */}
					<Stacks.Screen name="IntegralSignIn">
						{props => <IntegralSignIn {...props} />}
					</Stacks.Screen>
					{/* 积分商品详情 */}
					<Stacks.Screen name="IntegralGoodsDetail" initialParams={{ goodsid: '你没传' }}>
						{props => <IntegralGoodsDetail {...props} />}
					</Stacks.Screen>
					{/* 积分确认兑换 */}
					<Stacks.Screen name="SureExchange" initialParams={{ goodsid: '你没传' }}>
						{props => <SureExchange {...props} />}
					</Stacks.Screen>
					{/* 积分兑换成功 */}
					<Stacks.Screen name="ExchangeSuccess" initialParams={{ goodsid: '你没传' }}>
						{props => <ExchangeSuccess {...props} />}
					</Stacks.Screen>



					{/* 余额 */}
					<Stacks.Screen name="Balance">
						{props => <Balance {...props} />}
					</Stacks.Screen>
					{/* 提现 */}
					<Stacks.Screen name="WithDrawal">
						{props => <WithDrawal {...props} />}
					</Stacks.Screen>
					{/* 充值 */}
					<Stacks.Screen name="TopUp">
						{props => <TopUp {...props} />}
					</Stacks.Screen>
					{/* 我的推广 */}
					<Stacks.Screen name="MyPromote">
						{props => <MyPromote {...props} />}
					</Stacks.Screen>
					{/* 提现记录 */}
					<Stacks.Screen name="MoneyRecord">
						{props => <MoneyRecord {...props} />}
					</Stacks.Screen>
					{/* 支付宝h5页面 */}
					<Stacks.Screen name="PayPage">
						{props => <PayPage {...props} />}
					</Stacks.Screen>
					{/* 确认支付订单 */}
					<Stacks.Screen name="ShoppingOrder">
						{props => <ShoppingOrder {...props} />}
					</Stacks.Screen>
					{/* 商家分期项目详情 */}
					<Stacks.Screen name="StageGoodsDetail">
						{props => <StageGoodsDetail {...props} />}
					</Stacks.Screen>
					{/* 线上商品详情*/}
					<Stacks.Screen name="OnlineGoodsDetail">
						{props => <OnlineGoodsDetail {...props} />}
					</Stacks.Screen>
					{/* 门店分期 */}
					<Stacks.Screen name="StageManage">
						{props => <StageManage {...props} />}
					</Stacks.Screen>
					{/* 用户提交分期订单 */}
					<Stacks.Screen name="StageOrder">
						{props => <StageOrder {...props} />}
					</Stacks.Screen>
					{/* 评价 */}
					<Stacks.Screen name="Evaluation">
						{props => <Evaluation {...props} />}
					</Stacks.Screen>
				</Stacks.Navigator>
			</NavigationContainer>
		)
	}
}

function mapStateToProps(state) {
	return {
		type: state.loginReducer.type
	}
}
function mapDispatchToProps(dispatch) {
	return {
		getGeoLocation: (data) => dispatch(getGeoLocationAction(data)),
		getPersonInfo: (personInfo) => dispatch(personInfoAction(personInfo)),
		toUser: () => dispatch(toUserAction()),
		toMerchant: () => dispatch(toMerchantAction())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)