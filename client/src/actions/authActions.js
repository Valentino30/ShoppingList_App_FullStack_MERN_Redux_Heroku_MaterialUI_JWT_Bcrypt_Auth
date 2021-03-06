import axios from 'axios'
import { returnErrors } from './errorActions';

import {
    USER_LOADING,
    USER_LOADED,
    AUTH_ERROR,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGOUT_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from "./types";

export const loadUser = () => (dispatch, getState) => {
    
    dispatch({type: USER_LOADING})

    axios
        .get('/api/auth/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: AUTH_ERROR
            })
        })
}

export const registerUser = ({email, password}) => dispatch => {
    
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ email, password})

    axios
        .post('/api/users', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL')),
            dispatch({
            type: REGISTER_FAIL,
        }))
}

export const logoutUser = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}

export const loginUser = ({email, password}) => dispatch => {
    
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const body = JSON.stringify({ email, password})

    axios
        .post('/api/auth', body, config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => 
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL')),
            dispatch({
            type: LOGIN_FAIL,
        }))
}

export const tokenConfig = getState => {

    const token = getState().auth.token

    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    if (token) {
        config.headers['x-auth-token'] = token
    }

    return config

}