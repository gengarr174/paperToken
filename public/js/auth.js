/* Alterna entre as abas de login e cadastro */
function switchTab(tab) {
  document.getElementById('panel-login').classList.toggle('active',    tab === 'login');
  document.getElementById('panel-register').classList.toggle('active', tab === 'register');
  document.getElementById('tab-login').classList.toggle('active',      tab === 'login');
  document.getElementById('tab-register').classList.toggle('active',   tab === 'register');
}

/* Abre automaticamente a aba de cadastro se o usuário veio dessa rota */
if (document.referrer.includes('/auth/register')) {
  switchTab('register');
}

/* Alterna a visibilidade da senha (ícone de olho) */
function toggleEye(inputId, btn) {
  const input = document.getElementById(inputId);
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  btn.innerHTML = isPass
    ? '<i class="bi bi-eye-slash"></i>'
    : '<i class="bi bi-eye"></i>';
}

/* Controla exibição da chave de acesso (admin) */
let roleOpen = false;
function toggleRole() {
  roleOpen = !roleOpen;
  document.getElementById('role-sw').classList.toggle('on', roleOpen);
  document.getElementById('key-field').classList.toggle('open', roleOpen);
  // Reseta o campo ao desativar
  if (!roleOpen) {
    const keyInput = document.getElementById('rg-key');
    keyInput.value = '';
    keyInput.type  = 'password';
    const eye = document.querySelector('#key-field .pass-eye');
    if (eye) eye.innerHTML = '<i class="bi bi-eye"></i>';
  }
}
/* Calcula e exibe a força da senha */
function checkStrength(val) {
  const fill = document.getElementById('s-fill');
  const lbl  = document.getElementById('s-lbl');
  if (!val) { fill.style.width = '0'; lbl.textContent = ''; return; }

  let score = 0;
  
  // Critérios de força
  if (val.length >= 6)           score++;
  if (val.length >= 10)          score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;
  // Níveis de força
  const levels = [
    { w: '20%',  c: '#e03131', t: 'Muito fraca' },
    { w: '40%',  c: '#e67700', t: 'Fraca'       },
    { w: '60%',  c: '#f59f00', t: 'Média'       },
    { w: '80%',  c: '#3b5bdb', t: 'Boa'         },
    { w: '100%', c: '#2f9e44', t: 'Forte'       },
  ];
  
  const l = levels[Math.max(0, score - 1)];
  fill.style.width      = l.w;
  fill.style.background = l.c;
  lbl.style.color       = l.c;
  lbl.textContent       = l.t;
}