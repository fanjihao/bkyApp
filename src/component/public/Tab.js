import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from '../../pages/Home';
import Channel from '../../pages/Channel';
import ShoppingCart from '../../pages/ShoppingCart';
import Mine from '../../pages/Mine';
import { connect } from 'react-redux';

//配置底部Tab导航
const Tabs = createBottomTabNavigator();

const Tab = (props) => {
  const type = props.type
  return (
    <Tabs.Navigator
      initialRouteName={'Home'}
      tabBarOptions={{
        activeTintColor: '#0897FF',
        inactiveTintColor: '#6F6F6F',
        labelStyle: {
          marginBottom: 5
        }
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'md-home'
          } else if (route.name === 'Channel') {
            if (focused) return <Image style={{ width: 25, height: 25 }} source={require('../../assets/img/channel/channel2.jpg')}></Image>
            return <Image style={{ width: 25, height: 25 }} source={require('../../assets/img/channel/channel1.jpg')}></Image>
          } else if (route.name === 'ShoppingCart') {
            iconName = 'cart'
          } else if (route.name === 'Mine') {
            iconName = 'people'
          }
          return <Ionicons name={iconName} size={24} color={focused ? '#0897FF' : '#6F6F6F'} />
        }
      })}
    >
      <Tabs.Screen name="Home" options={{ tabBarLabel: '首页' }}>
        {props => <Home {...props} />}
      </Tabs.Screen>

      {type === 1
        ? <Tabs.Screen name="Channel" options={{ tabBarLabel: '渠道商' }}>
          {props => <Channel {...props} />}
        </Tabs.Screen>
        : null}

      <Tabs.Screen name="ShoppingCart" options={{ tabBarLabel: '购物车', tabBarBadge: null }}>
        {props => <ShoppingCart {...props} />}
      </Tabs.Screen>

      <Tabs.Screen name="Mine" options={{ tabBarLabel: '个人中心' }}>
        {props => <Mine {...props} />}
      </Tabs.Screen>
    </Tabs.Navigator>
  )
}

function mapStateToProps(state) {
  return {
    type: state.loginReducer.type
  }
}

export default connect(mapStateToProps)(Tab)