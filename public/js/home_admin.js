/* Abre modal de edição para admin (banir/desbanir usuário) */
function openAdminEditModal(userId, userName, newStatus) {
  const inputUserId = document.getElementById('eid');
  const inputStatus = document.getElementById('estatus');
  const modalTitle = document.getElementById('mEditTitle');
  const modalMessage = document.getElementById('mEditMsg');
  const actionButton = document.getElementById('mEditBtn');
  const modal = document.getElementById('mEdit');

  if (!inputUserId || !inputStatus || !modalTitle || !modalMessage || !actionButton || !modal) return;

  inputUserId.value = userId;
  inputStatus.value = newStatus;

  const isBanAction = newStatus === 'banned';

  // Define conteúdo do modal conforme ação
  modalTitle.textContent = isBanAction ? 'Banir Usuário' : 'Desbanir Usuário';

  modalMessage.innerHTML = isBanAction
    ? `Banir o usuário <strong>${userName}</strong>? Ele não poderá mais acessar o sistema.`
    : `Reativar o acesso do usuário <strong>${userName}</strong>?`;

  actionButton.textContent = isBanAction ? 'Banir' : 'Desbanir';

  actionButton.className =
    'btn btn-sm ' + (isBanAction ? 'btn-warning text-white' : 'btn-success text-white');

  new bootstrap.Modal(modal).show();
}

/* Abre modal de exclusão de usuário */
function openAdminDeleteModal(userId, userName) {
  const inputUserId = document.getElementById('did');
  const userNameLabel = document.getElementById('dname');
  const modal = document.getElementById('mDel');

  if (!inputUserId || !userNameLabel || !modal) return;

  inputUserId.value = userId;
  userNameLabel.textContent = userName;

  new bootstrap.Modal(modal).show();
}

/* Filtra a tabela de usuários */
function filterAdminTable() {
  const searchInput = document.getElementById('search');
  const statusFilter = document.getElementById('f-status');
  const infoLabel = document.getElementById('pg-info');
  const tableRows = document.querySelectorAll('#tbody tr');

  if (!searchInput || !statusFilter || !infoLabel) return;

  const query = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  let visibleCount = 0;

  tableRows.forEach(row => {
    const userName = (row.dataset.name || '').toLowerCase();
    const userEmail = (row.dataset.email || '').toLowerCase();
    const userStatus = row.dataset.status || '';

    const shouldShow =
      (!query || userName.includes(query) || userEmail.includes(query)) &&
      (!selectedStatus || userStatus === selectedStatus);

    row.style.display = shouldShow ? '' : 'none';

    if (shouldShow) visibleCount++;
  });

  // Atualiza contador
  infoLabel.textContent = `${visibleCount} usuário(s)`;
}

/* Exibe uma mensagem toast temporária */
function showToast(message, type = 'ok') {
  const toastContainer = document.getElementById('tstack');
  if (!toastContainer) return;

  const toastElement = document.createElement('div');
  toastElement.className = 'a-toast ' + type;
  toastElement.innerHTML = '<div class="td"></div>' + message;

  toastContainer.appendChild(toastElement);

  // Remove após 3 segundos
  setTimeout(() => {
    toastElement.remove();
  }, 3000);
}