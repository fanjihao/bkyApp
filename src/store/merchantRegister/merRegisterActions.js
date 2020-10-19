import { phoneInfoType, openInfoType, finInfoType, cleanInfoType } from './merRegisterActionsType'

export const phoneInfo = (a) => (
    {
        type: phoneInfoType,
        argu: a
    }
)

export const openInfo = (a) => (
    {
        type: openInfoType,
        argu: a
    }
)

export const finInfo = (a) => (
    {
        type: finInfoType,
        argu: a
    }
)

export const cleanInfo = () => (
    {
        type: cleanInfoType
    }
)