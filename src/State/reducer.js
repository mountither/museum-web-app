import {
  REQUEST_CANCELLED,
  REQUEST_FAILED, 
  REQUEST_STARTED, 
  REQUEST_SUCCESSFUL, 
  SET_SESSION_STORAGE
} from './constants'

export const reducer = (state, action) => {
    switch (action.type) {
      case REQUEST_STARTED:
        return {
          ...state,
          isLoading: true,
        };
      case REQUEST_SUCCESSFUL:
        return {
          ...state,
          isLoading: false,
          error: null,
          data: action.data,
        };
      case REQUEST_FAILED:
        return {
          ...state,
          isLoading: false,
          error: action.error,
        };
      case REQUEST_CANCELLED:
        return {
          ...state,
          isLoading: false,
          error: null
      };
      case SET_SESSION_STORAGE:
        sessionStorage.setItem('TLState', JSON.stringify(state));
        
      default:
        return state;
    }
  };
  