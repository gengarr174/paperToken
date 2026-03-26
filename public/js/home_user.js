/* Mostra as informações do arquivo selecionado antes do upload */
function handleFile(f) {
  if (!f) return;

  const fp = document.getElementById('fp');
  if (!fp) return;

  fp.style.display = 'block';

  const sz =
    f.size >= 1048576
      ? (f.size / 1048576).toFixed(1) + ' MB'
      : f.size >= 1024
      ? Math.floor(f.size / 1024) + ' KB'
      : f.size + ' B';

  fp.innerHTML = `
    <div class="fp-row mt-2">
      <i class="bi bi-file-earmark-fill text-primary"></i>
      <span class="fp-name">${f.name}</span>
      <span class="fp-sz">${sz}</span>
    </div>
  `;
}

/* Trata o arquivo arrastado para a área de upload */
function handleDrop(e) {
  e.preventDefault();

  const uz = document.getElementById('uz');
  if (uz) uz.classList.remove('drag');

  const fi = document.getElementById('fi');
  const file = e.dataTransfer?.files?.[0];

  if (!fi || !file) return;

  const dt = new DataTransfer();
  dt.items.add(file);
  fi.files = dt.files;

  handleFile(file);
}

/* Abre o modal de edição de arquivo */
function openEdit(id, name) {
  const eid = document.getElementById('eid');
  const ename = document.getElementById('ename');
  const modalEl = document.getElementById('mEdit');

  if (!eid || !ename || !modalEl) return;

  eid.value = id;
  ename.value = name;

  new bootstrap.Modal(modalEl).show();
}

/* Abre o modal de exclusão de arquivo */
function openDel(id, name) {
  const did = document.getElementById('did');
  const dname = document.getElementById('dname');
  const modalEl = document.getElementById('mDel');

  if (!did || !dname || !modalEl) return;

  did.value = id;
  dname.textContent = name;

  new bootstrap.Modal(modalEl).show();
}

/* Filtra a tabela de arquivos */
function filterTableUser() {
  const searchEl = document.getElementById('search');
  const tipoEl = document.getElementById('f-tipo');
  const infoEl = document.getElementById('pg-info');
  const rows = document.querySelectorAll('#tbody tr');

  if (!searchEl || !tipoEl || !infoEl) return;

  const q = searchEl.value.toLowerCase();
  const tp = tipoEl.value.toLowerCase();

  let visible = 0;

  rows.forEach(row => {
    const name = row.querySelector('.file-n')?.textContent.toLowerCase() || '';
    const ext = row.querySelector('.file-thumb')?.textContent.toLowerCase() || '';

    const show = (!q || name.includes(q)) && (!tp || ext === tp);

    row.style.display = show ? '' : 'none';

    if (show) visible++;
  });

  infoEl.textContent = `${visible} arquivo(s)`;
}

/* Caracteres usados no captcha */
const CAP_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let capCurrentText = '';
let capDone = false;

/* Gera um novo captcha */
function buildTextCaptcha() {
  const charsEl = document.getElementById('cap-chars');
  const input = document.getElementById('cap-input');
  const nextBtn = document.getElementById('c-next');

  if (!charsEl || !input || !nextBtn) return;

  capCurrentText = '';

  for (let i = 0; i < 6; i++) {
    capCurrentText += CAP_CHARS[Math.floor(Math.random() * CAP_CHARS.length)];
  }

  charsEl.textContent = capCurrentText.split('').join(' ');

  input.value = '';
  input.classList.remove('cap-err', 'cap-ok');

  setCapStatus('', '');
  capDone = false;
  nextBtn.textContent = 'Verificar';
}

/* Reseta o captcha */
function resetTextCaptcha() {
  const textStep = document.getElementById('cap-text-step');
  const doneStep = document.getElementById('cap-done-step');
  const nextBtn = document.getElementById('c-next');

  buildTextCaptcha();

  if (textStep) textStep.style.display = 'block';
  if (doneStep) doneStep.style.display = 'none';
  if (nextBtn) nextBtn.textContent = 'Verificar';

  capDone = false;
}

/* Define status do captcha */
function setCapStatus(msg, type) {
  const el = document.getElementById('cap-status');
  if (!el) return;

  el.textContent = msg;
  el.className = 'cap-status' + (type ? ' ' + type : '');
}

/* Lógica principal do captcha */
function capNext() {
  const modalEl = document.getElementById('mCaptcha');
  const input = document.getElementById('cap-input');
  const charsEl = document.getElementById('cap-chars');
  const textStep = document.getElementById('cap-text-step');
  const doneStep = document.getElementById('cap-done-step');
  const nextBtn = document.getElementById('c-next');

  if (!modalEl || !input || !charsEl || !textStep || !doneStep || !nextBtn) return;

  if (capDone) {
    const modalEl = document.getElementById('mCaptcha');
    const csrf = modalEl.dataset.csrf;

    fetch('/captcha/addToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _csrf: csrf })
    }).then(async r => {
      const data = await r.json().catch(() => ({}));

      if (r.ok) {
        bootstrap.Modal.getInstance(modalEl).hide();
        toast('+1 moeda adicionada! 🪙', 'gold');
        setTimeout(() => location.reload(), 1500);
      } else {
        toast(data.error || 'Erro ao adicionar moeda.', 'err');
      }
    }).catch(() => toast('Erro de conexão.', 'err'));

    return;
  }

  const inputVal = input.value.split('').join(' ');

  if (inputVal === charsEl.textContent) {
    input.classList.remove('cap-err');
    input.classList.add('cap-ok');
    setCapStatus('Verificado! Você não parece ser um robô.', 'ok');

    setTimeout(() => {
      textStep.style.display = 'none';
      doneStep.style.display = 'block';
      nextBtn.textContent = 'Coletar Moeda';
      capDone = true;
    }, 900);
  } else {
    input.classList.add('cap-err');
    input.classList.remove('cap-ok');
    setCapStatus('Captcha incorreto. Um novo foi gerado.', 'err');

    setTimeout(() => {
      buildTextCaptcha();
    }, 1200);
  }
}

/* Inicializa o captcha ao abrir o modal */
const mCaptcha = document.getElementById('mCaptcha');
if (mCaptcha) {
  mCaptcha.addEventListener('show.bs.modal', () => {
    resetTextCaptcha();
  });
}

/* Exibe toast */
function toast(msg, type = 'ok') {
  const s = document.getElementById('tstack');
  if (!s) return;

  const el = document.createElement('div');
  el.className = 'a-toast ' + type;
  el.innerHTML = '<div class="td"></div>' + msg;

  s.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 3000);
}