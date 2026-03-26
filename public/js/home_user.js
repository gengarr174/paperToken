/* Mostra as informações do arquivo selecionado antes do upload */
function previewSelectedFile(file) {
  if (!file) return;

  const previewContainer = document.getElementById('fp');
  if (!previewContainer) return;

  previewContainer.style.display = 'block';

  const fileSize =
    file.size >= 1048576
      ? (file.size / 1048576).toFixed(1) + ' MB'
      : file.size >= 1024
        ? Math.floor(file.size / 1024) + ' KB'
        : file.size + ' B';

  previewContainer.innerHTML = `
    <div class="fp-row mt-2">
      <i class="bi bi-file-earmark-fill text-primary"></i>
      <span class="fp-name">${file.name}</span>
      <span class="fp-sz">${fileSize}</span>
    </div>
  `;
}

/* Trata o arquivo arrastado para a área de upload */
function handleFileDrop(event) {
  event.preventDefault();

  const uploadZone = document.getElementById('uz');
  if (uploadZone) uploadZone.classList.remove('drag');

  const fileInput = document.getElementById('fi');
  const droppedFile = event.dataTransfer?.files?.[0];

  if (!fileInput || !droppedFile) return;

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(droppedFile);
  fileInput.files = dataTransfer.files;

  previewSelectedFile(droppedFile);
}

/* Abre o modal de edição de arquivo */
function openEditModal(fileId, fileName) {
  const inputId = document.getElementById('eid');
  const inputName = document.getElementById('ename');
  const modal = document.getElementById('mEdit');

  if (!inputId || !inputName || !modal) return;

  inputId.value = fileId;
  inputName.value = fileName;

  new bootstrap.Modal(modal).show();
}

/* Abre o modal de exclusão de arquivo */
function openDeleteModal(fileId, fileName) {
  const deleteId = document.getElementById('did');
  const deleteName = document.getElementById('dname');
  const modal = document.getElementById('mDel');

  if (!deleteId || !deleteName || !modal) return;

  deleteId.value = fileId;
  deleteName.textContent = fileName;

  new bootstrap.Modal(modal).show();
}

/* Filtra a tabela de arquivos */
function filterUserTable() {
  const searchInput = document.getElementById('search');
  const typeFilter = document.getElementById('f-tipo');
  const infoLabel = document.getElementById('pg-info');
  const tableRows = document.querySelectorAll('#tbody tr');

  if (!searchInput || !typeFilter || !infoLabel) return;

  const query = searchInput.value.toLowerCase();
  const selectedType = typeFilter.value.toLowerCase();

  let visibleCount = 0;

  tableRows.forEach(row => {
    const fileName = row.querySelector('.file-n')?.textContent.toLowerCase() || '';
    const fileType = row.querySelector('.file-thumb')?.textContent.toLowerCase() || '';

    const shouldShow =
      (!query || fileName.includes(query)) &&
      (!selectedType || fileType === selectedType);

    row.style.display = shouldShow ? '' : 'none';

    if (shouldShow) visibleCount++;
  });

  infoLabel.textContent = `${visibleCount} arquivo(s)`;
}

/* Caracteres usados no captcha */
const CAPTCHA_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

let currentCaptchaText = '';
let isCaptchaValidated = false;

/* Gera um novo captcha */
function generateCaptcha() {
  const captchaDisplay = document.getElementById('cap-chars');
  const captchaInput = document.getElementById('cap-input');
  const nextButton = document.getElementById('c-next');

  if (!captchaDisplay || !captchaInput || !nextButton) return;

  currentCaptchaText = '';

  for (let i = 0; i < 6; i++) {
    currentCaptchaText += CAPTCHA_CHARACTERS[Math.floor(Math.random() * CAPTCHA_CHARACTERS.length)];
  }

  captchaDisplay.textContent = currentCaptchaText.split('').join(' ');

  captchaInput.value = '';
  captchaInput.classList.remove('cap-err', 'cap-ok');

  setCaptchaStatus('', '');
  isCaptchaValidated = false;

  nextButton.textContent = 'Verificar';
}

/* Reseta o captcha */
function resetCaptcha() {
  const textStep = document.getElementById('cap-text-step');
  const doneStep = document.getElementById('cap-done-step');
  const nextButton = document.getElementById('c-next');

  generateCaptcha();

  if (textStep) textStep.style.display = 'block';
  if (doneStep) doneStep.style.display = 'none';
  if (nextButton) nextButton.textContent = 'Verificar';

  isCaptchaValidated = false;
}

/* Define status do captcha */
function setCaptchaStatus(message, type) {
  const statusEl = document.getElementById('cap-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = 'cap-status' + (type ? ' ' + type : '');
}

/* Lógica principal do captcha */
async function handleCaptchaNext() {
  const modal = document.getElementById('mCaptcha');
  const input = document.getElementById('cap-input');
  const captchaDisplay = document.getElementById('cap-chars');
  const textStep = document.getElementById('cap-text-step');
  const doneStep = document.getElementById('cap-done-step');
  const nextButton = document.getElementById('c-next');

  if (!modal || !input || !captchaDisplay || !textStep || !doneStep || !nextButton) return;

  if (isCaptchaValidated) {
    const csrfToken = modal.dataset.csrf;

    try {
      const response = await fetch('/captcha/addToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _csrf: csrfToken })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        bootstrap.Modal.getInstance(modal).hide();
        showToast('+1 moeda adicionada! 🪙', 'gold');
        setTimeout(() => location.reload(), 1500);
      } else {
        showToast(data.error || 'Erro ao adicionar moeda.', 'err');
      }

    } catch {
      showToast('Erro de conexão.', 'err');
    }

    return;
  }

  const userInput = input.value.split('').join(' ');

  if (userInput === captchaDisplay.textContent) {
    input.classList.remove('cap-err');
    input.classList.add('cap-ok');
    setCaptchaStatus('Verificado! Você não parece ser um robô.', 'ok');

    setTimeout(() => {
      textStep.style.display = 'none';
      doneStep.style.display = 'block';
      nextButton.textContent = 'Coletar Moeda';
      isCaptchaValidated = true;
    }, 900);

  } else {
    input.classList.add('cap-err');
    input.classList.remove('cap-ok');
    setCaptchaStatus('Captcha incorreto. Um novo foi gerado.', 'err');

    setTimeout(() => generateCaptcha(), 1200);
  }
}

/* Inicializa o captcha ao abrir o modal */
const captchaModal = document.getElementById('mCaptcha');
if (captchaModal) {
  captchaModal.addEventListener('show.bs.modal', () => {
    resetCaptcha();
  });
}

/* Exibe toast */
function showToast(message, type = 'ok') {
  const stack = document.getElementById('tstack');
  if (!stack) return;

  const toastEl = document.createElement('div');
  toastEl.className = 'a-toast ' + type;
  toastEl.innerHTML = '<div class="td"></div>' + message;

  stack.appendChild(toastEl);

  setTimeout(() => toastEl.remove(), 3000);
}