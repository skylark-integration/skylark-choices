define(function () {
    'use strict';
    const clearAll = () => ({ type: 'CLEAR_ALL' });
    const resetTo = state => ({
        type: 'RESET_TO',
        state
    });
    const setIsLoading = isLoading => ({
        type: 'SET_IS_LOADING',
        isLoading
    });
    return {
        clearAll: clearAll,
        resetTo: resetTo,
        setIsLoading: setIsLoading
    };
});