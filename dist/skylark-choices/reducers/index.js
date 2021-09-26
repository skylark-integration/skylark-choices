/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["skylark-redux","./items","./groups","./choices","./general","../lib/utils"],function(e,t,r,s,i,c){"use strict";const n=e.combineReducers({items:t,groups:r,choices:s,general:i});return(e,t)=>{let r=e;if("CLEAR_ALL"===t.type)r=void 0;else if("RESET_TO"===t.type)return c.cloneObject(t.state);return n(r,t)}});
//# sourceMappingURL=../sourcemaps/reducers/index.js.map
