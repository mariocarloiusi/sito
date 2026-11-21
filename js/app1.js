(function(){
  var root=document.documentElement,btn=document.getElementById('lookBtn'),txt=document.getElementById('lookTxt');
  function current(){var l=root.getAttribute('data-look');if(l)return l;var t=root.getAttribute('data-theme');if(t==='dark'||t==='light')return t;return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}
  function paint(){var c=current();txt.textContent=c==='dark'?'Chiaro':'Scuro';btn.setAttribute('aria-label',c==='dark'?'Passa a modalità chiara':'Passa a modalità scura');}
  try{var saved=localStorage.getItem('look');if(saved)root.setAttribute('data-look',saved);}catch(e){}
  paint();
  btn.addEventListener('click',function(){var n=current()==='dark'?'light':'dark';root.setAttribute('data-look',n);try{localStorage.setItem('look',n);}catch(e){}paint();});
})();
(function(){
  var D=JSON.parse(document.getElementById('siteData').textContent);
  var IMG=JSON.parse(document.getElementById('imgData').textContent);
  function exLink(e){if(e.link)return e.link;for(var i=0;i<D.opere.length;i++){var w=D.opere[i];if(IMG[w.slug]&&e.testo.replace(/’/g,"'").indexOf(w.titolo.replace(/’/g,"'"))>=0)return 'opera-'+w.slug;}return null;}
  function exImg(e){for(var i=0;i<D.opere.length;i++){var w=D.opere[i];if(IMG[w.slug]&&e.testo.indexOf(w.titolo)>=0)return IMG[w.slug][0][0];}return null;}
  var main=document.getElementById('top'),hdr=document.querySelector('header');
  var V={stampa:'view-stampa',mostre:'view-mostre','mostra-exitus':'view-exitus',opere:'view-opere',luminis:'view-luminis',testi:'view-testi',info:'view-info'};
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function paras(t){return t.split('\n').filter(Boolean).map(function(l){
    if(/^C\.M\./.test(l)||/^M\.C\.I\./.test(l)){var k=l.match(/^(C\.M\.|M\.C\.I\.):?/)[0];return '<p><span class="who">'+esc(k.replace(':',''))+'</span> '+esc(l.slice(k.length).trim())+'</p>';}
    if(/^- /.test(l))return '<p class="li">'+esc(l.slice(2))+'</p>';
    return '<p>'+esc(l)+'</p>';}).join('');}
  function parts(e){var p=e.testo.split(' - ');return {what:p[0],where:p.slice(1).join(', ')};}
  var KIND={personale:'Personale',collettiva:'Collettiva',performance:'Performance',progetto:'Progetto',altro:'Evento'};
  // Mostre: list grouped by year
  var years={},order=[];D.mostre.forEach(function(e){if(!years[e.anno]){years[e.anno]=[];order.push(e.anno);}years[e.anno].push(e);});
  document.getElementById('lista').innerHTML=order.map(function(y){return '<div class="yblock"><h3 class="yh">'+y+'</h3><div class="rows">'+years[y].map(function(e){var p=parts(e);var lk=exLink(e);return '<a'+(lk?' class="go" href="#'+lk+'"':'')+'><span class="y">'+esc(e.mese.slice(0,3))+'</span><span>'+esc(p.what)+(lk?' <span class="arr" aria-hidden="true">&rarr;</span>':'')+'</span><span class="w">'+esc(p.where)+'</span><span class="w">'+KIND[e.tipo]+'</span></a>';}).join('')+'</div></div>';}).join('')+'<p class="note">'+D.mostre.length+' mostre ed eventi dal 2014. Il 2025 e il 2026 sono ancora da aggiungere.</p>';
  (document.getElementById('archivio')||{}).innerHTML=D.mostre.filter(function(e){return e.tipo==='personale'||e.tipo==='progetto';}).map(function(e){var p=parts(e);return '<a class="ex" href="#'+(e.link||'mostre')+'"><div class="img'+(e.link==='mostra-exitus'?'" style="background-image:var(--img-exitus2)':e.link==='luminis'?'" style="background-image:var(--img-luminis)':(exImg(e)?'" style="background-image:url('+exImg(e)+')':' ph'))+'"></div><span class="t1">'+esc(p.what)+'</span><span class="t2">'+esc(p.where)+'</span><span class="t3">'+esc(e.date||(e.mese+' '+e.anno))+'</span></a>';}).join('');
  document.getElementById('homeCv').innerHTML=D.mostre.filter(function(e){return e.tipo==='personale'||e.tipo==='progetto';}).slice(0,7).map(function(e){var p=parts(e);return '<a class="row" href="#'+(e.link||'mostre')+'"><span class="y">'+e.anno+'</span><span class="what">'+esc(p.what)+'</span><span class="where">'+esc(p.where)+'</span><span class="kind">'+KIND[e.tipo]+'</span></a>';}).join('');
  // Opere grid grouped by year
  var oy={},oo=[];D.opere.forEach(function(w){if(!oy[w.anno]){oy[w.anno]=[];oo.push(w.anno);}oy[w.anno].push(w);});
  document.getElementById('opereGrid').innerHTML=oo.map(function(y){return '<div class="yblock"><h3 class="yh">'+y+'</h3><div class="wgrid">'+oy[y].map(function(w){return '<a class="wk" href="#opera-'+w.slug+'">'+(IMG[w.slug]?'<div class="wplate has"><img src="'+IMG[w.slug][0][0]+'" alt="'+esc(w.titolo)+'" loading="lazy" decoding="async"></div>':'<div class="wplate"><span>'+(w.immagini?'Foto in arrivo':'Nessuna immagine sul vecchio sito')+'</span></div>')+'<em class="t">'+esc(w.titolo)+'</em><span class="wy">'+w.anno+'</span></a>';}).join('')+'</div></div>';}).join('');
  document.getElementById('luminisText').innerHTML=paras(D.luminis.split('\nLe tappe del progetto')[0].split('\n').filter(function(l){return !/finanziament|finanziato/.test(l);}).join('\n'));
  document.getElementById('bioText').innerHTML='<h2>Biografia</h2>'+paras(D.bio);
  var cur=[],lb=null,li=0,lastFocus=null;
  function lbShow(){var x=cur[li];lb.querySelector('img').src=x[0];lb.querySelector('.lbcap').textContent=(x[1]?x[1]+'  ·  ':'')+(li+1)+' / '+cur.length;}
  function lbOpen(i){lastFocus=document.activeElement;li=i;if(!lb){lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.innerHTML='<button type="button" class="lbx">Chiudi</button><button type="button" class="lbp" aria-label="Precedente">&#8249;</button><img alt=""><div class="lbcap"></div><button type="button" class="lbn" aria-label="Successiva">&#8250;</button>';document.body.appendChild(lb);
    lb.addEventListener('click',function(ev){var t=ev.target;if(t.classList.contains('lbx')||t===lb)lbClose();else if(t.classList.contains('lbp')){li=(li-1+cur.length)%cur.length;lbShow();}else if(t.classList.contains('lbn')){li=(li+1)%cur.length;lbShow();}});
    var sx=null;lb.addEventListener('touchstart',function(ev){sx=ev.touches[0].clientX;},{passive:true});lb.addEventListener('touchend',function(ev){if(sx===null)return;var dx=ev.changedTouches[0].clientX-sx;if(Math.abs(dx)>40){li=(li+(dx<0?1:-1)+cur.length)%cur.length;lbShow();}sx=null;});}
    lb.hidden=false;document.body.style.overflow='hidden';lbShow();lb.querySelector('.lbx').focus();}
  function lbClose(){if(!lb)return;lb.hidden=true;document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
  document.addEventListener('keydown',function(ev){if(!lb||lb.hidden)return;if(ev.key==='Escape')lbClose();else if(ev.key==='ArrowLeft'){li=(li-1+cur.length)%cur.length;lbShow();}else if(ev.key==='ArrowRight'){li=(li+1)%cur.length;lbShow();}});
  document.getElementById('operaBody').addEventListener('click',function(ev){var b=ev.target.closest('.gimg button');if(b)lbOpen(+b.getAttribute('data-i'));});
  [['opera-the-container','the-container',0],['opera-acrosomi','acrosomi',0],['opera-interconnessioni','interconnessioni',0],['opera-dei-vortici-e-dei-punti','dei-vortici-e-dei-punti',0]].forEach(function(p){var a=document.querySelector('.work[href="#'+p[0]+'"] .art');if(a&&IMG[p[1]]){a.classList.add('photo');a.style.backgroundImage='url('+IMG[p[1]][p[2]][0]+')';}});
  (function(){var a=document.querySelector('.work[href="#luminis"] .art');if(a){a.classList.add('photo');a.style.backgroundImage='var(--img-luminis)';}})();
  var LU=IMG.__luminis||[];
  var LG=JSON.parse(document.getElementById('logoData').textContent);var PR5=[{nome:'Semeion',img:LG.semeion},{nome:'Acqua Foundation',img:LG.acqua},{nome:'Fondazione Pistoletto, Cittadellarte',img:LG.cittadellarte},{nome:'Artivazione',img:LG.artivazione}];var SP5=[{nome:'Acea',img:LG.acea},{nome:'Core 2000 Restauri',img:LG.core2000},{nome:'Metal Vetro',img:LG.metalvetro},{nome:'Spinosa costruzioni generali',img:LG.spinosa},{nome:'BCC Credito Cooperativo',img:LG.bcc}];var P4=[{nome:'Artivazione',img:LG.artivazione},{nome:'Fondazione Pistoletto, Cittadellarte',img:LG.cittadellarte},{nome:'Espronceda, Institute of Art & Culture',img:LG.espronceda},{nome:'Regione Lazio',img:LG.regionelazio}];
  var TAPPE=[
   {slug:'alatri',comune:{nome:'Comune di Alatri',url:'https://www.comune.alatri.fr.it'},partner:P4,n:'I',nome:'Alatri',luogo:'Mura Poligonali dell’Acropoli',date:'14 settembre – 6 ottobre 2024',anno:'2024',testo:'Le installazioni luminose sulle antiche Mura Poligonali dell’Acropoli, creando un intreccio tra luce e pietra. Insieme alle installazioni, la mostra Semeion.',img:[0,9],hero:6},
   {slug:'albano',comune:{nome:'Comune di Albano Laziale',url:'https://www.comune.albanolaziale.rm.it'},partner:P4,n:'II',nome:'Albano Laziale',luogo:'Cisternoni di Albalonga e Porta Pretoria',date:'26 ottobre – 17 novembre 2024',anno:'2024',testo:'La luce negli spazi dei Cisternoni di Albalonga e di Porta Pretoria, a esaltarne la monumentalità e la stratificazione storica.',img:[9,19],hero:15},
   {slug:'barcellona',partner:P4,n:'III',nome:'Barcellona',luogo:'Barrio Gótico, Carrer de la Carabassa',date:'4 – 21 dicembre 2024',anno:'2024',testo:'Il Barrio Gótico immerso in un’esperienza visiva capace di connettere passato e presente attraverso la luce.',img:[19,26],hero:22},
   {slug:'terracina',comune:{nome:'Comune di Terracina',url:'https://www.comune.terracina.lt.it'},n:'IV',nome:'Terracina',luogo:'Oratorio dell’Angeletto, Tempio di Giove Anxur',date:'12 luglio – 31 agosto 2025',anno:null,testo:null,img:[0,0],hero:'__terracina'},
   {slug:'roma',partner:PR5,sponsor:SP5,comune:{nome:'Roma Capitale',url:'https://www.comune.roma.it'},n:'V',nome:'Roma',luogo:'Piazza Tevere, tra Ponte Sisto e Ponte Mazzini',date:'20 settembre – 15 ottobre 2025',anno:null,testo:null,img:[0,0],hero:'roma'}
  ];
  function tImgs(t){return LU.slice(t.img[0],t.img[1]);}
  function tHero(t){return t.hero==='roma'?'var(--img-luminis)':(typeof t.hero==='string'&&IMG[t.hero])?'url('+IMG[t.hero][0][0]+')':(t.hero!==null&&LU[t.hero]?'url('+LU[t.hero][0]+')':'');}
  document.getElementById('tappeList').innerHTML=TAPPE.map(function(t){var h=tHero(t);return '<a class="ex" href="#luminis-'+t.slug+'"><div class="img'+(h?'" style="background-image:'+h:' ph')+'"></div><span class="t1">'+t.n+' · '+esc(t.nome)+'</span><span class="t2">'+esc(t.luogo||'Luogo da inserire')+'</span><span class="t3">'+esc(t.date||'Date da inserire')+'</span></a>';}).join('');
  var PR=JSON.parse(document.getElementById('pressData').textContent);
  function pressRows(L){return '<div class="rows press-rows">'+L.map(function(p){return '<a class="go" href="'+esc(p.url)+'" target="_blank" rel="noopener"><span class="y">'+esc(p.mese||'')+'</span><span>'+esc(p.titolo)+' <span class="ext" aria-hidden="true">&#8599;</span></span><span class="w">'+esc(p.testata)+'</span><span class="w">'+esc(p.tipo)+'</span></a>';}).join('')+'</div>';}
  (function(){var y={},o=[];PR.forEach(function(p){var k=p.anno||'Senza data';if(!y[k]){y[k]=[];o.push(k);}y[k].push(p);});
    document.getElementById('stampaList').innerHTML=o.map(function(k){return '<div class="yblock"><h3 class="yh">'+k+'</h3>'+pressRows(y[k])+'</div>';}).join('')+'<p class="note">'+PR.length+' articoli trovati online. Se ne conosci altri, mandali e li aggiungo.</p>';
    var ex=PR.filter(function(p){return p.tema==='exitus';});document.getElementById('exitusPress').innerHTML=pressRows(ex);})();
  function renderTappa(slug){
    var t=TAPPE.filter(function(x){return x.slug===slug;})[0];if(!t)return false;
    var L=tImgs(t),h=tHero(t),g='';cur=L;
    L.forEach(function(x,i){g+='<figure class="gimg"><button type="button" data-i="'+i+'" aria-label="Ingrandisci immagine '+(i+1)+'"><img src="'+x[0]+'" width="'+x[2]+'" height="'+x[3]+'" alt="Luminis '+esc(t.nome)+', foto '+(i+1)+'" loading="lazy" decoding="async"></button></figure>';});
    var i=TAPPE.indexOf(t),nx=TAPPE[(i+1)%TAPPE.length];
    document.getElementById('tappaBody').innerHTML=(h?'<div class="exhero" style="background-image:'+h+'" role="img" aria-label="Luminis, '+esc(t.nome)+'"></div>':'<div style="height:calc(env(safe-area-inset-top,0px) + 64px)"></div>')+'<div class="wrap"><div class="exhead"><div><a class="back" href="#luminis">&larr; Luminis</a><br><span class="k lumk"><svg class=\"lumlogo\" viewBox=\"0 0 787 787\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"38\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M394 0V787M0 394H787M117 117L670 670M117 670L394 394M509 0V278H787\"/><path d=\"M360 326H394V394H322V356ZM326 394H462L470 444L456 458H332L318 444Z\" fill=\"currentColor\" stroke=\"none\"/></svg>Luminis · tappa '+t.n+'</span><h1>'+esc(t.nome)+'</h1></div><dl><div><dt>Luogo</dt><dd'+(t.luogo?'>'+esc(t.luogo):' class="ph-note">Da inserire')+'</dd></div><div><dt>Date</dt><dd'+(t.date?'>'+esc(t.date):' class="ph-note">Da inserire')+'</dd></div>'+(t.comune?'<div><dt>Con il Comune</dt><dd><a href="'+t.comune.url+'" target="_blank" rel="noopener">'+esc(t.comune.nome)+' ↗</a></dd></div>':'')+'</dl></div>'
      +'<section class="exsec prose"><p'+(t.testo?'>'+esc(t.testo):' class="ph-note">Qui andrà un breve testo su questa tappa.')+'</p></section>'
      +'<section class="exsec"><h2>Immagini</h2>'+(L.length?'<div class="gallery">'+g+'</div>':'<p class="note">'+(t.slug==='roma'?'Per ora c’è solo la foto in alto: le altre foto di Roma arriveranno.':'Le foto di questa tappa arriveranno.')+'</p>')+'</section>'
      +((t.partner&&t.partner.length)?'<section class="exsec partners"><h2>In collaborazione con</h2><ul class="plogos">'+t.partner.map(function(x){return '<li>'+(x.img?'<img src="'+x.img+'" alt="'+x.nome+'" loading="lazy">':'<span>'+x.nome+'</span>')+'</li>';}).join('')+'</ul></section>':'')+((t.sponsor&&t.sponsor.length)?'<section class="exsec partners"><h2>Sponsor tecnici</h2><ul class="plogos">'+t.sponsor.map(function(x){return '<li><img src="'+x.img+'" alt="'+x.nome+'" loading="lazy"></li>';}).join('')+'</ul></section>':'')+(function(){var L=PR.filter(function(p){return (' '+p.tema+' ').indexOf(' '+t.slug+' ')>=0;});return L.length?'<section class="exsec"><h2>Stampa</h2>'+pressRows(L)+'</section>':'';})()+'<p style="padding-block:0 64px"><a class="back" href="#luminis-'+nx.slug+'">Tappa successiva: '+esc(nx.nome)+' &rarr;</a></p></div>';
    return true;
  }
  document.getElementById('tappaBody').addEventListener('click',function(ev){var b=ev.target.closest('.gimg button');if(b)lbOpen(+b.getAttribute('data-i'));});
  window.addEventListener('hashchange',lbClose);
  function renderOpera(slug){
    var w=D.opere.filter(function(x){return x.slug===slug;})[0]; if(!w)return false;
    var L=IMG[w.slug]||[],g='';cur=L;
    if(L.length){L.forEach(function(x,i){g+='<figure class="gimg"><button type="button" data-i="'+i+'" aria-label="Ingrandisci immagine '+(i+1)+'"><img src="'+x[0]+'" width="'+x[2]+'" height="'+x[3]+'" alt="'+esc(w.titolo+(x[1]?', '+x[1]:''))+'" loading="lazy" decoding="async"></button>'+(x[1]?'<figcaption>'+esc(x[1])+'</figcaption>':'')+'</figure>';});}
    else{g='<figure class="gimg"><div class="ph"></div></figure>';}
    document.getElementById('operaBody').innerHTML='<a class="back" href="#opere">&larr; Opere</a><div class="exhead" style="padding-top:8px"><div><span class="k">'+w.anno+'</span><h1>'+esc(w.titolo)+'</h1></div><dl><div><dt>Anno</dt><dd>'+w.anno+'</dd></div><div><dt>Tecnica e dimensioni</dt><dd class="ph-note">Da inserire</dd></div>'+(w.video?'<div><dt>Video</dt><dd><a href="'+w.video+'" target="_blank" rel="noopener" style="border-bottom:1px solid currentColor">Guarda su Vimeo</a></dd></div>':'')+'</dl></div>'+(w.testo?'<section class="exsec prose">'+paras(w.testo)+'</section>':'')+'<section class="exsec"><h2>Immagini</h2><div class="gallery">'+g+'</div>'+(L.length?'':'<p class="note">'+(w.immagini?'Le foto di quest\'opera arriveranno con le prossime cartelle.':'Sul vecchio sito quest\'opera era solo nell\'elenco, senza immagini.')+'</p>')+'</section>';
    return true;
  }
  function route(){
    var h=location.hash.slice(1),id=V[h];
    if(!id&&h.indexOf('opera-')===0&&renderOpera(h.slice(6)))id='view-opera';
    if(!id&&h.indexOf('luminis-')===0&&renderTappa(h.slice(8)))id='view-tappa';
    var page=id?document.getElementById(id):null;
    main.hidden=!!page;
    Array.prototype.forEach.call(document.querySelectorAll('.view'),function(v){v.hidden=v!==page;});
    document.body.classList.toggle('inner',!!page);
    if(page){window.scrollTo(0,0);hdr.classList.add('solid');}
    else{var t=h&&document.getElementById(h); if(t)t.scrollIntoView(); else window.scrollTo(0,0);}
  }
  addEventListener('hashchange',route); route();
  var vm=document.getElementById('view-mostre');
  Array.prototype.forEach.call(vm.querySelectorAll('.tabs button'),function(b){
    b.addEventListener('click',function(){
      Array.prototype.forEach.call(vm.querySelectorAll('.tabs button'),function(o){o.setAttribute('aria-selected',String(o===b));});
      Array.prototype.forEach.call(vm.querySelectorAll('[data-p]'),function(p){p.hidden=p.dataset.p!==b.dataset.t;});
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-go]'),function(a){a.addEventListener('click',function(e){e.preventDefault();document.getElementById(a.dataset.go).scrollIntoView({behavior:'smooth'});});});
})();
(function(){
  var hdr=document.querySelector('header'),btn=document.getElementById('menuBtn'),panel=document.getElementById('panel');
  function onScroll(){hdr.classList.toggle('solid',document.body.classList.contains('inner')||scrollY>document.getElementById('hero').offsetHeight-80);}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  function close(){hdr.classList.remove('open');btn.setAttribute('aria-expanded','false');btn.textContent='Menu';}
  btn.addEventListener('click',function(){var o=!hdr.classList.contains('open');hdr.classList.toggle('open',o);btn.setAttribute('aria-expanded',String(o));btn.textContent=o?'Chiudi':'Menu';});
  Array.prototype.forEach.call(panel.querySelectorAll('a'),function(a){a.addEventListener('click',close);});
})();
(function(){
  var hero=document.getElementById('hero');
  // thin light lines, like light-framed edges crossing the dark room
  var mode='foto'; hero.dataset.mode=mode;
  function draw(){
    var w=hero.clientWidth,h=hero.clientHeight,seed=7,s='';
    function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
    if(mode==='mura'){
      // A: polygonal masonry, like the walls of Alatri lit by Luminis
      var cell=w<720?70:110,cols=Math.ceil(w/cell)+1,rows=Math.ceil(h/(cell*.8))+1,P=[];
      for(var r=0;r<=rows;r++){P[r]=[];for(var c=0;c<=cols;c++){P[r][c]=[c*cell+(rnd()-.5)*cell*.7+(r%2?cell*.35:0),r*cell*.8+(rnd()-.5)*cell*.55];}}
      for(r=0;r<rows;r++)for(c=0;c<cols;c++){
        var q=[P[r][c],P[r][c+1],P[r+1][c+1],P[r+1][c]];
        if(rnd()<.35){var m=[(q[1][0]+q[2][0])/2+(rnd()-.5)*12,(q[1][1]+q[2][1])/2];q.splice(2,0,m);} // a fifth corner on some stones
        var cx0=(q[0][0]+q[2][0])/2,cy0=(q[0][1]+q[2][1])/2;
        s+='<polygon stroke-width="1" points="'+q.map(function(p){return (cx0+(p[0]-cx0)*.94).toFixed(1)+','+(cy0+(p[1]-cy0)*.94).toFixed(1)}).join(' ')+'"/>';
      }
    } else if(mode==='segni'){
      // B: a field of Semeion signs taken from The Container
      var codes=['3P.1F.1S','1P.2E.1S','3P.1V.1S','1F.','FIRMA O VOLTO','3P.1F.1S (2)','////','1P.2E.1S'];
      var gx=w<720?120:170,gy=34;
      for(var y=24;y<h;y+=gy)for(var x=(y/gy%2)*gx/2-40;x<w;x+=gx){s+='<text x="'+x.toFixed(0)+'" y="'+y+'">'+codes[Math.floor(rnd()*codes.length)]+'</text>';}
    }
    ['linesDim','linesLit'].forEach(function(id){var el=document.getElementById(id);el.setAttribute('viewBox','0 0 '+w+' '+h);el.innerHTML=s;});
  }
  draw(); addEventListener('resize',draw);
  Array.prototype.forEach.call(hero.querySelectorAll('.modes button'),function(b){
    b.addEventListener('click',function(e){e.stopPropagation();mode=b.dataset.mode;hero.dataset.mode=mode;if(window.__light)set(window.__light[0],window.__light[1]);Array.prototype.forEach.call(hero.querySelectorAll('.modes button'),function(o){o.setAttribute('aria-pressed',String(o===b));});draw();});
  });

  var tx=.5,ty=.45,cx=.5,cy=.45,user=false,last=0;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Safari on iPhone does not repaint a mask when only a CSS variable changes,
  // so the light is written straight onto the layers.
  var lit=hero.querySelector('.lit'),halo=hero.querySelector('.halo'),litPhoto=hero.querySelector('.lit-photo');
  var touch=matchMedia('(hover: none)').matches;
  if(touch){hero.querySelector('.hint').innerHTML='Tocca e trascina la luce';}
  function set(x,y){
    var at=(x*100).toFixed(2)+'% '+(y*100).toFixed(2)+'%';
    var m= mode==='foto' ? 'none' : 'radial-gradient(circle at '+at+',#000 0,rgba(0,0,0,.55) 14%,transparent 34%)';
    lit.style.webkitMaskImage=m; lit.style.maskImage=m;
    var pm='radial-gradient(circle at '+at+',#000 0,rgba(0,0,0,.8) 18%,rgba(0,0,0,.35) 32%,transparent 48%)';
    litPhoto.style.webkitMaskImage=pm; litPhoto.style.maskImage=pm;
    window.__light=[x,y];
    halo.style.background= mode==='foto'
      ? 'radial-gradient(circle at '+at+',rgba(255,255,255,.14) 0,rgba(255,255,255,.04) 18%,transparent 36%)'
      : mode==='luce'
      ? 'radial-gradient(circle at '+at+',rgba(255,255,255,.42) 0,rgba(255,255,255,.16) 9%,rgba(255,255,255,.05) 22%,transparent 40%)'
      : 'radial-gradient(circle at '+at+',rgba(255,233,180,.13),transparent 28%)';
  }
  function aim(cx0,cy0){var r=hero.getBoundingClientRect();tx=(cx0-r.left)/r.width;ty=(cy0-r.top)/r.height;user=true;last=performance.now();}
  hero.addEventListener('pointermove',function(e){aim(e.clientX,e.clientY);});
  hero.addEventListener('pointerdown',function(e){aim(e.clientX,e.clientY);});
  hero.addEventListener('touchstart',function(e){var t=e.touches[0];aim(t.clientX,t.clientY);},{passive:true});
  hero.addEventListener('touchmove',function(e){var t=e.touches[0];aim(t.clientX,t.clientY);},{passive:true});
  hero.addEventListener('pointerleave',function(){if(!touch)user=false;});
  if(reduce){set(.3,.62);return;}
  function tick(t){
    if(!user||t-last>2500){ // drift on its own, slowly, when nobody is holding the light
      tx=.5+Math.sin(t/4200)*.34; ty=.55+Math.sin(t/3100)*.22;
    }
    cx+=(tx-cx)*.08; cy+=(ty-cy)*.08; set(cx,cy);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
