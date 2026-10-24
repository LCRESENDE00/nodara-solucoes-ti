/* Nodara: navegação e componentes compartilhados entre a marca, o Support e o Hardware.
   Cada página carrega este arquivo com <script src=".../shared/nodara.js" defer> e marca
   onde está com <html data-pagina="marca|sobre|contato|support|hardware">. */
(function(){
  var CONFIG = {
    // Domínios de produção. São exemplos de arquitetura: troque pelos domínios registrados.
    dominios: { marca: 'nodara.com.br', support: 'support.nodara.com.br', hardware: 'hardware.nodara.com.br' },
    // Subdomínios para testar localmente com `npm run dev` (o navegador resolve *.localhost sozinho).
    dominiosLocais: { marca: 'nodara.localhost', support: 'support.localhost', hardware: 'hardware.localhost' },
    cidade: 'Belo Horizonte – MG',
    whatsapp: '',   // só números, com 55 e DDD. Ex.: 5531999999999
    email: ''
  };

  // página -> [área (host), caminho dentro da área]
  var PAGINAS = {
    marca: ['marca', ''],
    sobre: ['marca', 'sobre/'],
    contato: ['marca', 'contato/'],
    support: ['support', ''],
    hardware: ['hardware', '']
  };

  // ---------- resolução de endereços ----------
  // "producao": cada área no seu subdomínio (nodara.com.br, support..., hardware...)
  // "local":    o mesmo, com *.localhost (npm run dev)
  // "caminho":  tudo num endereço só, em pastas (/, /support/, /hardware/): GitHub Pages, file:// e qualquer servidor estático
  var script = document.currentScript;
  var raiz = new URL('../', script ? script.src : location.href);
  var host = location.hostname.replace(/^www\./, '');
  function areaDoHost(mapa){ for (var k in mapa) if (mapa[k] === host) return k; return null; }
  var modo = areaDoHost(CONFIG.dominios) ? 'producao' : areaDoHost(CONFIG.dominiosLocais) ? 'local' : 'caminho';

  function url(pagina, hash){
    var p = PAGINAS[pagina] || PAGINAS.marca, area = p[0], caminho = p[1], u;
    if (modo === 'caminho') {
      u = new URL((area === 'marca' ? '' : area + '/') + caminho, raiz).href;
      if (location.protocol === 'file:') u += 'index.html';
    } else {
      var hosts = modo === 'producao' ? CONFIG.dominios : CONFIG.dominiosLocais;
      u = location.protocol + '//' + hosts[area] + (location.port ? ':' + location.port : '') + '/' + caminho;
    }
    return u + (hash || '');
  }

  var paginaAtual = document.documentElement.getAttribute('data-pagina') || 'marca';
  function atual(pagina){ return pagina === paginaAtual ? ' aria-current="page"' : ''; }

  function logo(escuro){
    var traco = escuro ? '#fff' : '#0B0A12', roxo = escuro ? '#A78BFA' : '#5B21B6', laranja = escuro ? '#FB923C' : '#C2410C';
    return '<a href="' + url('marca') + '" class="nd-logo" aria-label="NODARA, página principal">' +
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 25V7l18 18V7" fill="none" stroke="' + traco + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle cx="7" cy="25" r="3.7" fill="' + roxo + '"/><circle cx="7" cy="7" r="3.7" fill="' + traco + '"/>' +
      '<circle cx="25" cy="25" r="3.7" fill="' + traco + '"/><circle cx="25" cy="7" r="3.7" fill="' + laranja + '"/></svg>' +
      '<span>NODARA</span></a>';
  }

  function linksPrincipais(){
    return '<a href="' + url('support') + '"' + atual('support') + '><span class="dot dot-support" aria-hidden="true"></span>Support</a>' +
      '<a href="' + url('hardware') + '"' + atual('hardware') + '><span class="dot dot-hardware" aria-hidden="true"></span>Hardware</a>' +
      '<a href="' + url('sobre') + '"' + atual('sobre') + '>Sobre a Nodara</a>' +
      '<a href="' + url('contato') + '"' + atual('contato') + '>Contato</a>';
  }

  // ---------- <nodara-header>: barra da marca + (opcional) barra de seções da área ----------
  class NodaraHeader extends HTMLElement {
  connectedCallback(){
    if (this.querySelector('.nd-bar')) return;
    var secoes = Array.prototype.slice.call(this.childNodes);
    var header = document.createElement('header');
    header.className = 'nd-header';
    header.innerHTML =
      '<a href="#conteudo" class="skip">Pular para o conteúdo</a>' +
      '<div class="nd-bar"><div class="container">' + logo(false) +
        '<nav class="nd-nav" aria-label="Áreas da Nodara">' + linksPrincipais() + '</nav>' +
        '<button type="button" class="nd-menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="nd-menu">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '</div>' +
      '<nav class="nd-mobile" id="nd-menu" aria-label="Menu">' + linksPrincipais() + '</nav></div>';
    secoes.forEach(function(n){ header.appendChild(n); });
    this.appendChild(header);

    // no celular as seções da área entram no menu, abaixo das áreas da marca
    var areaNav = header.querySelector('.area-nav');
    if (areaNav) {
      var titulo = document.createElement('p');
      titulo.className = 'nd-mobile-title';
      titulo.textContent = 'Nesta página';
      var menuMobile = header.querySelector('.nd-mobile');
      menuMobile.appendChild(titulo);
      areaNav.querySelectorAll('a').forEach(function(a){ menuMobile.appendChild(a.cloneNode(true)); });
    }

    var btn = header.querySelector('.nd-menu-btn'), menu = header.querySelector('.nd-mobile');
    function fechar(){ menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-label', 'Abrir menu'); }
    btn.addEventListener('click', function(){
      var aberto = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
      btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
    menu.addEventListener('click', function(e){ if (e.target.closest('a')) fechar(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && menu.classList.contains('open')) { fechar(); btn.focus(); } });
  }
  }

  // ---------- <nodara-footer>: rodapé com as três áreas; o conteúdo próprio da página (créditos) vai no fim ----------
  class NodaraFooter extends HTMLElement {
  connectedCallback(){
    if (this.querySelector('.footer')) return;
    var extras = Array.prototype.slice.call(this.childNodes);
    function item(pagina, hash, texto){ return '<li><a href="' + url(pagina, hash) + '"' + (hash ? '' : atual(pagina)) + '>' + texto + '</a></li>'; }
    var footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = '<div class="container">' +
      '<div class="footer-top">' +
        '<div>' + logo(true) + '<p class="footer-tag">Soluções em TI para pessoas e empresas · ' + CONFIG.cidade + '</p></div>' +
        '<div class="footer-cols">' +
          '<nav aria-labelledby="ft-support"><h2 id="ft-support"><span class="dot dot-support" aria-hidden="true"></span>Nodara Support</h2><ul>' +
            item('support', '', 'Início do Support') + item('support', '#servicos', 'Redes e segurança') +
            item('support', '#desenvolvimento', 'Desenvolvimento') + item('support', '#planos', 'Planos mensais') +
            item('support', '#contato', 'Pedir diagnóstico') + '</ul></nav>' +
          '<nav aria-labelledby="ft-hardware"><h2 id="ft-hardware"><span class="dot dot-hardware" aria-hidden="true"></span>Nodara Hardware</h2><ul>' +
            item('hardware', '', 'Início do Hardware') + item('hardware', '#servicos', 'Impressoras 3D') +
            item('hardware', '#computadores', 'Computadores e eletrônica') + item('hardware', '#sintomas', 'Diagnóstico por sintoma') +
            item('hardware', '#contato', 'Pedir orçamento') + '</ul></nav>' +
          '<nav aria-labelledby="ft-marca"><h2 id="ft-marca">Nodara</h2><ul>' +
            item('marca', '', 'Página principal') + item('sobre', '', 'Sobre a Nodara') + item('contato', '', 'Contato') + '</ul></nav>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© ' + new Date().getFullYear() + ' Nodara Soluções em TI · ' + CONFIG.cidade + '</span></div>' +
    '</div>';
    var container = footer.querySelector('.container');
    extras.forEach(function(n){ container.appendChild(n); });
    this.appendChild(footer);
  }
  }

  customElements.define('nodara-header', NodaraHeader);
  customElements.define('nodara-footer', NodaraFooter);

  // ---------- links entre áreas escritos no HTML ----------
  // <a href="../hardware/#contato" data-site="hardware" data-hash="#contato">: o href relativo funciona sem JS
  // no modo "caminho"; aqui ele é trocado pelo endereço certo do ambiente (subdomínio, file://...).
  function ajustarLinks(){
    document.querySelectorAll('a[data-site]').forEach(function(a){
      a.href = url(a.getAttribute('data-site'), a.getAttribute('data-hash') || '');
    });
    document.querySelectorAll('[data-canal]').forEach(function(el){
      var canal = el.getAttribute('data-canal');
      if (canal === 'whatsapp' && CONFIG.whatsapp) el.innerHTML = '<a href="https://wa.me/' + CONFIG.whatsapp + '" target="_blank" rel="noopener">WhatsApp</a>';
      else if (canal === 'email' && CONFIG.email) el.innerHTML = '<a href="mailto:' + CONFIG.email + '">' + CONFIG.email + '</a>';
      else if (canal === 'cidade') el.textContent = CONFIG.cidade;
      else if (el.closest('[data-canal-item]')) el.closest('[data-canal-item]').remove();
    });
  }

  // ---------- animação ao rolar ----------
  function revelar(){
    var els = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px' });
      els.forEach(function(el){ io.observe(el); });
    } else { els.forEach(function(el){ el.classList.add('in'); }); }
  }

  // ---------- formulários: monta o pedido, marca a área (Support ou Hardware) e copia ----------
  function formularios(){
    document.querySelectorAll('form[data-pedido]').forEach(function(form){
      var status = form.querySelector('.form-status');
      form.addEventListener('submit', function(e){
        e.preventDefault();
        if (!form.reportValidity()) return;
        var data = new FormData(form);
        var linhas = ['Pedido – ' + form.getAttribute('data-pedido')];
        if (form.getAttribute('data-area')) linhas.push('Área: ' + form.getAttribute('data-area'));
        form.querySelectorAll('[name]').forEach(function(f){
          var v = (data.get(f.name) || '').toString().trim();
          if (v) linhas.push((f.getAttribute('data-label') || f.name) + ': ' + v);
        });
        var texto = linhas.join('\n');
        function ok(){ status.textContent = 'Pedido copiado. Agora é só colar na conversa com a Nodara.'; }
        function fallback(){
          var ta = document.createElement('textarea');
          ta.value = texto; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); ok(); } catch (err) { status.textContent = 'Não foi possível copiar automaticamente.'; }
          document.body.removeChild(ta);
        }
        if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(texto).then(ok, fallback); } else { fallback(); }
      });
    });
  }

  function iniciar(){ ajustarLinks(); revelar(); formularios(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();

  window.Nodara = { url: url, config: CONFIG, modo: modo };
})();
