import { toObligationType, toPendingType, toReceivingType } from './orderActionsType'


export const toObligationAction = () => (
    {
        type: toObligationType
    }
)

export const toPendingAction = () => (
    {
        type: toPendingType
    }
)

export const toReceivingAction = () => (
    {
        type: toReceivingType
    }
)
