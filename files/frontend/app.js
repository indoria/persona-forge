// Handles login, chat, persona, mode, and API calls

const API_BASE = "http://localhost:5000/api";
let jwtToken = localStorage.getItem('token') || null;

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("login-form")) {
    loginInit();
  }
  if (document.getElementById("chat-section")) {
    loadPersonas();
    chatInit();
  }
});

function loginInit() {
  const loginForm = document.getElementById("login-form");
  const otpForm = document.getElementById("otp-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    await fetch(`${API_BASE}/auth/request_otp`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, phone })
    });
    loginForm.style.display = "none";
    otpForm.style.display = "block";
  });

  otpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = document.getElementById("otp").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const res = await fetch(`${API_BASE}/auth/verify_otp`, {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email, phone, otp })
    });
    const data = await res.json();
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      window.location.href = "index.html";
    } else {
      alert("Invalid OTP");
    }
  });
}

function loadPersonas() {
  fetch(`${API_BASE}/persona/`, {
    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
  })
    .then(res => res.json())
    .then(personas => {
      const select = document.getElementById("persona-select");
      personas.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.innerText = p.name;
        select.appendChild(opt);
      });
    });
}

function chatInit() {
  const chatLog = document.getElementById("chat-log");
  const sendBtn = document.getElementById("send-btn");
  const userInput = document.getElementById("user-input");
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", e => {
    if (e.key === 'Enter') sendMessage();
  });

  function sendMessage() {
    const input = userInput.value;
    const persona = document.getElementById("persona-select").value;
    const mode = document.getElementById("mode-select").value;
    if (!input || !persona) return;
    chatLog.innerHTML += `<div class="user-msg">${input}</div>`;
    userInput.value = "";
    fetch(`${API_BASE}/conversation/`, {
      method: "POST",
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input,
        persona_id: persona,
        mode
      })
    })
      .then(res => res.json())
      .then(data => {
        chatLog.innerHTML += `<div class="ai-msg">${data.response}</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
      });
  }
}