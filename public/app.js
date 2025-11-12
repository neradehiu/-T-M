async function api(path, opts = {}) {
  const res = await fetch(path, opts);
  return res.json();
}

document.getElementById('addForm').addEventListener('submit', async e => {
  e.preventDefault();
  const id = e.target.dataset.id; // để biết đang edit hay thêm mới
  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value || 0);
  const description = document.getElementById('description').value.trim();

  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/products/${id}` : '/api/products';

  const r = await api(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, description })
  });

  document.getElementById('addResult').innerText =
    r.id ? `✅ ${id ? 'Updated' : 'Added'}: ${r.name}` : JSON.stringify(r);

  e.target.reset();
  e.target.dataset.id = ''; // reset trạng thái edit
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
    li.innerHTML = `
      <strong>${p.name}</strong> — 💲${p.price}<br>
      <small>${p.description || ''}</small><br>
      <button onclick="editProduct(${p.id}, '${p.name}', ${p.price}, '${p.description || ''}')">✏️ Edit</button>
      <button onclick="deleteProduct(${p.id})">🗑️ Delete</button>
    `;
    ul.appendChild(li);
  });
}

async function deleteProduct(id) {
  if (!confirm('❌ Are you sure to delete this product?')) return;
  await api(`/api/products/${id}`, { method: 'DELETE' });
  loadList();
}

function editProduct(id, name, price, description) {
  document.getElementById('name').value = name;
  document.getElementById('price').value = price;
  document.getElementById('description').value = description;
  document.getElementById('addForm').dataset.id = id;
  document.getElementById('addResult').innerText = `✏️ Editing product ID: ${id}`;
}

loadList();
