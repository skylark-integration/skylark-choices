/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["../constants"],function(e){"use strict";return{addItem:({value:t,label:d,id:i,choiceId:o,groupId:I,customProperties:c,placeholder:l,keyCode:r})=>({type:e.ACTION_TYPES.ADD_ITEM,value:t,label:d,id:i,choiceId:o,groupId:I,customProperties:c,placeholder:l,keyCode:r}),removeItem:(t,d)=>({type:e.ACTION_TYPES.REMOVE_ITEM,id:t,choiceId:d}),highlightItem:(t,d)=>({type:e.ACTION_TYPES.HIGHLIGHT_ITEM,id:t,highlighted:d})}});
//# sourceMappingURL=../sourcemaps/actions/items.js.map
