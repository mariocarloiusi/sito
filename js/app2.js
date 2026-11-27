(function(){
var EN=JSON.parse(document.getElementById('enData').textContent);
var orig=new WeakMap(),lang='it',ATTR=['aria-label','alt','title'];
var pe=/^\/en(\/|$)/.test(location.pathname);lang=pe?'en':'it';
try{if(!pe&&location.pathname==='/'&&localStorage.getItem('lang')==='en'){lang='en';history.replaceState(null,'','/en/'+location.hash);if(window.__pretty)__pretty();}}catch(e){}
function skip(n){var p=n.parentNode;return !p||/^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName);}
function trText(n){if(skip(n))return;var raw=n.nodeValue,k=raw.trim().replace(/\s+/g,' ');if(!k)return;var v=EN[k];if(v===undefined||v===k)return;orig.set(n,raw);var m=raw.match(/^\s*/)[0],z=raw.match(/\s*$/)[0];n.nodeValue=m+v+z;}
function trAttr(el){var ae=el.getAttribute('data-alt-en');if(ae!=null&&el.getAttribute('alt')!==ae){el.setAttribute('data-it-alt',el.getAttribute('alt')||'');el.setAttribute('alt',ae);}for(var i=0;i<ATTR.length;i++){var a=ATTR[i],val=el.getAttribute(a);if(val==null||(a==='alt'&&ae!=null))continue;var v=EN['@'+val];if(v===undefined)continue;v=v.slice(1);if(v===val)continue;el.setAttribute('data-it-'+a,val);el.setAttribute(a,v);}}
function walk(root,fn,fe){if(root.nodeType===3){fn(root);return;}if(root.nodeType!==1)return;if(fe)fe(root);var w=document.createTreeWalker(root,5,null),n;while(n=w.nextNode()){if(n.nodeType===3)fn(n);else if(fe)fe(n);}}
function toEN(r){walk(r,trText,trAttr);}
function toIT(){walk(document.body,function(n){if(orig.has(n)){n.nodeValue=orig.get(n);orig.delete(n);}},function(el){for(var i=0;i<ATTR.length;i++){var a=ATTR[i],o=el.getAttribute('data-it-'+a);if(o!=null){el.setAttribute(a,o);el.removeAttribute('data-it-'+a);}}});}
var mo=new MutationObserver(function(ms){if(lang!=='en')return;mo.disconnect();ms.forEach(function(m){if(m.type==='attributes')trAttr(m.target);else for(var i=0;i<m.addedNodes.length;i++)toEN(m.addedNodes[i]);});obs();});
function obs(){mo.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:ATTR});}
function marks(){var q=document.querySelectorAll('[data-l]');for(var i=0;i<q.length;i++){var on=q[i].getAttribute('data-l')===lang;q[i].classList.toggle('on',on);q[i].setAttribute('aria-pressed',on?'true':'false');}document.documentElement.lang=lang;}
function set(l){if(l===lang)return;lang=l;try{localStorage.setItem('lang',l);}catch(e){}var bp=location.pathname.replace(/^\/en(?=\/|$)/,'')||'/';history.replaceState(null,'',(l==='en'?'/en'+bp:bp)+location.hash);if(window.__pretty)__pretty();mo.disconnect();if(l==='en')toEN(document.body);else toIT();obs();marks();if(window.__meta)__meta();if(window.gcHit)gcHit();}
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-l]');if(!b)return;e.preventDefault();set(b.getAttribute('data-l'));});
if(lang==='en')toEN(document.body);obs();marks();
window.__setLang=set;
})();
