import { toUserType, toMerchantType, getGeoLocationType } from './loginActionsType';

export const toUserAction = () => (
    {
        type: toUserType
    }
)

export const toMerchantAction = () => (
    {
        type: toMerchantType
    }
)

export const getGeoLocationAction = (data) => (
    {
        type: getGeoLocationType,
        cityPosition: data
    }
)