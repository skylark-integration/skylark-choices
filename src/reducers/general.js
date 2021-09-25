define(function () {
    'use strict';
    const defaultState = { loading: false };
    const general = (state = defaultState, action) => {
        switch (action.type) {
        case 'SET_IS_LOADING': {
                return { loading: action.isLoading };
            }
        default: {
                return state;
            }
        }
    };
    return general;
});