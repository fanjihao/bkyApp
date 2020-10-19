import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

export default class NewsDetail extends Component {
    state = {
        newsData: this.props.route.params.newsData
    }
    // 返回上一级
    back = () => {
        this.props.navigation.goBack()
    }
    render() {
        const { newsData } = this.state
        return (
            <ScrollView contentContainerStyle={{ paddingTop: 30, flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>新闻详情</Text>
                    <Feather name="chevron-left" size={24} style={styles.headerLeft} onPress={this.back} />
                </View>
                <View style={styles.title}>
                    <Image source={{ uri: newsData.photo }} style={styles.newsImage} />
                    <Text style={{ margin: 20, fontSize: 16, fontWeight: 'bold' }}>{newsData.title}</Text>
                </View>
                <View style={styles.content}>
                    <Text>作者：{newsData.author}</Text>
                    <Text style={{fontSize: 12,color: '#CCCCCC',marginBottom: 5, marginTop: 5}}>
                        {
                            newsData.createTime.split('T')[0] + newsData.createTime.split('T')[1].split('.')[0]
                        }
                    </Text>
                    <Text>
                        {
                            newsData.content.split('<p>')[1].split('</p>')[0]
                        }
                    </Text>
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
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
    },
    title: {
        padding: 10,
        backgroundColor: 'white',
        marginBottom: 5
    },
    newsImage: {
        width: '100%',
        height: 180
    },
    content: {
        backgroundColor: 'white',
        flexGrow: 1,
        padding: 10,
        paddingLeft: 30
    }
})