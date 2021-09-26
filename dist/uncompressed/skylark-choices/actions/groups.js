define(['../constants'], function (constants) {
    'use strict';
    const addGroup = ({value, id, active, disabled}) => ({
        type: constants.ACTION_TYPES.ADD_GROUP,
        value,
        id,
        active,
        disabled
    });
    return { addGroup: addGroup };
});