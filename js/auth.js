const form = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

if (localStorage.getItem("manterConectado") === "true") {
  localStorage.setItem("logado", "true");
  window.location.href = "dashboard.html";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value;
  const senha = document.getElementById("senha").value;
  const manter = document.getElementById("manter").checked;

  if (usuario === "admin" && senha === "123456") {
    localStorage.setItem("logado", "true");

    if (manter) {
      localStorage.setItem("manterConectado", "true");
    } else {
      localStorage.removeItem("manterConectado");
    }

    window.location.href = "dashboard.html";
  } else {
    mensagem.textContent = "❌ Usuário ou senha inválidos";
    mensagem.style.color = "red";
  }
});
