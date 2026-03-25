/* EDIT modal — admin: alterar status */
function openEditAdmin(id, name, newStatus) {
  const eid = document.getElementById('eid');
  const estatus = document.getElementById('estatus');
  const title = document.getElementById('mEditTitle');
  const msg = document.getElementById('mEditMsg');
  const btn = document.getElementById('mEditBtn');
  const modalEl = document.getElementById('mEdit');

  if (!eid || !estatus || !title || !msg || !btn || !modalEl) return;

  eid.value = id;
  estatus.value = newStatus;

  const ban = newStatus === 'banned';

  title.textContent = ban ? 'Banir Usuário' : 'Desbanir Usuário';
  msg.innerHTML = ban
    ? `Banir o usuário <strong>${name}</strong>? Ele não poderá mais acessar o sistema.`
    : `Reativar o acesso do usuário <strong>${name}</strong>?`;

  btn.textContent = ban ? 'Banir' : 'Desbanir';
  btn.className = 'btn btn-sm ' + (ban ? 'btn-warning text-white' : 'btn-success text-white');

  new bootstrap.Modal(modalEl).show();
}

/* DELETE modal */
function openDelAdmin(id, name) {
  const did = document.getElementById('did');
  const dname = document.getElementById('dname');
  const modalEl = document.getElementById('mDel');

  if (!did || !dname || !modalEl) return;

  did.value = id;
  dname.textContent = name;

  new bootstrap.Modal(modalEl).show();
}

/* TABLE filter */
function filterTableAdmin() {
  const searchEl = document.getElementById('search');
  const statusEl = document.getElementById('f-status');
  const infoEl = document.getElementById('pg-info');
  const rows = document.querySelectorAll('#tbody tr');

  if (!searchEl || !statusEl || !infoEl) return;

  const q = searchEl.value.toLowerCase().trim();
  const st = statusEl.value;

  let visible = 0;

  rows.forEach(row => {
    const name = (row.dataset.name || '').toLowerCase();
    const email = (row.dataset.email || '').toLowerCase();
    const status = row.dataset.status || '';

    const show =
      (!q || name.includes(q) || email.includes(q)) &&
      (!st || status === st);

    row.style.display = show ? '' : 'none';

    if (show) visible++;
  });

  infoEl.textContent = `${visible} usuário(s)`;
}

/* TOAST */
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