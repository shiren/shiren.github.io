(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{Kfvu:function(e,t,n){"use strict";var a=n("TqRt");t.__esModule=!0,t.OutboundLink=c,t.trackCustomEvent=function(e){var t=e.category,n=e.action,a=e.label,o=e.value,l=e.nonInteraction,r=void 0!==l&&l,i=e.transport,c=e.hitCallback,u=e.callbackTimeout,f=void 0===u?1e3:u;if("undefined"!=typeof window&&window.ga){var d={eventCategory:t,eventAction:n,eventLabel:a,eventValue:o,nonInteraction:r,transport:i};c&&"function"==typeof c&&(d.hitCallback=function(e,t){void 0===t&&(t=1e3);var n=!1,a=function(){n||(n=!0,e())};return setTimeout(a,t),a}(c,f)),window.ga("send","event",d)}};var o=a(n("pVnL")),l=a(n("8OQS")),r=a(n("q1tI")),i=a(n("17x9"));function c(e){var t=e.eventCategory,n=e.eventAction,a=e.eventLabel,i=e.eventValue,c=(0,l.default)(e,["eventCategory","eventAction","eventLabel","eventValue"]);return r.default.createElement("a",(0,o.default)({},c,{onClick:function(o){"function"==typeof e.onClick&&e.onClick(o);var l=!0;return(0!==o.button||o.altKey||o.ctrlKey||o.metaKey||o.shiftKey||o.defaultPrevented)&&(l=!1),e.target&&"_self"!==e.target.toLowerCase()&&(l=!1),window.ga?window.ga("send","event",{eventCategory:t||"Outbound Link",eventAction:n||"click",eventLabel:a||e.href,eventValue:i,transport:l?"beacon":"",hitCallback:function(){l&&(document.location=e.href)}}):l&&(document.location=e.href),!1}}))}c.propTypes={href:i.default.string,target:i.default.string,eventCategory:i.default.string,eventAction:i.default.string,eventLabel:i.default.string,eventValue:i.default.number,onClick:i.default.func}},"i6+/":function(e,t,n){"use strict";n.r(t);var a=n("q1tI"),o=n.n(a),l=n("Wbzz"),r=n("vOnD"),i=n("9Dj+"),c=n("Kfvu"),u=r.a.div.withConfig({displayName:"sc-404__Wrapper",componentId:"sc-1k1hpw8-0"})(["text-align:center;padding-bottom:300px;& h1{margin-bottom:30px;}& > a{display:block;margin-top:30px;cursor:pointer;text-decoration:underline;}& > p > a{font-size:14px;}"]);t.default=function(){var e=Object(a.useState)(null),t=e[0],n=e[1];return Object(a.useEffect)((function(){var e=decodeURIComponent(location.href);e.includes("(번역)")&&n(e.replace("(번역)","")),Object(c.trackCustomEvent)({category:"Error",action:"404",label:e})}),[]),o.a.createElement(o.a.Fragment,null,o.a.createElement(i.a,null,o.a.createElement(u,null,o.a.createElement("h1",null,"Page not found"),o.a.createElement("p",null,"두둠칫🎶 두둠칫🎶 두둠두둠둠🎶 두둠칫칫🎶"),o.a.createElement("img",{src:"/image/lime404.gif",alt:"lime"}),t?o.a.createElement("p",null,"번역 포스트는 주소가 변경되었습니다.",o.a.createElement("br",null),o.a.createElement("a",{href:t},t)):null,o.a.createElement("a",{onClick:function(){window.history.length>1?window.history.back():Object(l.c)("/")}},"이전으로"))))}}}]);
//# sourceMappingURL=component---src-pages-404-tsx-a6b4ba2f2d2bbc34753f.js.map