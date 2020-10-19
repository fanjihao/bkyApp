// 热更新

import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import Modal from 'react-native-modal';
import cpcn from 'cpcn-react-native';

export default class HotUpdate extends Component {
    state = {
        upgradeState: 0,
        upgradeAllBytes: 0,
        upgradeReceived: 0
    }

    componentDidMount() {
        cpcn.check({
            // 检查是否有新版本后调用此方法
            checkCallback: (remotePackage, agreeContinueFun) => {
                if (remotePackage) {
                    // 如果 remotePackage 有值，表示有新版本可更新。
                    // 将 this.state.upgradeState 的值设为1，以显示提示消息
                    this.setState({
                        upgradeState: 1
                    });
                }
            },
            // 下载新版本时调用此方法
            downloadProgressCallback: (downloadProgress) => {
                // 更新显示的下载进度中的数值
                this.setState({
                    upgradeReceived: downloadProgress.receivedBytes,
                    upgradeAllBytes: downloadProgress.totalBytes
                });
            },
            // 安装新版本后调用此方法
            installedCallback: (restartFun) => {
                // 新版本安装成功了，将 this.state.upgradeState 的值设为0，以关闭对话框
                this.setState({
                    upgradeState: 0
                }, () => {
                    // 调用此方法重启App，重启后将会使用新版本
                    restartFun(true);
                });
            }
        });
    }

    upgradeContinue = () => {
        // 用户确定更新后，调用此方法以开始更新
        cpcn.agreeContinue(true);
        // 将 this.state.upgradeState 的值设为2，以显示下载进度
        this.setState({
            upgradeState: 2
        });
    }

    render() {
        return (
            <>
                <Modal
                    visible={this.state.upgradeState > 0}
                    transparent={true}>
                    <View style={{ padding: 18, backgroundColor: "rgba(10,10,10,0.6)", height: "100%", display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <View style={{ backgroundColor: "#fff", width: "100%", padding: 18 }}>
                            {
                                this.state.upgradeState == 1
                                &&
                                <View>
                                    <View style={{ paddingBottom: 20 }}>
                                        <Text>发现新版本</Text>
                                    </View>
                                    <View>
                                        <Button title="马上更新" onPress={this.upgradeContinue} />
                                    </View>
                                </View>
                            }
                            {
                                this.state.upgradeState == 2
                                &&
                                <View>
                                    <Text style={{ textAlign: "center" }}>{this.state.upgradeReceived} / {this.state.upgradeAllBytes}</Text>
                                </View>
                            }
                        </View>
                    </View>
                </Modal>
            </>
        );
    }
}