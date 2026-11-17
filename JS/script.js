(function(){
  var root=document.documentElement;
  function css(v){return getComputedStyle(root).getPropertyValue(v).trim()}
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}

  /* Tema (claro/escuro) */
  var TK='kauan-theme';
  try{var st=localStorage.getItem(TK);if(st==='dark'||st==='light')root.setAttribute('data-theme',st)}catch(e){}
  function current(){return root.getAttribute('data-theme')||(matchMedia('(prefers-color-scheme:light)').matches?'light':'dark')}

  /* Matrix rain */
  var c=document.getElementById('rain'),x=c.getContext('2d'),cols,drops,fs=16,fade,rain;
  var chars='01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}[]<>/;=+*#$%'.split('');
  function colors(){fade='rgba('+css('--fade')+',.1)';rain='rgb('+css('--rain')+')'}
  function size(){c.width=innerWidth;c.height=innerHeight;cols=Math.ceil(c.width/fs);drops=Array.from({length:cols},function(){return Math.random()*-50})}
  colors();size();addEventListener('resize',size);
  matchMedia('(prefers-color-scheme:light)').addEventListener('change',colors);
  document.getElementById('theme').addEventListener('click',function(){
    var n=current()==='dark'?'light':'dark';
    root.setAttribute('data-theme',n);
    try{localStorage.setItem(TK,n)}catch(e){}
    colors();
  });
  var last=0;
  function draw(t){
    requestAnimationFrame(draw);
    if(document.hidden||t-last<55)return;
    last=t;
    x.fillStyle=fade;x.fillRect(0,0,c.width,c.height);
    x.fillStyle=rain;x.font=fs+'px monospace';
    for(var i=0;i<cols;i++){
      x.fillText(chars[Math.random()*chars.length|0],i*fs,drops[i]*fs);
      if(drops[i]*fs>c.height&&Math.random()>.975)drops[i]=0;
      drops[i]++;
    }
  }
  if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(draw);

  /* Digitação */
  var roles=['Desenvolvedor Full Stack','Estudante de Cibersegurança','Linux • Kali Linux • Python','Código limpo, sistemas seguros'];
  var t=document.getElementById('typed'),ri=0,ci=0,del=false;
  (function type(){
    var w=roles[ri];
    t.textContent=w.slice(0,ci);
    if(!del&&ci===w.length){del=true;return setTimeout(type,1700)}
    if(del&&ci===0){del=false;ri=(ri+1)%roles.length}
    ci+=del?-1:1;setTimeout(type,del?35:70);
  })();

  /* Skills (nível em vez de porcentagem) */
  var skills=[
    ['HTML','Estrutura semântica e acessível','Avançado'],
    ['CSS','Layouts responsivos e animações','Avançado'],
    ['JavaScript','Lógica e interatividade na web','Intermediário'],
    ['Node.js','APIs e servidores','Intermediário'],
    ['Python','Automação, scripts e análise de dados','Avançado'],
    ['C','Ponteiros, memória e algoritmos','Intermediário'],
    ['Linux','Terminal, usuários, arquivos e acesso remoto','Avançado'],
    ['Kali Linux','Ambiente de testes e ferramentas de segurança','Intermediário'],
    ['Cibersegurança','Fundamentos, redes e hacking ético','Intermediário']
  ];
  var g=document.getElementById('skills-grid');
  skills.forEach(function(s){
    var d=document.createElement('div');d.className='card skill';
    d.innerHTML='<h3>'+s[0]+'<small class="lvl">'+s[2]+'</small></h3><p>'+s[1]+'</p>';
    g.appendChild(d);
  });

  /* Certificados: edite esta lista. Exemplo de item:
     {nome:'Nome do curso', inst:'DIO', ano:'2026', link:'https://...'} */
  var CERTS=[
    {nome:'Introdução à Cibersegurança',inst:'Cisco Networking Academy',ano:'2026'},
    {nome:'Introdução ao Hacking Ético e Testes de Penetração',inst:'Cisco Networking Academy',ano:'2026',tipo:'emblema'},
    {nome:'Princípios da Cibersegurança',inst:'DIO',ano:'2026'},
    {nome:'O Essencial Sobre Linux e Máquinas Virtuais',inst:'DIO',ano:'2026'},
    {nome:'Aprenda a Programar do Zero com JavaScript',inst:'DIO',ano:'2026'},
    {nome:'JavaScript para Web: HTML, CSS e APIs na Prática',inst:'DIO',ano:'2026'},
    {nome:'Crie um Site Simples usando HTML, CSS e JavaScript',inst:'Fundação Bradesco',ano:'2026'},
    {nome:'Fundamentos Node.js',inst:'DIO',ano:'2026'},
    {nome:'Fundamentos Essenciais de Python para Análise de Dados',inst:'DIO',ano:'2026'},
    {nome:'Introdução à Programação Orientada a Objetos com Python',inst:'DIO',ano:'2026'}
  ];
  var box=document.getElementById('certs');
  if(!CERTS.length){
    document.getElementById('certificados').hidden=true;
    document.querySelectorAll('a[href="#certificados"]').forEach(function(a){
      var li=a.closest('li');(li||a).hidden=true;
    });
  }else{
    CERTS.forEach(function(c){
      var a=document.createElement('article');a.className='card cert';
      var ok=/^https?:\/\//i.test(c.link||'');
      a.innerHTML='<span class="badge">✔ '+esc(c.tipo||'certificado')+'</span><h3>'+esc(c.nome)+'</h3><span class="meta">'+esc(c.inst)+(c.ano?' · '+esc(c.ano):'')+'</span>'+
        (ok?'<div class="actions"><a href="'+esc(c.link)+'" target="_blank" rel="noopener">&gt; ver</a></div>':'');
      box.appendChild(a);
    });
  }

  /* Link ativo no menu */
  var links={};
  document.querySelectorAll('nav li a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  var spy=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting||!links[e.target.id])return;
      Object.keys(links).forEach(function(k){links[k].classList.remove('active')});
      links[e.target.id].classList.add('active');
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('main section[id]').forEach(function(s){spy.observe(s)});

  document.getElementById('yr').textContent=new Date().getFullYear();
})();
