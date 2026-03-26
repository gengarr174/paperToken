/* Alterna entre as abas de login e cadastro */
function switchAuthTab(activeTab) {
  document.getElementById('panel-login').classList.toggle('active', activeTab === 'login');
  document.getElementById('panel-register').classList.toggle('active', activeTab === 'register');
  document.getElementById('tab-login').classList.toggle('active', activeTab === 'login');
  document.getElementById('tab-register').classList.toggle('active', activeTab === 'register');
}

/* Abre automaticamente a aba de cadastro se o usuário veio dessa rota */
if (document.referrer.includes('/auth/register')) {
  switchAuthTab('register');
}

/* Alterna a visibilidade da senha (ícone de olho) */
function togglePasswordVisibility(inputId, button) {
  const inputField = document.getElementById(inputId);
  const isPassword = inputField.type === 'password';

  inputField.type = isPassword ? 'text' : 'password';

  button.innerHTML = isPassword
    ? '<i class="bi bi-eye-slash"></i>'
    : '<i class="bi bi-eye"></i>';
}

/* Controla exibição da chave de acesso (admin) */
let isRoleEnabled = false;

function toggleAccessKeyField() {
  isRoleEnabled = !isRoleEnabled;

  document.getElementById('role-sw').classList.toggle('on', isRoleEnabled);
  document.getElementById('key-field').classList.toggle('open', isRoleEnabled);

  // Reseta o campo ao desativar
  if (!isRoleEnabled) {
    const accessKeyInput = document.getElementById('rg-key');
    accessKeyInput.value = '';
    accessKeyInput.type = 'password';

    const eyeIcon = document.querySelector('#key-field .pass-eye');
    if (eyeIcon) eyeIcon.innerHTML = '<i class="bi bi-eye"></i>';
  }
}

/* Calcula e exibe a força da senha */
function updatePasswordStrength(password) {
  const strengthBar = document.getElementById('s-fill');
  const strengthLabel = document.getElementById('s-lbl');

  if (!password) {
    strengthBar.style.width = '0';
    strengthLabel.textContent = '';
    return;
  }

  let strengthScore = 0;

  // Critérios de força
  if (password.length >= 6) strengthScore++;
  if (password.length >= 10) strengthScore++;
  if (/[A-Z]/.test(password)) strengthScore++;
  if (/[0-9]/.test(password)) strengthScore++;
  if (/[^A-Za-z0-9]/.test(password)) strengthScore++;

  // Níveis de força
  const strengthLevels = [
    { width: '20%', color: '#e03131', label: 'Muito fraca' },
    { width: '40%', color: '#e67700', label: 'Fraca' },
    { width: '60%', color: '#f59f00', label: 'Média' },
    { width: '80%', color: '#3b5bdb', label: 'Boa' },
    { width: '100%', color: '#2f9e44', label: 'Forte' },
  ];

  const level = strengthLevels[Math.max(0, strengthScore - 1)];
  // Atualiza UI
  strengthBar.style.width = level.width;
  strengthBar.style.background = level.color;
  strengthLabel.style.color = level.color;
  strengthLabel.textContent = level.label;
}