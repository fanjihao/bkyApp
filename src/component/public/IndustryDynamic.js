import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';
import Feather from 'react-native-vector-icons/Feather';

export default class IndustryDynamic extends Component {
    state = {
        carouselList: [],
        newsList: null
    }
    // 挂载完毕获取数据
    componentDidMount() {
        this.getHome()
        this.getNewsList()
    }
    // 首页幻灯片
    getHome = () => {
        axios({
            url: '/api/index',
            method: 'GET'
        })
            .then(res => {
                // console.log('轮播图', res)
                this.setState({
                    carouselList: res.data.data.banner,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    // 新闻列表
    getNewsList = () => {
        fetch(`http://47.108.174.202:9010/news/listNews?limit=${10}&offset=${1}`)
            .then(response => response.json())
            .then(resJSON => {
                console.log('新闻', resJSON.data)
                this.setState({
                    newsList: resJSON.data.list
                })
            })
    }
    // 返回上一级
    back = () => {
        this.props.navigation.goBack()
    }
    // 新闻详情
    toNewsDetail = data => {
        this.props.navigation.navigate('NewsDetail', { newsData: data })
    }
    render() {
        const { carouselList, newsList } = this.state
        const indexImgDom = carouselList.map(item => <Image source={{ uri: item.pic }} style={styles.image} key={item.id} />)
        return (
            <ScrollView contentContainerStyle={{ paddingTop: 30 }}>
                <View style={{ backgroundColor: 'white', alignItems: 'center' }}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>行业动态</Text>
                        <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                    </View>
                    <View style={{ width: '94%', alignItems: 'center', justifyContent: 'flex-start', borderRadius: 10, overflow: 'hidden' }}>
                        <Swiper
                            horizontal={true}           // 水平轮播
                            showsPagination={true}     // 控制小圆点的显示
                            showsButtons={false}        // 控制左右箭头按钮显示
                            autoplay={true}             // 自动轮播
                            index={0}                   // 初始图片的索引号
                            loop={true}                 // 循环轮播
                            style={{ height: 150 }}
                            dotStyle={{ backgroundColor: 'white' }}
                            activeDot={<View style={{ backgroundColor: 'yellow', width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3 }} />}
                        >
                            {indexImgDom}
                        </Swiper>
                    </View>

                    <View style={styles.List}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>热点推荐</Text>
                        <View style={styles.DetailList}>
                            {
                                newsList === null
                                    ? <Text>暂无数据</Text>
                                    : newsList.map(item => {
                                        return (
                                            <TouchableOpacity key={item.id} onPress={() => this.toNewsDetail(item)}>
                                                <ImageBackground source={{ uri: item.photo }} style={styles.hotPic}>
                                                    <View style={styles.mask}>
                                                        <Text style={styles.maskText}>{item.title}</Text>
                                                        <Text style={styles.maskText}>
                                                            {
                                                                item.createTime.split('T')[0] + ' ' + item.createTime.split('T')[1].split('.')[0]
                                                            }
                                                        </Text>
                                                    </View>
                                                </ImageBackground>
                                            </TouchableOpacity>
                                        )
                                    })
                            }
                        </View>
                    </View>

                    <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 20 }}>没有更多了！</Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    List: {
        width: '100%',
        padding: 10
    },
    DetailList: {
        marginTop: 10
    },
    hotItem: {
        width: '100%'
    },
    hotPic: {
        width: '100%',
        height: 150,
        position: 'relative',
        marginBottom: 20
    },
    mask: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 30,
        backgroundColor: '#0000007F',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    maskText: {
        color: 'white'
    },
    content: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: 200,
        marginTop: 5,
        marginBottom: 5
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
        fontWeight: 'bold'
    },
    headerLeft: {
        position: 'absolute',
        left: 20,
    }
})