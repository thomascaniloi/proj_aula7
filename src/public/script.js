const API_URL = '/transacoes';

window.addEventListener('DOMContentLoaded', function () {
  const dashboard = document.getElementById('dashboard');
  const formulario = document.getElementById('formTransacao');
  const atualizar = document.getElementById('atualizar');

  if (dashboard) {
    carregarDashboard();
  }

  if (formulario) {
    formulario.addEventListener('submit', cadastrarTransacao);
  }

  if (atualizar) {
    atualizar.addEventListener('click', carregarDashboard);
  }
});

async function carregarDashboard() {
  const status = document.getElementById('statusDashboard');

  if (status) {
    definirStatus(status, 'Carregando informações...', '');
  }

  try {
    const resposta = await fetch(API_URL);

    if (!resposta.ok) {
      throw new Error('Não foi possível carregar os dados.');
    }

    const dados = await resposta.json();
    exibirMetricas(dados.metricas);
    exibirHistorico(dados.historico);

    if (status) {
      definirStatus(status, '', '');
    }
  } catch (erro) {
    if (status) {
      definirStatus(status, erro.message, 'erro');
    }
  }
}

function exibirMetricas(metricas) {
  document.getElementById('saldoTotal').textContent = formatarMoeda(metricas.saldoTotal);
  document.getElementById('totalDespesas').textContent = formatarMoeda(metricas.totalDespesas);
  document.getElementById('totalGastoImpulso').textContent = formatarMoeda(metricas.totalGastoImpulso);
}

function exibirHistorico(historico) {
  const lista = document.getElementById('historico');
  lista.innerHTML = '';

  if (!historico || historico.length === 0) {
    lista.innerHTML = '<p class="vazio">Nenhuma transação cadastrada.</p>';
    return;
  }

  historico.forEach(function (transacao) {
    const artigo = document.createElement('article');
    artigo.className = 'transacao';

    const informacoes = document.createElement('div');
    const titulo = document.createElement('h3');
    const detalhes = document.createElement('p');
    const selo = document.createElement('span');
    const valor = document.createElement('strong');

    titulo.textContent = transacao.descricao;
    detalhes.textContent = transacao.categoria + ' • ' + formatarData(transacao.createdAt);
    selo.className = transacao.consumoConsciente ? 'selo' : 'selo selo-impulso';
    selo.textContent = transacao.consumoConsciente ? 'Consciente' : 'Por impulso';

    valor.className = 'valor-transacao ' + (transacao.tipo === 'receita' ? 'valor-receita' : 'valor-despesa');
    valor.textContent = (transacao.tipo === 'receita' ? '+ ' : '- ') + formatarMoeda(transacao.valor);

    informacoes.appendChild(titulo);
    informacoes.appendChild(detalhes);
    informacoes.appendChild(selo);
    artigo.appendChild(informacoes);
    artigo.appendChild(valor);
    lista.appendChild(artigo);
  });
}

async function cadastrarTransacao(evento) {
  evento.preventDefault();

  const formulario = evento.currentTarget;
  const status = document.getElementById('statusFormulario');
  const tipoSelecionado = formulario.querySelector('input[name="tipo"]:checked');
  const consumoSelecionado = formulario.querySelector('input[name="consumoConsciente"]:checked');

  const transacao = {
    descricao: document.getElementById('descricao').value.trim(),
    valor: Number(document.getElementById('valor').value),
    tipo: tipoSelecionado.value,
    categoria: document.getElementById('categoria').value,
    consumoConsciente: consumoSelecionado.value === 'true',
  };

  definirStatus(status, 'Salvando transação...', '');

  try {
    const resposta = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transacao),
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível salvar a transação.');
    }

    formulario.reset();
    definirStatus(status, 'Transação cadastrada com sucesso.', 'sucesso');
  } catch (erro) {
    definirStatus(status, erro.message, 'erro');
  }
}

function definirStatus(elemento, mensagem, tipo) {
  elemento.textContent = mensagem;
  elemento.className = 'status';

  if (tipo === 'sucesso') {
    elemento.classList.add('status-sucesso');
  }

  if (tipo === 'erro') {
    elemento.classList.add('status-erro');
  }
}

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatarData(data) {
  if (!data) {
    return 'Data não informada';
  }

  return new Date(data).toLocaleDateString('pt-BR');
}
