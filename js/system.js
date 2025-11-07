// js/carrinho.js - VERSÃO COMPLETA E LIMPA

// 🎯 DADOS DOS PRODUTOS
const produtosPadaria = [
    {
        id: 1,
        nome: "Pão Francês",
        preco: 0.50,
        categoria: "Pães",
        estoque: 100,
        descricao: "Fermentação natural, crocante por fora e macio por dentro",
        imagem: "images/produtos/pao-frances.jpg"
    },
    {
        id: 2,
        nome: "Pão Doce",
        preco: 1.00,
        categoria: "Pães",
        estoque: 50,
        descricao: "Farinha, açúcar e água - perfeito para o café da manhã",
        imagem: "images/produtos/pao-doce.jpg"
    },
    {
        id: 3,
        nome: "Pão Integral",
        preco: 3.50,
        categoria: "Pães",
        estoque: 30,
        descricao: "Farinha integral e grãos selecionados",
        imagem: "images/produtos/pao-integral.jpg"
    },
    {
        id: 4,
        nome: "Pão de Queijo",
        preco: 4.00,
        categoria: "Salgados",
        estoque: 80,
        descricao: "Tapioca e queijo parmesão - tradição mineira",
        imagem: "images/produtos/pao-de-queijo.jpg"
    },
    {
        id: 5,
        nome: "Bolo de Chocolate",
        preco: 5.00,
        categoria: "Doces",
        estoque: 15,
        descricao: "Chocolate e especiarias - irresistível",
        imagem: "images/produtos/bolo-de-chocolate.jpg"
    },
    {
        id: 6,
        nome: "Torta de Morango",
        preco: 6.50,
        categoria: "Doces",
        estoque: 12,
        descricao: "Morangos selecionados e creme belga",
        imagem: "images/produtos/torta-de-morango.jpg"
    },
    {
        id: 7,
        nome: "Café Expresso",
        preco: 0.50,
        categoria: "Bebidas",
        estoque: 200,
        descricao: "Grãos especiais - energia pura",
        imagem: "images/produtos/cafe-espresso.jpg"
    },
    {
        id: 8,
        nome: "Capuccino",
        preco: 4.50,
        categoria: "Bebidas",
        estoque: 60,
        descricao: "Café, leite, canela e chocolate",
        imagem: "images/produtos/cafe-capuccino.jpg"
    }
];

// 🛒 VARIÁVEIS DO CARRINHO
let carrinho = [];

// 🧮 FUNÇÕES BÁSICAS
function formatarMoeda(valor) {
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function calcularTotalCarrinho() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

function calcularQuantidadeItens() {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

function aplicarDesconto(subtotal, quantidade) {
    if (quantidade >= 10) {
        return subtotal * 0.90; // 10% de desconto
    } else if (quantidade >= 5) {
        return subtotal * 0.95; // 5% de desconto
    }
    return subtotal;
}

// 🎯 FUNÇÕES DO CARRINHO
function adicionarAoCarrinho(idProduto) {
    const produto = produtosPadaria.find(p => p.id === idProduto);
    
    if (!produto) {
        mostrarMensagem('❌ Produto não encontrado!', 'erro');
        return;
    }

    if (produto.estoque <= 0) {
        mostrarMensagem(`❌ ${produto.nome} está fora de estoque!`, 'erro');
        return;
    }

    // Verificar se já está no carrinho
    const itemExistente = carrinho.find(item => item.id === idProduto);
    
    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            ...produto,
            quantidade: 1
        });
    }
    
    // Atualizar estoque
    produto.estoque -= 1;
    
    atualizarInterface();
    mostrarMensagem(`✅ ${produto.nome} adicionado ao carrinho!`, 'sucesso');
}

function removerDoCarrinho(idProduto) {
    const item = carrinho.find(item => item.id === idProduto);
    
    if (item) {
        // Devolver ao estoque
        const produto = produtosPadaria.find(p => p.id === idProduto);
        produto.estoque += item.quantidade;
        
        carrinho = carrinho.filter(item => item.id !== idProduto);
        atualizarInterface();
        mostrarMensagem(`🗑️ ${item.nome} removido do carrinho!`, 'info');
    }
}

function alterarQuantidade(idProduto, novaQuantidade) {
    const item = carrinho.find(item => item.id === idProduto);
    const produto = produtosPadaria.find(p => p.id === idProduto);
    
    if (item && produto) {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(idProduto);
            return;
        }
        
        const diferenca = novaQuantidade - item.quantidade;
        
        if (produto.estoque < diferenca) {
            mostrarMensagem(`❌ Estoque insuficiente! Temos apenas ${produto.estoque} unidades.`, 'erro');
            return;
        }
        
        produto.estoque -= diferenca;
        item.quantidade = novaQuantidade;
        atualizarInterface();
    }
}

