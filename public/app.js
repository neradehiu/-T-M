async function api(path, opts = {}) {
  const res = await fetch(path, opts);
  return res.json();
}

document.getElementById('addForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value || 0);
  const description = document.getElementById('description').value.trim();

  const r = await api('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, description })
  });

  document.getElementById('addResult').innerText =
    r.id ? `✅ Added: ${r.name} (id=${r.id})` : JSON.stringify(r);

  e.target.reset();
  loadList();
});

document.getElementById('searchBtn').addEventListener('click', loadList);
document.getElementById('q').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') loadList();
});

async function loadList() {
  const q = document.getElementById('q').value.trim();
  const url = q ? `/api/products?q=${encodeURIComponent(q)}` : '/api/products';
  const items = await api(url);

  const ul = document.getElementById('list');
  ul.innerHTML = '';

  if (!Array.isArray(items)) {
    ul.innerHTML = '<li style="color:red;">❌ Error loading</li>';
    return;
  }

  if (items.length === 0) {
    ul.innerHTML = '<li style="color:#666;">No products found.</li>';
    return;
  }

  items.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p.name}</strong> — 💲${p.price}<br><small>${p.description || ''}</small>`;
    ul.appendChild(li);
  });
}

loadList();
