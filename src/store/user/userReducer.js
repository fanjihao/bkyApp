import { personInfoType, cityPositionType } from './userActionsType';

const initState = {
    // 用户，商家个人信息
    personInfo: '',
    cityPosition:''
}

function userReducer(state = initState, action) {
    switch (action.type) {
        case personInfoType:
            return {
                ...state,
                personInfo: action.personInfo
            }
        case cityPositionType:
            return {
                ...state,
                cityPosition:action.city
            }
        default:
            return state
    }
}

export default userReducer