import { toUserType, toMerchantType, getGeoLocationType } from './loginActionsType'

const initState = {
    // 用于区分商家及用户，用户为1，商家为2，默认为用户
    type: 1,
    // 当前用户地理位置
    cityPosition: null
}

function loginReducer(state = initState, action) {
    switch (action.type) {
        case toUserType:
            return {
                ...state,
                type: 1
            }
        case toMerchantType:
            return {
                ...state,
                type: 2
            }
        case getGeoLocationType:
            return {
                ...state,
                cityPosition: action.cityPosition
            }
        default:
            return state
    }
}

export default loginReducer