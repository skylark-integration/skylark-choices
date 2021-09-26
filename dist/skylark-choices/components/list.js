/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["../constants"],function(e){"use strict";return class{constructor({element:e}){this.element=e,this.scrollPos=this.element.scrollTop,this.height=this.element.offsetHeight}clear(){this.element.innerHTML=""}append(e){this.element.appendChild(e)}getChild(e){return this.element.querySelector(e)}hasChildren(){return this.element.hasChildNodes()}scrollToTop(){this.element.scrollTop=0}scrollToChildElement(e,t){if(!e)return;const l=this.element.offsetHeight,s=this.element.scrollTop+l,o=e.offsetHeight,n=e.offsetTop+o,i=t>0?this.element.scrollTop+n-s:e.offsetTop;requestAnimationFrame(()=>{this._animateScroll(i,t)})}_scrollDown(e,t,l){const s=(l-e)/t,o=s>1?s:1;this.element.scrollTop=e+o}_scrollUp(e,t,l){const s=(e-l)/t,o=s>1?s:1;this.element.scrollTop=e-o}_animateScroll(t,l){const s=e.SCROLLING_SPEED,o=this.element.scrollTop;let n=!1;l>0?(this._scrollDown(o,s,t),o<t&&(n=!0)):(this._scrollUp(o,s,t),o>t&&(n=!0)),n&&requestAnimationFrame(()=>{this._animateScroll(t,l)})}}});
//# sourceMappingURL=../sourcemaps/components/list.js.map
