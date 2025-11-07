let mesas = [];
let reservas = [];
let asignaciones = {};
const maxMesas = 20;

// ------------------ MESAS ------------------
function crearMesa() {
  const capacidad = parseInt(document.getElementById('capacidad').value);
  const fecha = document.getElementById('fechaMesa').value;
  if (!fecha || isNaN(capacidad) || capacidad < 1 || capacidad > 4) {
    alert('Fecha y capacidad válidas requeridas');
    return;
  }

  const numero = [...Array(maxMesas).keys()].map(i => i + 1).find(n => !mesas.some(m => m.numero === n && m.fecha === fecha));
  if (!numero) {
    alert('Ya se crearon todas las mesas disponibles para esa fecha');
    return;
  }

  mesas.push({ numero, capacidad, fecha });
  document.getElementById('capacidad').value = '';
  document.getElementById('fechaMesa').value = '';
  mostrarMesas();
  mostrarReservas();
}

function mostrarMesas() {
  const div = document.getElementById('lista-mesas');
  div.innerHTML = '';
  mesas.forEach(m => {
    const li = document.createElement('li');
    li.textContent = `Mesa ${m.numero} (Cap: ${m.capacidad}) - Fecha: ${m.fecha}`;

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => editarMesa(m.numero, m.fecha);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = () => eliminarMesa(m.numero, m.fecha);

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);
    div.appendChild(li);
  });

  document.getElementById('mesasCreadas').textContent = mesas.length;
}

function editarMesa(numero, fecha) {
  const mesa = mesas.find(m => m.numero === numero && m.fecha === fecha);
  const nuevaCap = prompt('Nueva capacidad:', mesa.capacidad);
  if (!nuevaCap) return;
  const cap = parseInt(nuevaCap);
  if (cap > 4 || cap < 1) {
    alert('Capacidad inválida');
    return;
  }
  mesa.capacidad = cap;
  mostrarMesas();
  mostrarReservas();
}

function eliminarMesa(numero, fecha) {
  mesas = mesas.filter(m => !(m.numero === numero && m.fecha === fecha));
  for (let id in asignaciones) {
    asignaciones[id] = asignaciones[id].filter(n => n !== numero);
    if (asignaciones[id].length === 0) delete asignaciones[id];
  }
  mostrarMesas();
  mostrarReservas();
}

// ------------------ RESERVAS ------------------
function crearReserva() {
  const fecha = document.getElementById('fecha').value;
  const personas = parseInt(document.getElementById('personas').value);
  if (!fecha || isNaN(personas) || personas < 1) {
    alert('Complete todos los campos correctamente');
    return;
  }
  const id = reservas.length ? reservas[reservas.length - 1].id + 1 : 1;
  reservas.push({ id, fecha, personas });
  document.getElementById('fecha').value = '';
  document.getElementById('personas').value = '';
  mostrarReservas();
}

function mostrarReservas() {
  const div = document.getElementById('lista-reservas');
  div.innerHTML = '';

  reservas.forEach(r => {
    if (asignaciones[r.id]) return;

    const li = document.createElement('li');
    li.textContent = `ID ${r.id} | ${r.fecha} | ${r.personas} personas`;

    const btnEditar = document.createElement('button');
    btnEditar.textContent = 'Editar';
    btnEditar.onclick = () => editarReserva(r.id);

    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.onclick = () => eliminarReserva(r.id);

    li.appendChild(btnEditar);
    li.appendChild(btnEliminar);

    const asignacionDiv = document.createElement('div');
    asignacionDiv.className = 'asignacion';

    const disponibles = mesasDisponiblesParaFecha(r.fecha);

    if (disponibles.length === 0) {
      asignacionDiv.innerHTML = `⚠️ No hay mesas disponibles para ${r.fecha}. Cree mesas para ese día.`;
    } else {
      asignacionDiv.innerHTML = `<b>Mesas disponibles para esta reserva:</b><br>`;
      disponibles.forEach(m => {
        const label = document.createElement('label');
        label.innerHTML = `
          <input type="checkbox" class="mesaAsignable" data-reserva="${r.id}" value="${m.numero}">
          Mesa ${m.numero} (Cap: ${m.capacidad})
        `;
        asignacionDiv.appendChild(label);
      });

      const btnAsignar = document.createElement('button');
      btnAsignar.textContent = 'Asignar Mesas';
      btnAsignar.onclick = () => asignarMesas(r.id);
      asignacionDiv.appendChild(btnAsignar);
    }

    li.appendChild(asignacionDiv);
    div.appendChild(li);
  });

  mostrarResumen();
}

function editarReserva(id) {
  const r = reservas.find(x => x.id === id);
  const nuevaCant = prompt('Nueva cantidad de personas:', r.personas);
  if (!nuevaCant) return;
  r.personas = parseInt(nuevaCant);
  mostrarReservas();
}

function eliminarReserva(id) {
  if (asignaciones[id]) {
    delete asignaciones[id];
  }
  reservas = reservas.filter(r => r.id !== id);
  mostrarReservas();
  mostrarResumen();
}

// ------------------ ASIGNACIÓN ------------------
function asignarMesas(idReserva) {
  const reserva = reservas.find(r => r.id === idReserva);
  if (!reserva) return alert('Reserva no encontrada');

  const checkboxes = document.querySelectorAll(`.mesaAsignable[data-reserva="${idReserva}"]:checked`);
  const seleccionadas = Array.from(checkboxes).map(c => parseInt(c.value));

  if (seleccionadas.length === 0) return alert('Seleccione al menos una mesa');

  const mesasSel = mesas.filter(m => seleccionadas.includes(m.numero) && m.fecha === reserva.fecha);
  const capacidadTotal = mesasSel.reduce((acc, m) => acc + m.capacidad, 0);

  if (capacidadTotal < reserva.personas) {
    return alert(`Capacidad insuficiente. Faltan ${reserva.personas - capacidadTotal} lugares.`);
  }

  asignaciones[idReserva] = mesasSel.map(m => m.numero);
  mostrarMesas();
  mostrarReservas();
}

// ------------------ RESUMEN ------------------
function mostrarResumen() {
  const div = document.getElementById('resumen');
  div.innerHTML = '';
  reservas.forEach(r => {
    const mesasAsignadas = asignaciones[r.id] || [];
    div.innerHTML += `Reserva ${r.id} (${r.fecha}): ${r.personas} personas - Mesas: ${mesasAsignadas.length ? mesasAsignadas.join(', ') : 'sin mesas'}<br>`;
  });
}

// ------------------ UTILIDAD ------------------
function mesasDisponiblesParaFecha(fecha) {
  const ocupadas = Object.entries(asignaciones)
    .filter(([id, _]) => {
      const r = reservas.find(x => x.id == id);
      return r && r.fecha === fecha;
    })
    .flatMap(([_, nums]) => nums);

  return mesas.filter(m => m.fecha === fecha && !ocupadas.includes(m.numero));
}
