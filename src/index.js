/**
 * @format
 */
import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from '../app.json';
import store from './store';
import { Provider } from 'react-redux';

if (!__DEV__) {
    global.console = {
        info: () => { },
        log: () => { },
        assert: () => { },
        warn: () => { },
        debug: () => { },
        error: () => { },
        time: () => { },
        timeEnd: () => { },
    };
}
// console.ignoredYellowBox = ['Remote debugger'];
class Apps extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

AppRegistry.registerComponent(appName, () => Apps);
