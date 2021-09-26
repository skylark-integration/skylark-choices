/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["./wrapped-element"],function(e){"use strict";return class extends e{constructor({element:e,classNames:t,template:n}){super({element:e,classNames:t}),this.template=n}get placeholderOption(){return this.element.querySelector('option[value=""]')||this.element.querySelector("option[placeholder]")}get optionGroups(){return Array.from(this.element.getElementsByTagName("OPTGROUP"))}get options(){return Array.from(this.element.options)}set options(e){const t=document.createDocumentFragment(),n=e=>{const n=this.template(e);t.appendChild(n)};e.forEach(e=>n(e)),this.appendDocFragment(t)}appendDocFragment(e){this.element.innerHTML="",this.element.appendChild(e)}}});
//# sourceMappingURL=../sourcemaps/components/wrapped-select.js.map
