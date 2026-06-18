
'use strict';


const dadosIniciais = [
    { id: 1, titulo: 'O Hobbit',         autor: 'J.R.R. Tolkien', status: 'Lido',      paginasLidas: 320, totalPaginas: 320, genero: 'Fantasia'           },
    { id: 2, titulo: 'Hábitos Atômicos', autor: 'James Clear',    status: 'Lendo',     paginasLidas: 150, totalPaginas: 320, genero: 'Autoajuda'           },
    { id: 3, titulo: 'Duna',             autor: 'Frank Herbert',  status: 'Quero Ler', paginasLidas: 0,   totalPaginas: 680, genero: 'Ficção Científica'   },
];

const STORAGE_KEY = 'devclub_livros';

function carregarLivros() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);   
    } catch (e) {
        console.warn('Erro ao ler localStorage.', e);
    }
    salvarLivros(dadosIniciais);
    return dadosIniciais.map(l => ({ ...l })); 
}

function salvarLivros(livros) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(livros)); 
}

function gerarId() {
    return Date.now();
}


function validarFormulario(dados) {
    const erros = [];
    if (!dados.titulo || dados.titulo.length < 2)      erros.push('Título: mínimo 2 caracteres.');
    if (!dados.autor  || dados.autor.length  < 2)      erros.push('Autor: mínimo 2 caracteres.');
    if (!dados.status)                                   erros.push('Selecione um status.');
    if (!dados.totalPaginas || dados.totalPaginas < 1)  erros.push('Total de páginas deve ser positivo.');
    if (dados.paginasLidas < 0 || dados.paginasLidas > dados.totalPaginas)
                                                         erros.push('Páginas lidas inválidas.');
    return { valido: erros.length === 0, erros };
}

function exibirFeedback(msg, tipo) {
    const el = document.getElementById('feedbackForm');
    el.textContent = msg;
    el.className = `feedback ${tipo}`;
    clearTimeout(el._t);
    el._t = setTimeout(limparFeedback, 4000);
}

function limparFeedback() {
    const el = document.getElementById('feedbackForm');
    if (el) el.className = 'feedback hidden';
}


function gerarEstrelas(n) {
    return [1,2,3,4,5].map(i => i <= n ? '★' : '☆').join(''); 
}

function criarCard(livro) {
    
    const card = document.createElement('div');
    card.className = 'card-livro';
    card.dataset.id = livro.id;

    
    const titulo = document.createElement('p');
    titulo.className = 'card-titulo';
    titulo.textContent = livro.titulo;
    card.appendChild(titulo); 

    const autor = document.createElement('p');
    autor.className = 'card-autor';
    autor.textContent = livro.autor;
    card.appendChild(autor);

    
    if (livro.genero) {
        const genero = document.createElement('span');
        genero.className = 'card-genero';
        genero.textContent = livro.genero;
        card.appendChild(genero);
    }

    
    const div1 = document.createElement('div');
    div1.className = 'card-divider';
    card.appendChild(div1);

    
    const select = document.createElement('select');
    select.className = 'card-select';
    
    select.innerHTML = `
        <option value="Quero Ler" ${livro.status === 'Quero Ler' ? 'selected' : ''}>📌 Quero Ler</option>
        <option value="Lendo"     ${livro.status === 'Lendo'     ? 'selected' : ''}>📖 Lendo</option>
        <option value="Lido"      ${livro.status === 'Lido'      ? 'selected' : ''}>✅ Lido</option>
    `;
    select.addEventListener('change', () => onStatusChange(livro.id, select.value)); 
    card.appendChild(select);

    
    if (livro.status === 'Lendo') {
        const pct = livro.totalPaginas > 0
            ? Math.round((livro.paginasLidas / livro.totalPaginas) * 100)
            : 0;

        const progWrap = document.createElement('div');
        progWrap.className = 'prog-wrap';
        progWrap.innerHTML = `
            <div class="prog-info">
                <label>Progresso</label>
                <span class="prog-pct" id="pct-${livro.id}">${pct}%</span>
            </div>
            <div class="prog-input-row">
                <input type="number"
                       class="input-paginas"
                       value="${livro.paginasLidas}"
                       min="0"
                       max="${livro.totalPaginas}">
                <span>/ ${livro.totalPaginas} pág.</span>
            </div>
            <div class="prog-bar-track">
                <div class="prog-bar-fill" id="bar-${livro.id}" style="width:${pct}%"></div>
            </div>
        `;

        const inputPag = progWrap.querySelector('.input-paginas');
        const barFill  = progWrap.querySelector(`#bar-${livro.id}`);
        const pctEl    = progWrap.querySelector(`#pct-${livro.id}`);

        
        inputPag.addEventListener('input', () => {
            onProgressoChange(livro.id, parseInt(inputPag.value) || 0, barFill, pctEl);
        });

        card.appendChild(progWrap);
    }

    
    if (livro.status === 'Lido') {
        const stars = document.createElement('div');
        stars.className = 'card-stars';
        stars.textContent = gerarEstrelas(5);
        card.appendChild(stars);
    }

    
    const div2 = document.createElement('div');
    div2.className = 'card-divider';
    card.appendChild(div2);

    
    const btnRemover = document.createElement('button');
    btnRemover.className = 'btn-remover';
    btnRemover.textContent = 'Remover';
    btnRemover.addEventListener('click', () => onRemover(livro.id)); 
    card.appendChild(btnRemover);

    return card;
}

