/*!
 * Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2024 Fonticons, Inc.
 */
(function(t,e){"object"===typeof exports&&"undefined"!==typeof module?e():"function"===typeof define&&define.amd?define(e):e()})(0,(function(){"use strict";let t={},e={};try{"undefined"!==typeof window&&(t=window),"undefined"!==typeof document&&(e=document)}catch(H){}const{userAgent:n=""}=t.navigator||{},o=t,i=e,r=!!o.document,a=!!i.documentElement&&!!i.head&&"function"===typeof i.addEventListener&&"function"===typeof i.createElement,s=(~n.indexOf("MSIE")||n.indexOf("Trident/"),[]),c=function(){i.removeEventListener("DOMContentLoaded",c),f=1,s.map((t=>t()))};let f=!1;function l(t){a&&(f?setTimeout(t,0):s.push(t))}a&&(f=(i.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(i.readyState),f||i.addEventListener("DOMContentLoaded",c));var d="undefined"!==typeof window?window:"undefined"!==typeof global?global:"undefined"!==typeof self?self:{};var u=function(t,e){return e={exports:{}},t(e,e.exports),e.exports}((function(t){(function(e){function n(t,e){var n=(65535&t)+(65535&e),o=(t>>16)+(e>>16)+(n>>16);return o<<16|65535&n}function o(t,e){return t<<e|t>>>32-e}function i(t,e,i,r,a,s){return n(o(n(n(e,t),n(r,s)),a),i)}function r(t,e,n,o,r,a,s){return i(e&n|~e&o,t,e,r,a,s)}function a(t,e,n,o,r,a,s){return i(e&o|n&~o,t,e,r,a,s)}function s(t,e,n,o,r,a,s){return i(e^n^o,t,e,r,a,s)}function c(t,e,n,o,r,a,s){return i(n^(e|~o),t,e,r,a,s)}function f(t,e){var o,i,f,l,d;t[e>>5]|=128<<e%32,t[14+(e+64>>>9<<4)]=e;var u=1732584193,h=-271733879,g=-1732584194,m=271733878;for(o=0;o<t.length;o+=16)i=u,f=h,l=g,d=m,u=r(u,h,g,m,t[o],7,-680876936),m=r(m,u,h,g,t[o+1],12,-389564586),g=r(g,m,u,h,t[o+2],17,606105819),h=r(h,g,m,u,t[o+3],22,-1044525330),u=r(u,h,g,m,t[o+4],7,-176418897),m=r(m,u,h,g,t[o+5],12,1200080426),g=r(g,m,u,h,t[o+6],17,-1473231341),h=r(h,g,m,u,t[o+7],22,-45705983),u=r(u,h,g,m,t[o+8],7,1770035416),m=r(m,u,h,g,t[o+9],12,-1958414417),g=r(g,m,u,h,t[o+10],17,-42063),h=r(h,g,m,u,t[o+11],22,-1990404162),u=r(u,h,g,m,t[o+12],7,1804603682),m=r(m,u,h,g,t[o+13],12,-40341101),g=r(g,m,u,h,t[o+14],17,-1502002290),h=r(h,g,m,u,t[o+15],22,1236535329),u=a(u,h,g,m,t[o+1],5,-165796510),m=a(m,u,h,g,t[o+6],9,-1069501632),g=a(g,m,u,h,t[o+11],14,643717713),h=a(h,g,m,u,t[o],20,-373897302),u=a(u,h,g,m,t[o+5],5,-701558691),m=a(m,u,h,g,t[o+10],9,38016083),g=a(g,m,u,h,t[o+15],14,-660478335),h=a(h,g,m,u,t[o+4],20,-405537848),u=a(u,h,g,m,t[o+9],5,568446438),m=a(m,u,h,g,t[o+14],9,-1019803690),g=a(g,m,u,h,t[o+3],14,-187363961),h=a(h,g,m,u,t[o+8],20,1163531501),u=a(u,h,g,m,t[o+13],5,-1444681467),m=a(m,u,h,g,t[o+2],9,-51403784),g=a(g,m,u,h,t[o+7],14,1735328473),h=a(h,g,m,u,t[o+12],20,-1926607734),u=s(u,h,g,m,t[o+5],4,-378558),m=s(m,u,h,g,t[o+8],11,-2022574463),g=s(g,m,u,h,t[o+11],16,1839030562),h=s(h,g,m,u,t[o+14],23,-35309556),u=s(u,h,g,m,t[o+1],4,-1530992060),m=s(m,u,h,g,t[o+4],11,1272893353),g=s(g,m,u,h,t[o+7],16,-155497632),h=s(h,g,m,u,t[o+10],23,-1094730640),u=s(u,h,g,m,t[o+13],4,681279174),m=s(m,u,h,g,t[o],11,-358537222),g=s(g,m,u,h,t[o+3],16,-722521979),h=s(h,g,m,u,t[o+6],23,76029189),u=s(u,h,g,m,t[o+9],4,-640364487),m=s(m,u,h,g,t[o+12],11,-421815835),g=s(g,m,u,h,t[o+15],16,530742520),h=s(h,g,m,u,t[o+2],23,-995338651),u=c(u,h,g,m,t[o],6,-198630844),m=c(m,u,h,g,t[o+7],10,1126891415),g=c(g,m,u,h,t[o+14],15,-1416354905),h=c(h,g,m,u,t[o+5],21,-57434055),u=c(u,h,g,m,t[o+12],6,1700485571),m=c(m,u,h,g,t[o+3],10,-1894986606),g=c(g,m,u,h,t[o+10],15,-1051523),h=c(h,g,m,u,t[o+1],21,-2054922799),u=c(u,h,g,m,t[o+8],6,1873313359),m=c(m,u,h,g,t[o+15],10,-30611744),g=c(g,m,u,h,t[o+6],15,-1560198380),h=c(h,g,m,u,t[o+13],21,1309151649),u=c(u,h,g,m,t[o+4],6,-145523070),m=c(m,u,h,g,t[o+11],10,-1120210379),g=c(g,m,u,h,t[o+2],15,718787259),h=c(h,g,m,u,t[o+9],21,-343485551),u=n(u,i),h=n(h,f),g=n(g,l),m=n(m,d);return[u,h,g,m]}function l(t){var e,n="",o=32*t.length;for(e=0;e<o;e+=8)n+=String.fromCharCode(t[e>>5]>>>e%32&255);return n}function d(t){var e,n=[];for(n[(t.length>>2)-1]=void 0,e=0;e<n.length;e+=1)n[e]=0;var o=8*t.length;for(e=0;e<o;e+=8)n[e>>5]|=(255&t.charCodeAt(e/8))<<e%32;return n}function u(t){return l(f(d(t),8*t.length))}function h(t,e){var n,o,i=d(t),r=[],a=[];for(r[15]=a[15]=void 0,i.length>16&&(i=f(i,8*t.length)),n=0;n<16;n+=1)r[n]=909522486^i[n],a[n]=1549556828^i[n];return o=f(r.concat(d(e)),512+8*e.length),l(f(a.concat(o),640))}function g(t){var e,n,o="0123456789abcdef",i="";for(n=0;n<t.length;n+=1)e=t.charCodeAt(n),i+=o.charAt(e>>>4&15)+o.charAt(15&e);return i}function m(t){return unescape(encodeURIComponent(t))}function p(t){return u(m(t))}function w(t){return g(p(t))}function b(t,e){return h(m(t),m(e))}function y(t,e){return g(b(t,e))}function A(t,e,n){return e?n?b(e,t):y(e,t):n?p(t):w(t)}t.exports?t.exports=A:e.md5=A})(d)}));function h(t){if(null!==t&&"object"===typeof t)return t.src?u(t.src):t.href?u(t.href):t.innerText&&""!==t.innerText?u(t.innerText):void 0}const g="fa-kits-diag",m="fa-kits-node-under-test",p="data-md5",w="data-fa-detection-ignore",b="data-fa-detection-timeout",y="data-fa-detection-results-collection-max-wait",A=t=>{t.preventDefault(),t.stopPropagation()};function x(t){let{fn:e=(()=>!0),initialDuration:n=1,maxDuration:i=o.FontAwesomeDetection.timeout,showProgress:r=!1,progressIndicator:a}=t;return new Promise((function(t,o){(function n(s,c){setTimeout((function(){const s=e();if(r&&console.info(a),s)t(s);else{const t=250,e=t+c;e<=i?n(t,e):o("timeout")}}),s)})(n,0)}))}function k(){const t=Array.from(i.getElementsByTagName("link")).filter((t=>!t.hasAttribute(w))),e=Array.from(i.getElementsByTagName("style")).filter((t=>!t.hasAttribute(w)&&(!o.FontAwesomeConfig||!t.innerText.match(new RegExp("svg:not\\(:root\\)\\.".concat(o.FontAwesomeConfig.replacementClass))))));function n(t,e){const n=i.createElement("iframe");n.setAttribute("style","visibility: hidden; position: absolute; height: 0; width: 0;");const r="fa-test-icon-"+e,a=i.createElement("i");a.setAttribute("class","fa fa-coffee"),a.setAttribute("id",r);const s=i.createElement("script");s.setAttribute("id",g);const c="file://"===o.location.origin?"*":o.location.origin;s.innerText="(".concat(((t,e,n,o)=>{parent.FontAwesomeDetection.__pollUntil({fn:()=>{const t=document.getElementById(e),n=window.getComputedStyle(t),o=n.getPropertyValue("font-family");return!(!o.match(/FontAwesome/)&&!o.match(/Font Awesome [56]/))}}).then((()=>{const e=document.getElementById(t);parent.postMessage({type:"fontawesome-conflict",technology:"webfont",href:e.href,innerText:e.innerText,tagName:e.tagName,md5:n},o)})).catch((function(e){const i=document.getElementById(t);"timeout"===e?parent.postMessage({type:"no-conflict",technology:"webfont",href:i.src,innerText:i.innerText,tagName:i.tagName,md5:n},o):console.error(e)}))}).toString(),")('").concat(m,"', '").concat(r||"foo","', '").concat(e,"', '").concat(c,"');"),n.onload=function(){n.contentWindow.addEventListener("error",A,!0),n.contentDocument.head.appendChild(s),n.contentDocument.head.appendChild(t),n.contentDocument.body.appendChild(a)},l((()=>i.body.appendChild(n)))}const r={};for(let o=0;o<t.length;o++){const e=i.createElement("link");e.setAttribute("id",m),e.setAttribute("href",t[o].href),e.setAttribute("rel",t[o].rel);const a=h(t[o]);e.setAttribute(p,a),r[a]=t[o],n(e,a)}for(let o=0;o<e.length;o++){var a=i.createElement("style");a.setAttribute("id",m);const t=h(e[o]);a.setAttribute(p,t),a.innerText=e[o].innerText,r[t]=e[o],n(a,t)}return r}function T(t){const e=Array.from(i.scripts).filter((e=>!e.hasAttribute(w)&&e!==t)),n={};for(let r=0;r<e.length;r++){const t=i.createElement("iframe");t.setAttribute("style","display:none;");const a=i.createElement("script");a.setAttribute("id",m);const s=h(e[r]);a.setAttribute(p,s),n[s]=e[r],""!==e[r].src&&(a.src=e[r].src),""!==e[r].innerText&&(a.innerText=e[r].innerText),a.async=!0;const c=i.createElement("script");c.setAttribute("id",g);const f="file://"===o.location.origin?"*":o.location.origin,d=(t,e,n)=>{parent.FontAwesomeDetection.__pollUntil({fn:()=>!!window.FontAwesomeConfig||!!window.FontAwesomeKitConfig}).then((function(){const o=document.getElementById(t);parent.postMessage({type:"fontawesome-conflict",technology:"js",src:o.src,innerText:o.innerText,tagName:o.tagName,md5:e},n)})).catch((function(o){var i=document.getElementById(t);"timeout"===o?parent.postMessage({type:"no-conflict",src:i.src,innerText:i.innerText,tagName:i.tagName,md5:e},n):console.error(o)}))};c.innerText="(".concat(d.toString(),")('").concat(m,"', '").concat(s,"', '").concat(f,"');"),t.onload=function(){t.contentWindow.addEventListener("error",A,!0),t.contentDocument.head.appendChild(c),t.contentDocument.head.appendChild(a)},l((()=>i.body.appendChild(t)))}return n}function F(t){let{nodesTested:e,nodesFound:n}=t;o.FontAwesomeDetection=o.FontAwesomeDetection||{},o.FontAwesomeDetection.nodesTested=e,o.FontAwesomeDetection.nodesFound=n,o.FontAwesomeDetection.detectionDone=!0}function v(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:()=>{};const e={conflict:{},noConflict:{}};o.onmessage=function(t){"file://"!==o.location.origin&&t.origin!==o.location.origin||t&&t.data&&("fontawesome-conflict"===t.data.type?e.conflict[t.data.md5]=t.data:"no-conflict"===t.data.type&&(e.noConflict[t.data.md5]=t.data))};const n=T(i.currentScript),r=k(),a={...n,...r},s=Object.keys(n).length+Object.keys(r).length,c=o.FontAwesomeDetection.timeout+o.FontAwesomeDetection.resultsCollectionMaxWait;console.group("Font Awesome Detector"),0===s?(console.info("%cAll Good!","color: green; font-size: large"),console.info("We didn't find anything that needs testing for conflicts. Ergo, no conflicts.")):(console.info("Testing ".concat(s," possible conflicts.")),console.info("We'll wait about ".concat(Math.round(o.FontAwesomeDetection.timeout/10)/100," seconds while testing these and\n")+"then up to another ".concat(Math.round(o.FontAwesomeDetection.resultsCollectionMaxWait/10)/100," to allow the browser time\n")+"to accumulate the results. But we'll probably be outta here way before then.\n\n"),console.info("You can adjust those durations by assigning values to these attributes on the <script> element that loads this detection:"),console.info("\t%c".concat(b,"%c: milliseconds to wait for each test before deciding whether it's a conflict."),"font-weight: bold;","font-size: normal;"),console.info("\t%c".concat(y,"%c: milliseconds to wait for the browser to accumulate test results before giving up."),"font-weight: bold;","font-size: normal;"),x({maxDuration:c,showProgress:!0,progressIndicator:"waiting...",fn:()=>Object.keys(e.conflict).length+Object.keys(e.noConflict).length>=s}).then((()=>{console.info("DONE!"),F({nodesTested:e,nodesFound:a}),t({nodesTested:e,nodesFound:a}),console.groupEnd()})).catch((n=>{"timeout"===n?(console.info("TIME OUT! We waited until we got tired. Here's what we found:"),F({nodesTested:e,nodesFound:a}),t({nodesTested:e,nodesFound:a})):(console.info("Whoops! We hit an error:",n),console.info("Here's what we'd found up until that error:"),F({nodesTested:e,nodesFound:a}),t({nodesTested:e,nodesFound:a})),console.groupEnd()})))}const E=o.FontAwesomeDetection||{},C={report:function(t){let{nodesTested:e,nodesFound:n}=t;const o={};for(let s in n)e.conflict[s]||e.noConflict[s]||(o[s]=n[s]);const i=Object.keys(e.conflict).length;if(i>0){console.info("%cConflict".concat(i>1?"s":""," found:"),"color: darkred; font-size: large");const t={};for(let n in e.conflict){const o=e.conflict[n];t[n]={tagName:o.tagName,"src/href":o.src||o.href||"n/a","innerText excerpt":o.innerText&&""!==o.innerText?o.innerText.slice(0,200)+"...":"(empty)"}}console.table(t)}const r=Object.keys(e.noConflict).length;if(r>0){console.info("%cNo conflict".concat(r>1?"s":""," found with ").concat(1===r?"this":"these",":"),"color: green; font-size: large");const t={};for(let n in e.noConflict){const o=e.noConflict[n];t[n]={tagName:o.tagName,"src/href":o.src||o.href||"n/a","innerText excerpt":o.innerText&&""!==o.innerText?o.innerText.slice(0,200)+"...":"(empty)"}}console.table(t)}const a=Object.keys(o).length;if(a>0){console.info("%cLeftovers--we timed out before collecting test results for ".concat(1===a?"this":"these",":"),"color: blue; font-size: large");const t={};for(let e in o){const n=o[e];t[e]={tagName:n.tagName,"src/href":n.src||n.href||"n/a","innerText excerpt":n.innerText&&""!==n.innerText?n.innerText.slice(0,200)+"...":"(empty)"}}console.table(t)}},timeout:+(i.currentScript.getAttribute(b)||"2000"),resultsCollectionMaxWait:+(i.currentScript.getAttribute(y)||"5000")},D={...C,...E,__pollUntil:x,md5ForNode:h,detectionDone:!1,nodesTested:null,nodesFound:null};o.FontAwesomeDetection=D;var N="classic",O={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},j={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fad:"duotone","fa-duotone":"duotone",fab:"brands","fa-brands":"brands"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid"}},M={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}};const S=(()=>{try{return"production"===process.env.NODE_ENV}catch(t){return!1}})();function I(t){return new Proxy(t,{get(t,e){return e in t?t[e]:t[N]}})}const W={...j};W[N]={...j[N],...O["kit"],...O["kit-duotone"]};I(W);const B={classic:{solid:"fas",regular:"far",light:"fal",thin:"fat",duotone:"fad",brands:"fab"},sharp:{solid:"fass",regular:"fasr",light:"fasl",thin:"fast"},"sharp-duotone":{solid:"fasds"}};B[N]={...B[N],...M["kit"],...M["kit-duotone"]};const L=I(B),_={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid"}};_[N]={..._[N],...{kit:{fak:"fa-kit"},"kit-duotone":{fakd:"fa-kit-duotone"}}["kit"]};I(_);const z={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds"}};z[N]={...z[N],...{kit:{"fa-kit":"fak"},"kit-duotone":{"fa-kit-duotone":"fakd"}}["kit"]};I(z);const P={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds"}},U=(I(P),new Set);Object.keys(L[N]).map(U.add.bind(U)),Object.keys(L["sharp"]).map(U.add.bind(U)),Object.keys(L["sharp-duotone"]).map(U.add.bind(U)),function(t){try{for(var e=arguments.length,n=new Array(e>1?e-1:0),o=1;o<e;o++)n[o-1]=arguments[o];t(...n)}catch(H){if(!S)throw H}}((()=>{r&&a&&v(window.FontAwesomeDetection.report)}))}));