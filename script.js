// Cambia MASTER_URL por la URL pública de tu master en Render
const MASTER_URL = "https://TU-MASTER.onrender.com";
const BACKEND = MASTER_URL;

const productos = [
  { id:1, nombre:"Hamburguesa", precio:50, img:"https://via.placeholder.com/400x300" },
  { id:2, nombre:"Papas", precio:30, img:"https://via.placeholder.com/400x300" },
  { id:3, nombre:"Refresco", precio:20, img:"https://via.placeholder.com/400x300" },
  { id:4, nombre:"Nuggets", precio:40, img:"https://via.placeholder.com/400x300" }
];

let carrito = [];
const menuDiv = document.getElementById('menu');

function renderMenu(){
  menuDiv.innerHTML='';
  productos.forEach(p=>{
    const col=document.createElement('div');
    col.className='col-sm-6 mb-3';
    col.innerHTML = `
      <div class="card">
        <img class="menu-img" src="${p.img}" alt="${p.nombre}">
        <div class="card-body">
          <h5>${p.nombre}</h5>
          <p>$${p.precio}</p>
          <button class="btn btn-warning text-danger w-100" onclick="add(${p.id})">Agregar</button>
        </div>
      </div>`;
    menuDiv.appendChild(col);
  });
}
renderMenu();

function add(id){
  carrito.push(productos.find(x=>x.id===id));
  update();
}
function remove(i){ carrito.splice(i,1); update(); }
function update(){
  const ul=document.getElementById('carrito');
  ul.innerHTML='';
  let total=0;
  carrito.forEach((p,i)=>{
    total+=p.precio;
    const li=document.createElement('li');
    li.className='list-group-item d-flex justify-content-between';
    li.innerHTML = `${p.nombre} - $${p.precio} <button class="btn btn-sm btn-danger" onclick="remove(${i})">x</button>`;
    ul.appendChild(li);
  });
  document.getElementById('total').innerText = total;
}

document.getElementById('enviarPedido').addEventListener('click', async ()=>{
  if(carrito.length===0) return alert('Pedido vacío');
  try{
    const r = await fetch(BACKEND + '/pedidos', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({productos: carrito})
    });
    if(!r.ok) return alert('Error al enviar pedido');
    alert('Pedido enviado!');
    carrito=[]; update(); fetchPedidos();
  }catch(e){ alert('No se pudo conectar al master: ' + e.message); }
});

async function fetchPedidos(){
  try{
    const r = await fetch(BACKEND + '/pedidos');
    if(!r.ok) return;
    const data = await r.json();
    const ul = document.getElementById('pedidosRecientes');
    ul.innerHTML='';
    data.forEach(p => {
      const li = document.createElement('li');
      li.className='list-group-item';
      li.textContent = `#${p.id} - ${p.productos.map(x=>x.nombre).join(', ')}`;
      ul.appendChild(li);
    });
  }catch(e){ console.warn('no se pudo obtener pedidos', e.message); }
}
fetchPedidos();
setInterval(fetchPedidos, 3000);