function renderizarKanban(livros) {
    const zonas = {
        'Quero Ler': document.getElementById('cardsQueroLer'),
        'Lendo':     document.getElementById('cardsLendo'),
        'Lido':      document.getElementById('cardsLido'),
    };

    
    Object.values(zonas).forEach(z => { z.innerHTML = ''; }); 

    
    const grupos = {
        'Quero Ler': livros.filter(l => l.status === 'Quero Ler'),
        'Lendo':     livros.filter(l => l.status === 'Lendo'),
        'Lido':      livros.filter(l => l.status === 'Lido'),
    };

    
    Object.entries(grupos).forEach(([status, grupo]) => {
        const zona = zonas[status];
        if (grupo.length === 0) {
            
            const vazio = document.createElement('div');
            vazio.className = 'col-vazio';
            vazio.innerHTML = `<span class="col-vazio-icon">📭</span>Nenhum livro aqui.`;
            zona.appendChild(vazio);
        } else {
            grupo.forEach(livro => zona.appendChild(criarCard(livro))); 
        }
    });

    atualizarContadores(livros);
    atualizarProgressoGlobal(livros);
}

function atualizarContadores(livros) {
    
    document.getElementById('badgeQueroLer').textContent = livros.filter(l => l.status === 'Quero Ler').length;
    document.getElementById('badgeLendo').textContent    = livros.filter(l => l.status === 'Lendo').length;
    document.getElementById('badgeLido').textContent     = livros.filter(l => l.status === 'Lido').length;
}

function atualizarProgressoGlobal(livros) {
    const label = document.getElementById('labelProgresso');
    const fill  = document.getElementById('progFill');

    if (livros.length === 0) {
        label.textContent = 'Nenhum livro cadastrado.';
        fill.style.width = '0%';
        return;
    }

    
    const totalPag  = livros.reduce((acc, l) => acc + l.totalPaginas,  0);
    const lidasPag  = livros.reduce((acc, l) => acc + l.paginasLidas,  0);
    const pct       = totalPag > 0 ? Math.round((lidasPag / totalPag) * 100) : 0;
    const qtdLidos  = livros.filter(l => l.status === 'Lido').length; 

    label.textContent = `${pct}% lido · ${qtdLidos} de ${livros.length} livros concluídos`;
    fill.style.width  = `${pct}%`;
}


