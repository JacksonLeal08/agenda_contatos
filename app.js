const form = document.getElementById("contact-form");
const tabela = document.querySelector("#agenda tbody");
const nomeInput = document.getElementById("nome");
const telefoneInput = document.getElementById("telefone");
const categoriaInput = document.getElementById("categoria");
const whatsappInput = document.getElementById("whatsapp");
const submitBtn = document.getElementById("submit-btn");

let contatos = JSON.parse(localStorage.getItem("contatos")) || [];
let indexEditando = null;

const emojiCategoria = {
  "Família": "👨‍👩‍👧‍👦",
  "Amigos": "🧑‍🤝‍🧑",
  "Trabalho": "💼",
  "Favorito": "⭐",
  "Outros": "📌"
};

// Formatação automática do telefone
telefoneInput.addEventListener("input", function () {
  let valor = telefoneInput.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);

  if (valor.length >= 2 && valor.length <= 6) {
    telefoneInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else if (valor.length > 6) {
    telefoneInput.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  } else {
    telefoneInput.value = valor;
  }
});

function salvarContatos() {
  localStorage.setItem("contatos", JSON.stringify(contatos));
}

function renderizarTabela() {
  tabela.innerHTML = "";

  contatos.forEach((contato, index) => {
    const linha = tabela.insertRow();

    linha.insertCell(0).textContent = contato.nome;

    linha.insertCell(1).innerHTML = contato.telefone + (contato.whatsapp ? ' <img src="imagem/whatsapp.png" alt="WhatsApp" style="height:20px; vertical-align:middle; margin-left:5px;">' : '');

    const categoriaComEmoji = `${emojiCategoria[contato.categoria] || ""} ${contato.categoria}`;
    linha.insertCell(2).textContent = categoriaComEmoji;

    const celulaAcoes = linha.insertCell(3);
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.className = "acao-btn editar";
    btnEditar.onclick = () => carregarContatoParaEdicao(index);

    const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.className = "acao-btn excluir";
    btnExcluir.onclick = () => excluirContato(index);

    celulaAcoes.appendChild(btnEditar);
    celulaAcoes.appendChild(btnExcluir);
  });
}

function adicionarContato(nome, telefone, categoria, whatsapp) {
  contatos.push({ nome, telefone, categoria, whatsapp });
  salvarContatos();
  renderizarTabela();
}

function excluirContato(index) {
  if (confirm("Tem certeza que deseja excluir este contato?")) {
    contatos.splice(index, 1);
    salvarContatos();
    renderizarTabela();
    limparFormulario();
  }
}

function carregarContatoParaEdicao(index) {
  const contato = contatos[index];
  nomeInput.value = contato.nome;
  telefoneInput.value = contato.telefone;
  categoriaInput.value = contato.categoria;
  whatsappInput.checked = contato.whatsapp;
  indexEditando = index;
  submitBtn.textContent = "Salvar edição";
}

function atualizarContato(index, nome, telefone, categoria, whatsapp) {
  contatos[index] = { nome, telefone, categoria, whatsapp };
  salvarContatos();
  renderizarTabela();
  limparFormulario();
}

function limparFormulario() {
  form.reset();
  indexEditando = null;
  submitBtn.textContent = "Cadastrar";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = nomeInput.value.trim();
  const telefone = telefoneInput.value.trim();
  const categoria = categoriaInput.value;
  const whatsapp = whatsappInput.checked;

  if (!nome || !telefone || !categoria) {
    alert("Preencha todos os campos.");
    return;
  }

  if (indexEditando !== null) {
    atualizarContato(indexEditando, nome, telefone, categoria, whatsapp);
  } else {
    adicionarContato(nome, telefone, categoria, whatsapp);
  }

  limparFormulario();
});

document.getElementById("cancelar-btn").addEventListener("click", function () {
  limparFormulario();
});

document.getElementById("limpar-lista-btn").addEventListener("click", function () {
  if (confirm("Tem certeza que deseja apagar todos os contatos?")) {
    contatos = [];
    salvarContatos();
    renderizarTabela();
    limparFormulario();
  }
});

renderizarTabela();
