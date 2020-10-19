import { personInfoType, cityPositionType } from './userActionsType';

export const personInfoAction = (personInfo) => (
    {
        type: personInfoType,
        personInfo: personInfo,
    }
)
export const cityPositionAction = (city) => (
    {
        type: cityPositionType,
        city:city,
    }
)