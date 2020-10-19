import { phoneInfoType, openInfoType, finInfoType, cleanInfoType } from "./merRegisterActionsType"

const initState = {
    registerInfo: {
        accountNumber: '', // 账号
        code: '', // 验证码
        password: '', // 密码

        NatureMerchant: '',
        recommendCode: '', // 推荐码
        activeCode: '', // 注册码

        creditCode: '', // 统一信用代码
        merchantName: '', // 商户名称
        legalPerson: '', // 法人代表
        legalIDCard: '', // 法人身份证
        legalPhone: '', // 法人手机号
        idFace: '', // 身份证人面
        idEmblem: '', // 身份证国徽

        openPerson: '', // 开户人
        openCard: '', // 开户人身份证
        openAccount: '', // 账户卡号
        bankPhone: '', // 银行预留手机号


        storeName: '', // 门店名称
        businessTime: '', // 经营时间
        province: '', // 省
        city: '', // 市
        district: '', // 区
        storeAddress: '', // 门店地址
        detailedAddress: '', // 详细地址
        businessArea: '', // 经营面积
        signboardPhoto: '', // 门店招牌照片
        storePhoto: '', // 门店内照片
        instaPlacePhoto: '', // 门店街景照片
        otherPhoto: '', // 其他照片

        headPerson: '', // 负责人姓名
        headIDCard: '', // 负责人身份证
        headPhone: '', // 负责人电话
    }
}

function merRegisterReducer(state = initState, action) {
    const { argu } = action
    switch (action.type) {
        case phoneInfoType:
            return {
                registerInfo: {
                    ...state.registerInfo,
                    accountNumber: argu.telphone,
                    code: argu.code,
                    password: argu.userPass
                }
            }
        case openInfoType:
            return {
                registerInfo: {
                    ...state.registerInfo,
                    NatureMerchant: argu.NatureMerchant,
                    recommendCode: argu.recommendCode, // 推荐码
                    activeCode: argu.activeCode, // 激活码
                    creditCode: argu.creditCode, // 统一信用代码
                    storeName: argu.merchantName, // 商户名称
                    legalPerson: argu.legalPerson, // 法人代表
                    legalIDCard: argu.legalIDCard, // 法人身份证
                    legalPhone: argu.legalPhone, // 法人手机号
                    openPerson: argu.openPerson, // 开户人
                    openCard: argu.openCard, // 开户人身份证
                    openAccount: argu.openAccount, // 账户卡号
                    bankPhone: argu.bankPhone, // 银行预留手机号
                    idFace: argu.idFace, // 身份证人面
                    idEmblem: argu.idEmblem, // 身份证国徽
                }
            }
        case finInfoType:
            return {
                registerInfo:{
                    ...state.registerInfo,
                    storeName: argu.storeName, // 门店名称
                    businessTime: argu.businessTime, // 经营时间
                    storeAddress: argu.storeAddress, // 门店地址
                    province: argu.province, // 省
                    city: argu.city, // 市
                    district: argu.district, // 区
                    detailedAddress: argu.detailedAddress, // 详细地址
                    signboardPhoto: argu.signboardPhoto, // 门店招牌照片
                    storePhoto: argu.storePhoto, // 门店内照片
                    instaPlacePhoto: argu.instaPlacePhoto, // 门店街景照片
                    otherPhoto: argu.otherPhoto, // 其他照片
                    businessArea: argu.businessArea, // 经营面积
                    headPerson: argu.headPerson, // 负责人姓名
                    headIDCard: argu.headIDCard, // 负责人身份证
                    headPhone: argu.headPhone, // 负责人电话
                }
            }
        case cleanInfoType:
            return {
                registerInfo:{
                    accountNumber: '', // 账号
                    code: '', // 验证码
                    password: '', // 密码
                    recommendCode: '', // 推荐码
                    activeCode: '', // 激活码
                    creditCode: '', // 统一信用代码
                    merchantName: '', // 商户名称
                    legalPerson: '', // 法人代表
                    legalIDCard: '', // 法人身份证
                    legalPhone: '', // 法人手机号
                    openPerson: '', // 开户人
                    openCard: '', // 开户人身份证
                    openAccount: '', // 账户卡号
                    bankPhone: '', // 银行预留手机号
                    storeName: '', // 门店名称
                    businessTime: '', // 经营时间
                    storeAddress: '', // 门店地址
                    businessArea: '', // 经营面积
                    headPerson: '', // 负责人姓名
                    headIDCard: '', // 负责人身份证
                    headPhone: '', // 负责人电话
                }
            }
        default:
            return state
    }
}

export default merRegisterReducer