/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["../lib/utils"],function(e){"use strict";return class{constructor({element:e,classNames:t}){if(this.element=e,this.classNames=t,!(e instanceof HTMLInputElement||e instanceof HTMLSelectElement))throw new TypeError("Invalid element passed");this.isDisabled=!1}get isActive(){return"active"===this.element.dataset.choice}get dir(){return this.element.dir}get value(){return this.element.value}set value(e){this.element.value=e}conceal(){this.element.classList.add(this.classNames.input),this.element.hidden=!0,this.element.tabIndex=-1;const e=this.element.getAttribute("style");e&&this.element.setAttribute("data-choice-orig-style",e),this.element.setAttribute("data-choice","active")}reveal(){this.element.classList.remove(this.classNames.input),this.element.hidden=!1,this.element.removeAttribute("tabindex");const e=this.element.getAttribute("data-choice-orig-style");e?(this.element.removeAttribute("data-choice-orig-style"),this.element.setAttribute("style",e)):this.element.removeAttribute("style"),this.element.removeAttribute("data-choice"),this.element.value=this.element.value}enable(){this.element.removeAttribute("disabled"),this.element.disabled=!1,this.isDisabled=!1}disable(){this.element.setAttribute("disabled",""),this.element.disabled=!0,this.isDisabled=!0}triggerEvent(t,i){e.dispatchEvent(this.element,t,i)}}});
//# sourceMappingURL=../sourcemaps/components/wrapped-element.js.map
