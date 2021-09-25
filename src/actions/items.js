define([
    '../constants'
], function (constants) {
    'use strict';
    const addItem = ({value, label, id, choiceId, groupId, customProperties, placeholder, keyCode}) => ({
        type: constants.ACTION_TYPES.ADD_ITEM,
        value,
        label,
        id,
        choiceId,
        groupId,
        customProperties,
        placeholder,
        keyCode
    });
    const removeItem = (id, choiceId) => ({
        type: constants.ACTION_TYPES.REMOVE_ITEM,
        id,
        choiceId
    });
    const highlightItem = (id, highlighted) => ({
        type: constants.ACTION_TYPES.HIGHLIGHT_ITEM,
        id,
        highlighted
    });
    return {
        addItem: addItem,
        removeItem: removeItem,
        highlightItem: highlightItem
    };
});