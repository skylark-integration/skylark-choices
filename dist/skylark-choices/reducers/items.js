/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(function(){"use strict";const e=[];return function(t=e,i){switch(i.type){case"ADD_ITEM":return[...t,{id:i.id,choiceId:i.choiceId,groupId:i.groupId,value:i.value,label:i.label,active:!0,highlighted:!1,customProperties:i.customProperties,placeholder:i.placeholder||!1,keyCode:null}].map(e=>{const t=e;return t.highlighted=!1,t});case"REMOVE_ITEM":return t.map(e=>{const t=e;return t.id===i.id&&(t.active=!1),t});case"HIGHLIGHT_ITEM":return t.map(e=>{const t=e;return t.id===i.id&&(t.highlighted=i.highlighted),t});default:return t}}});
//# sourceMappingURL=../sourcemaps/reducers/items.js.map
