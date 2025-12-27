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

const form = document.getElementById("tokenForm");
const mensagem = document.getElementById("mensagem");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();

  // 🔒 Validação de e-mail duplicado
  const jaExiste = usuarios.some(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (jaExiste) {
    mensagem.textContent =
      "⚠️ Este e-mail já está cadastrado. Use a página de Usuários.";
    mensagem.style.color = "#facc15";
    return;
  }

  const token = gerarToken(8);

  mensagem.textContent = "⏳ Enviando token...";
  mensagem.style.color = "#2563eb";

  try {
    await emailjs.send("service_71ynuri", "template_s59yanr", {
      email,
      token,
    });

    usuarios.push({
      id: Date.now(),
      email,
      token,
      criadoEm: new Date().toLocaleString(),
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensagem.textContent = "✅ Usuário criado e token enviado!";
    mensagem.style.color = "#22c55e";
    form.reset();
  } catch (error) {
    console.error(error);
    mensagem.textContent = "❌ Erro ao enviar o e-mail.";
    mensagem.style.color = "#ef4444";
  }
});

function gerarToken(tamanho) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: tamanho }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}
