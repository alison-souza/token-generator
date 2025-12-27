// Proteção
if (localStorage.getItem("logado") !== "true") {
  window.location.href = "login.html";
}

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("logado");
  localStorage.removeItem("manterConectado");
  window.location.href = "login.html";
});

const tabela = document.getElementById("tabelaUsuarios");
const busca = document.getElementById("busca");
const vazio = document.getElementById("vazio");
const feedback = document.getElementById("feedback");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// 🔁 Renderização
function renderizar(lista) {
  tabela.innerHTML = "";

  if (lista.length === 0) {
    vazio.textContent = "Nenhum usuário encontrado.";
    return;
  }

  vazio.textContent = "";

  lista.forEach((u) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${u.email}</td>
        <td>${u.token}</td>
        <td>
          <button onclick="novoToken(${u.id})">🔁 Novo Token</button>
          <button onclick="editarEmail(${u.id})">✏️ Editar</button>
          <button onclick="excluirUsuario(${u.id})">🗑️ Excluir</button>
        </td>
      `;

    tabela.appendChild(tr);
  });
}

// 🔍 Busca
busca.addEventListener("input", () => {
  const termo = busca.value.toLowerCase();
  renderizar(usuarios.filter((u) => u.email.toLowerCase().includes(termo)));
});

// 🔁 Novo token + envio de e-mail
async function novoToken(id) {
  const usuario = usuarios.find((u) => u.id === id);
  if (!usuario) return;

  const novo = gerarToken(8);
  mostrarFeedback("Enviando novo token...", "loading");

  try {
    await emailjs.send("SEU_SERVICE_ID_AQUI", "SEU_TEMPLATE_ID_AQUI", {
      email: usuario.email,
      token: novo,
    });

    usuario.token = novo;
    salvar();
    renderizar(usuarios);
    mostrarFeedback("Novo token enviado!", "sucesso");
  } catch {
    mostrarFeedback("Erro ao enviar e-mail.", "erro");
  }
}

// ✏️ Editar e-mail
function editarEmail(id) {
  const novoEmail = prompt("Digite o novo e-mail:");
  if (!novoEmail) return;

  usuarios = usuarios.map((u) =>
    u.id === id ? { ...u, email: novoEmail } : u
  );

  salvar();
  renderizar(usuarios);
}

// 🗑️ Excluir usuário
function excluirUsuario(id) {
  if (!confirm("Deseja realmente excluir este usuário?")) return;

  usuarios = usuarios.filter((u) => u.id !== id);
  salvar();
  renderizar(usuarios);
  mostrarFeedback("Usuário removido.", "sucesso");
}

// 🧠 Utilidades
function gerarToken(tamanho) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: tamanho }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

function salvar() {
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
}

function mostrarFeedback(msg, tipo) {
  feedback.textContent = msg;
  feedback.className = `feedback ${tipo}`;
  feedback.classList.remove("hidden");

  if (tipo !== "loading") {
    setTimeout(() => feedback.classList.add("hidden"), 3000);
  }
}

renderizar(usuarios);