function setupFormulario() {
    const form = document.getElementById('formLivro');

    
    form.addEventListener('submit', function (e) {
        e.preventDefault(); 

        const dados = {
            titulo:       document.getElementById('fTitulo').value.trim(),
            autor:        document.getElementById('fAutor').value.trim(),
            status:       document.getElementById('fStatus').value,
            genero:       document.getElementById('fGenero').value.trim(),
            totalPaginas: parseInt(document.getElementById('fTotalPaginas').value) || 0,
            paginasLidas: parseInt(document.getElementById('fPaginasLidas').value) || 0,
        };

        const { valido, erros } = validarFormulario(dados);

        if (!valido) {
            exibirFeedback('⚠ ' + erros.join(' '), 'erro');
            return;
        }

        const livros = carregarLivros();
        livros.push({ id: gerarId(), ...dados }); 
        salvarLivros(livros);
        renderizarKanban(livros);
        exibirFeedback(`"${dados.titulo}" adicionado!`, 'sucesso');
        form.reset();
    });
}

function setupFormToggle() {
    const toggle = document.getElementById('formToggle');
    const body   = document.getElementById('formBody');
    const icon   = document.getElementById('toggleIcon');

    toggle.addEventListener('click', () => { 
        body.classList.toggle('fechado');
        icon.classList.toggle('aberto');
    });
}

function onStatusChange(id, novoStatus) {
    const livros = carregarLivros();
    const livro  = livros.find(l => l.id === id); 
    if (!livro) return;

    livro.status = novoStatus;
    if (novoStatus === 'Lido')      livro.paginasLidas = livro.totalPaginas;
    if (novoStatus === 'Quero Ler') livro.paginasLidas = 0;

    salvarLivros(livros);
    renderizarKanban(livros);
}

function onProgressoChange(id, paginaAtual, barFill, pctEl) {
    const livros = carregarLivros();
    const livro  = livros.find(l => l.id === id); 
    if (!livro) return;

    const pagValida = Math.max(0, Math.min(paginaAtual, livro.totalPaginas));
    livro.paginasLidas = pagValida;

    const pct = livro.totalPaginas > 0
        ? Math.round((pagValida / livro.totalPaginas) * 100)
        : 0;

    
    barFill.style.width = `${pct}%`;
    pctEl.textContent   = `${pct}%`;

    salvarLivros(livros);
    atualizarProgressoGlobal(livros);
}

function onRemover(id) {
    let livros = carregarLivros();
    const livro = livros.find(l => l.id === id);
    const titulo = livro ? livro.titulo : 'Livro';

    livros = livros.filter(l => l.id !== id); 
    salvarLivros(livros);
    renderizarKanban(livros);
    exibirFeedback(`"${titulo}" removido.`, 'sucesso');
}

function onSortear() {
    const livros   = carregarLivros();
    const queroLer = livros.filter(l => l.status === 'Quero Ler'); 

    if (queroLer.length === 0) {
        exibirFeedback('Nenhum livro em "Quero Ler". Adicione alguns!', 'erro');
        return;
    }

    
    const sorteado = queroLer[Math.floor(Math.random() * queroLer.length)];

    document.getElementById('modalTitulo').textContent = sorteado.titulo;
    document.getElementById('modalAutor').textContent  = sorteado.autor;
    document.getElementById('modalTotal').textContent  =
        `${sorteado.totalPaginas} páginas${sorteado.genero ? ' · ' + sorteado.genero : ''}`;

    document.getElementById('modalSorteio').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('modalSorteio').classList.add('hidden');
}

function setupEventos() {
    document.getElementById('btnSortear').addEventListener('click', onSortear);
    document.getElementById('btnFecharModal').addEventListener('click', fecharModal);
    document.getElementById('modalSorteio').addEventListener('click', function (e) {
        if (e.target === this) fecharModal();
    });
}


function init() {
    const livros = carregarLivros();
    renderizarKanban(livros);
    setupFormulario();
    setupFormToggle();
    setupEventos();
}

window.addEventListener('DOMContentLoaded', init); 
