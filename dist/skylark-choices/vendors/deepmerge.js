/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["./is-mergeable-object"],function(r){function e(r,e){return!1!==e.clone&&e.isMergeableObject(r)?u((n=r,Array.isArray(n)?[]:{}),r,e):r;var n}function n(r,n,t){return r.concat(n).map(function(r){return e(r,t)})}function t(r){return Object.keys(r).concat(function(r){return Object.getOwnPropertySymbols?Object.getOwnPropertySymbols(r).filter(function(e){return r.propertyIsEnumerable(e)}):[]}(r))}function c(r,e){try{return e in r}catch(r){return!1}}function a(r,n,a){var o={};return a.isMergeableObject(r)&&t(r).forEach(function(n){o[n]=e(r[n],a)}),t(n).forEach(function(t){(function(r,e){return c(r,e)&&!(Object.hasOwnProperty.call(r,e)&&Object.propertyIsEnumerable.call(r,e))})(r,t)||(c(r,t)&&a.isMergeableObject(n[t])?o[t]=function(r,e){if(!e.customMerge)return u;var n=e.customMerge(r);return"function"==typeof n?n:u}(t,a)(r[t],n[t],a):o[t]=e(n[t],a))}),o}function u(t,c,u){(u=u||{}).arrayMerge=u.arrayMerge||n,u.isMergeableObject=u.isMergeableObject||r,u.cloneUnlessOtherwiseSpecified=e;var o=Array.isArray(c);return o===Array.isArray(t)?o?u.arrayMerge(t,c,u):a(t,c,u):e(c,u)}return u.all=function(r,e){if(!Array.isArray(r))throw new Error("first argument should be an array");return r.reduce(function(r,n){return u(r,n,e)},{})},u});
//# sourceMappingURL=../sourcemaps/vendors/deepmerge.js.map
