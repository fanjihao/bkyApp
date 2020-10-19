import { createStore, combineReducers, applyMiddleware } from 'redux';
import loginReducer from './login/loginReducer';
import orderReducer from './order/orderReducer';
import merRegisterReducer from './merchantRegister/merRegisterReducer'
import thunk from 'redux-thunk';
import userReducer from './user/userReducer';

const mainReducer = combineReducers({
    loginReducer,
    orderReducer,
    merRegisterReducer,
    userReducer
})

const store = createStore(mainReducer, applyMiddleware(thunk))

export default store