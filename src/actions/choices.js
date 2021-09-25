define([
    '../constants'
], function (constants) {
    'use strict';
    const addChoice = ({
        value, 
        label, 
        id, 
        groupId, 
        disabled, 
        elementId, 
        customProperties, 
        placeholder, 
        keyCode
    }) => ({
        type: constants.ACTION_TYPES.ADD_CHOICE,
        value,
        label,
        id,
        groupId,
        disabled,
        elementId,
        customProperties,
        placeholder,
        keyCode
    });
    const filterChoices = results => ({
        type: constants.ACTION_TYPES.FILTER_CHOICES,
        results
    });
    const activateChoices = (active = true) => ({
        type: constants.ACTION_TYPES.ACTIVATE_CHOICES,
        active
    });
    const clearChoices = () => ({ type: constants.ACTION_TYPES.CLEAR_CHOICES });
    return {
        addChoice: addChoice,
        filterChoices: filterChoices,
        activateChoices: activateChoices,
        clearChoices: clearChoices
    };
});