function limparCarrinho() {
    // Devolver todos os itens ao estoque
    carrinho.forEach(item => {
        const produto = produtosPadaria.find(p => p.id === item.id);
        if (produto) {
            produto.estoque += item.quantidade;
        }
    });
    
    carrinho = [];
    atualizarInterface();
    mostrarMensagem('🔄 Carrinho limpo!', 'info');
}

// 📊 ATUALIZAR INTERFACE
function atualizarInterface() {
    // Calcular totais
    const subtotal = calcularTotalCarrinho();
    const totalItens = calcularQuantidadeItens();
    const totalComDesconto = aplicarDesconto(subtotal, totalItens);
    const pontos = Math.floor(totalComDesconto);
    
    // Atualizar displays
    document.getElementById('totalCarrinho').textContent = formatarMoeda(totalComDesconto);
    document.getElementById('quantidadeItens').textContent = totalItens;
    document.getElementById('pontosGanhos').textContent = pontos;
    document.getElementById('descontoAplicado').textContent = formatarMoeda(subtotal - totalComDesconto);
    
    // Atualizar lista do carrinho
    const listaCarrinho = document.getElementById('listaCarrinho');
    if (listaCarrinho) {
        if (carrinho.length === 0) {
            listaCarrinho.innerHTML = '<div class="carrinho-vazio">😔 Seu carrinho está vazio</div>';
        } else {
            listaCarrinho.innerHTML = carrinho.map(item => `
                <div class="item-carrinho">
                    <img src="${item.imagem}" alt="${item.nome}" class="item-imagem" 
                         onerror="this.src='https://via.placeholder.com/60x60/FFB347/000000?text=${item.nome.substring(0,3)}'">
                    <div class="item-info">
                        <h4>${item.nome}</h4>
                        <p class="item-preco">${formatarMoeda(item.preco)} cada</p>
                    </div>
                    <div class="item-controles">
                        <button onclick="alterarQuantidade(${item.id}, ${item.quantidade - 1})" class="btn-quantidade">-</button>
                        <span class="quantidade">${item.quantidade}</span>
                        <button onclick="alterarQuantidade(${item.id}, ${item.quantidade + 1})" class="btn-quantidade">+</button>
                    </div>
                    <div class="item-total">
                        <strong>${formatarMoeda(item.preco * item.quantidade)}</strong>
                        <button onclick="removerDoCarrinho(${item.id})" class="btn-remover">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Mostrar/ocultar mensagem de carrinho vazio
    const carrinhoVazio = document.getElementById('carrinhoVazio');
    const carrinhoItens = document.getElementById('carrinhoItens');
    
    if (carrinhoVazio && carrinhoItens) {
        if (carrinho.length === 0) {
            carrinhoVazio.style.display = 'block';
            carrinhoItens.style.display = 'none';
        } else {
            carrinhoVazio.style.display = 'none';
            carrinhoItens.style.display = 'block';
        }
    }
    
    // Atualizar lista de produtos (estoque)
    atualizarListaProdutos();
}

// 🎯 CARREGAR PRODUTOS
function carregarProdutos() {
    const listaProdutos = document.getElementById('listaProdutos');
    
    if (!listaProdutos) {
        console.error('❌ Elemento listaProdutos não encontrado!');
        return;
    }
    
    listaProdutos.innerHTML = produtosPadaria.map(produto => `
        <div class="card-produto">
            <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem"
                 onerror="this.src='https://via.placeholder.com/80x80/FFB347/000000?text=${produto.nome.substring(0,3)}'">
            <div class="produto-info">
                <h4>${produto.nome}</h4>
                <p class="produto-descricao">${produto.descricao}</p>
                <p class="produto-preco">${formatarMoeda(produto.preco)}</p>
                <p class="produto-estoque ${produto.estoque < 10 ? 'estoque-baixo' : ''}">
                    📦 Estoque: ${produto.estoque} unidades
                </p>
            </div>
            <button onclick="adicionarAoCarrinho(${produto.id})" 
                    class="btn-adicionar"
                    ${produto.estoque === 0 ? 'disabled' : ''}>
                ${produto.estoque === 0 ? 'Fora de Estoque' : '+ Adicionar'}
            </button>
        </div>
    `).join('');
}

function atualizarListaProdutos() {
    carregarProdutos();
}

// 💬 SISTEMA DE MENSAGENS
function mostrarMensagem(mensagem, tipo = "sucesso") {
    // Remover mensagens anteriores
    const mensagensAntigas = document.querySelectorAll('.mensagem-flutuante');
    mensagensAntigas.forEach(msg => {
        if (document.body.contains(msg)) {
            document.body.removeChild(msg);
        }
    });
    
    // Criar nova mensagem
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = `mensagem-flotuante mensagem-${tipo}`;
    mensagemDiv.textContent = mensagem;
    
    document.body.appendChild(mensagemDiv);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (document.body.contains(mensagemDiv)) {
            document.body.removeChild(mensagemDiv);
        }
    }, 3000);
}

// 📦 FINALIZAR PEDIDO
function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarMensagem('❌ Seu carrinho está vazio! Adicione alguns produtos.', 'erro');
        return;
    }
    
    const subtotal = calcularTotalCarrinho();
    const totalItens = calcularQuantidadeItens();
    const totalComDesconto = aplicarDesconto(subtotal, totalItens);
    const pontos = Math.floor(totalComDesconto);
    
    // Criar modal de confirmação
    const modalHTML = `
        <div class="modal-pedido">
            <div class="modal-conteudo">
                <div class="modal-header">
                    <h3>🎉 Pedido Confirmado!</h3>
                    <button onclick="fecharModal()" class="btn-fechar">×</button>
                </div>
                
                <div class="modal-body">
                    <div class="pedido-info">
                        <p><strong>Número do Pedido:</strong> #${Date.now()}</p>
                        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
                    </div>
                    
                    <div class="itens-pedido">
                        <h4>📦 Itens do Pedido:</h4>
                        ${carrinho.map(item => `
                            <div class="item-pedido">
                                <span>${item.quantidade}x ${item.nome}</span>
                                <span>${formatarMoeda(item.preco * item.quantidade)}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="resumo-pedido">
                        <div class="total-line">
                            <span>Subtotal:</span>
                            <span>${formatarMoeda(subtotal)}</span>
                        </div>
                        ${subtotal !== totalComDesconto ? `
                        <div class="total-line desconto">
                            <span>Desconto:</span>
                            <span>-${formatarMoeda(subtotal - totalComDesconto)}</span>
                        </div>
                        ` : ''}
                        <div class="total-line destaque">
                            <span><strong>Total do Pedido:</strong></span>
                            <span><strong>${formatarMoeda(totalComDesconto)}</strong></span>
                        </div>
                        <div class="pontos-ganhos">
                            ⭐ <strong>${pontos} pontos</strong> ganhos na fidelidade!
                        </div>
                    </div>
                    
                    <div class="agradecimento">
                        <p>Obrigado pela sua compra! 🎂</p>
                        <p>Seu pedido será preparado com carinho.</p>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button onclick="fecharModalELimpar()" class="btn-modal-primario">
                        🏠 Continuar Comprando
                    </button>
                    <button onclick="imprimirPedido()" class="btn-modal-secundario">
                        🖨️ Imprimir Pedido
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// 🔧 FUNÇÕES DO MODAL
function fecharModal() {
    const modal = document.querySelector('.modal-pedido');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function fecharModalELimpar() {
    fecharModal();
    limparCarrinho();
}

function imprimirPedido() {
    window.print();
}

// 🎯 FILTRAR PRODUTOS POR CATEGORIA
function filtrarProdutos(categoria) {
    const produtosFiltrados = categoria === 'todos' 
        ? produtosPadaria 
        : produtosPadaria.filter(produto => produto.categoria === categoria);
    
    const listaProdutos = document.getElementById('listaProdutos');
    listaProdutos.innerHTML = produtosFiltrados.map(produto => `
        <div class="card-produto">
            <img src="${produto.imagem}" alt="${produto.nome}" class="produto-imagem"
                 onerror="this.src='https://via.placeholder.com/80x80/FFB347/000000?text=${produto.nome.substring(0,3)}'">
            <div class="produto-info">
                <h4>${produto.nome}</h4>
                <p class="produto-descricao">${produto.descricao}</p>
                <p class="produto-preco">${formatarMoeda(produto.preco)}</p>
                <p class="produto-estoque ${produto.estoque < 10 ? 'estoque-baixo' : ''}">
                    📦 Estoque: ${produto.estoque} unidades
                </p>
            </div>
            <button onclick="adicionarAoCarrinho(${produto.id})" 
                    class="btn-adicionar"
                    ${produto.estoque === 0 ? 'disabled' : ''}>
                ${produto.estoque === 0 ? 'Fora de Estoque' : '+ Adicionar'}
            </button>
        </div>
    `).join('');
}

// 🎯 INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
    // Configurar botões de categoria
    const botoesCategoria = document.querySelectorAll('.btn-categoria');
    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', function() {
            // Remover classe active de todos
            botoesCategoria.forEach(b => b.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            // Filtrar produtos
            const categoria = this.dataset.categoria;
            filtrarProdutos(categoria);
        });
    });
    
    // Carregar produtos iniciais
    carregarProdutos();
    atualizarInterface();
});