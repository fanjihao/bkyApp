import React, { Component } from 'react';
import { View } from 'react-native';
import UserHome from '../component/user/UserHome';
import MechantHome from '../component/merchant/MerchantHome';
import { connect } from 'react-redux';

class Home extends Component {

    componentDidMount() {
    }

    render() {
        const { type } = this.props
        return (
            <View>
                {type === 1 ? <UserHome {...this.props} /> : <MechantHome {...this.props} />}
            </View>
        )
    }
}

function mapStateToProps(state) {
    return {
        type: state.loginReducer.type
    }
}

export default connect(mapStateToProps)(Home)