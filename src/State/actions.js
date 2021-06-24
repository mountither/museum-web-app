import {REQUEST_CANCELLED,REQUEST_FAILED, REQUEST_STARTED, REQUEST_SUCCESSFUL, SET_SESSION_STORAGE} from './constants'

export const requestSuccessful = ({ data }) => ({
    type: REQUEST_SUCCESSFUL,
    data,
});

export const setSessionStorage = ({ data }) => ({
    type: SET_SESSION_STORAGE,
    data,
});

export const requestFailed = ({ error }) => ({
    type: REQUEST_FAILED,
    error
});
export const requestCancelled = () => ({
    type: REQUEST_CANCELLED,
});

export const requestStarted = () => ({
    type: REQUEST_STARTED,
});