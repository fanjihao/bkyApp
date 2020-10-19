import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';

class SearchStore extends Component {
    state = {
        storeList: [],
        searchVal: '',
        nearbyStoreList: [],
        cityPosition: this.props.cityPosition
    }
    // 挂载完毕获取数据
    componentDidMount() {
        this.getStoreList(this.props.cityPosition)
        this.setState({
            cityPosition: this.props.cityPosition
        })
    }
    SearchStore = () => {
        this.getStoreList(this.props.cityPosition)
    }
    getStoreList = (cityPosition) => {
        axios({
            url: '/api/userStages/locationStore',
            method: 'POST',
            data: {
                address: cityPosition,
                limit: 1000,
                name: this.state.searchVal,
                offset: 1
            }
        })
            .then(res => {
                console.log(res.data.data.list.length)
                this.setState({
                    storeList: res.data.data.list
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    storeDetail = (i) => {
        this.props.navigation.navigate('StoreDetail', { storeid: i })
    }
    search = (t) => {
        this.setState({
            searchVal: t
        })
    }
    // 回到上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { storeList, searchVal, cityPosition } = this.state
        let storeDom
        if (storeList.length === 0) {
            storeDom = <View style={{ width: '100%', height: 80, alignItems: 'center', justifyContent: 'center' }}>
                <Text>抱歉，您附近还没有加盟店呢</Text>
            </View>
        } else {
            storeDom = storeList.map((item, index) => {
                if (index === 18 || index === 20) {
                    console.log(item.signboardPhoto, 'dddd')
                }
                return (
                    <TouchableOpacity key={item.id} onPress={() => this.storeDetail(item)} style={styles.storeItem}>
                        <View style={styles.storeImg}>
                            {item.signboardPhoto !== null
                                ? <FastImage
                                    style={{ width: '100%', height: '100%' }}
                                    source={{
                                        uri: item.signboardPhoto,
                                        headers: { Authorization: 'someAuthToken' },
                                        priority: FastImage.priority.normal,
                                    }}
                                />
                                : <Image source={require('../../assets/img/notInfo/storeNoImg.jpg')} style={{ width: '100%', height: '100%' }}></Image>}
                        </View>
                        <View style={styles.storeDirec}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                            <Text style={{ color: '#B2B2B2', fontSize: 13 }}>{item.address}</Text>
                        </View>
                    </TouchableOpacity>
                )
            })
        }
        const renderItem = ({ item }) => (
            <TouchableOpacity onPress={() => this.storeDetail(item)} style={styles.storeItem}>
                <View style={styles.storeImg}>
                    <Image source={{ uri: item.signboardPhoto }} style={{ width: '100%', height: '100%' }}></Image>
                </View>
                <View style={styles.storeDirec}>
                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                    <Text style={{ color: '#B2B2B2', fontSize: 13 }}>{item.address}</Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View style={{ backgroundColor: 'white', paddingTop: 30 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>门店服务</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>

                <View style={{ alignItems: 'center', width: '100%', backgroundColor: 'white' }}>
                    <View style={styles.PlaceAndConditions}>
                        <View style={styles.PlaceView}>
                            <Feather name='map-pin' size={14} ></Feather>
                            <Text>
                                {cityPosition ? cityPosition : '定位失败'}
                            </Text>
                        </View>
                        <TextInput
                            style={styles.searchInput}
                            placeholder='搜索店名'
                            value={searchVal}
                            returnKeyType='search'
                            onChangeText={(text) => this.search(text)} />
                        <Text style={styles.searchBtn} onPress={this.SearchStore}>搜索</Text>
                    </View>
                    <View style={styles.allStore}>
                        <View style={styles.allCheck}>
                            <Text>全部</Text>
                            <Feather name='chevron-down' size={16}></Feather>
                        </View>
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.storeList}>
                    {storeDom}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    PlaceAndConditions: {
        width: '96%',
        height: 60,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
    },
    PlaceView: {
        width: '18%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    searchInput: {
        paddingLeft: 10,
        height: 45,
        width: '50%',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ECECEC'
    },
    searchBtn: {
        width: '17%',
        height: 45,
        textAlign: 'center',
        lineHeight: 45,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ECECEC'
    },
    allStore: {
        width: '96%',
        height: 40,
        justifyContent: 'center',
    },
    allCheck: {
        width: 80,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    storeList: {
        width: '100%',
        paddingBottom: 200
    },
    storeItem: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ebebeb',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    storeImg: {
        width: 80,
        height: 80,
        backgroundColor: '#ccc',
        marginRight: 20
    },
    storeDirec: {
        height: 80,
        justifyContent: 'space-evenly',
        width: '70%'
    },
    header: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#EDEDED',
        borderWidth: 1,
        borderColor: '#ccc'
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
        cityPosition: state.userReducer.cityPosition
    }
}

export default connect(mapStateToProps)(SearchStore)