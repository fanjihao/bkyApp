import { toObligationType, toPendingType, toReceivingType } from './orderActionsType'

const initState = {

    // 区分订单类型，0为待付款，1为待发货，2为待收货
    // 默认为显示全部订单
    orderType: 0
}

function orderReducer(state = initState, action) {
    switch (action.type) {
        case toObligationType:
            return {
                orderType: 0,
            }
        case toPendingType:
            return {
                orderType: 1
            }
        case toReceivingType:
            return {
                orderType: 2
            }
        default:
            return state
    }
}

export default orderReducer