// ------------------ ELEMENTOS DEL DOM ------------------
const listaMesas = document.getElementById('lista-mesas');
const formCrearMesa = document.getElementById('form-crear-mesa');
const errorCrear = document.getElementById('error-crear');

const listaReservas = document.getElementById('lista-reservas');
const formReserva = document.getElementById('form-crear-reserva');
const selectMesa = document.getElementById('mesa');

// ------------------ DATOS EN MEMORIA ------------------
let mesas = [
    { id: 1, numero_mesa: 1, capacidad: 4 },
    { id: 2, numero_mesa: 2, capacidad: 4 }
];

let reservas = [];

// ------------------ FUNCIONES MESAS ------------------
function cargarMesas() {
    listaMesas.innerHTML = '';
    mesas.forEach(mesa => {
        const li = document.createElement('li');
        li.textContent = `ID ${mesa.id} - Mesa ${mesa.numero_mesa} (Capacidad: ${mesa.capacidad})`;

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => editarMesa(mesa.id);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarMesa(mesa.id);

        li.appendChild(btnEditar);
        li.appendChild(btnEliminar);
        listaMesas.appendChild(li);
    });
    cargarSelectMesas();
}

// Crear mesa
formCrearMesa.addEventListener('submit', (e) => {
    e.preventDefault();
    const numero = parseInt(document.getElementById('numero').value);
    const capacidad = parseInt(document.getElementById('capacidad').value);

    if (capacidad > 4) {
        alert('Máximo 4 personas por mesa.');
        return;
    }

    const id = mesas.length ? mesas[mesas.length - 1].id + 1 : 1;
    mesas.push({ id, numero_mesa: numero, capacidad });
    formCrearMesa.reset();
    cargarMesas();
});

// Editar mesa
function editarMesa(id) {
    const mesa = mesas.find(m => m.id === id);
    const nuevoNumero = prompt('Nuevo número de mesa:', mesa.numero_mesa);
    if (nuevoNumero === null) return;

    let nuevaCapacidad = prompt('Nueva capacidad (máx. 4):', mesa.capacidad);
    if (nuevaCapacidad === null) return;
    nuevaCapacidad = parseInt(nuevaCapacidad);

    if (nuevaCapacidad > 4) {
        alert('Máximo 4 personas por mesa.');
        return;
    }

    mesa.numero_mesa = parseInt(nuevoNumero);
    mesa.capacidad = nuevaCapacidad;
    cargarMesas();
}

// Eliminar mesa
function eliminarMesa(id) {
    if (!confirm('¿Seguro que quieres eliminar esta mesa?')) return;
    mesas = mesas.filter(m => m.id !== id);
    reservas = reservas.filter(r => r.mesa_id !== id); // eliminar reservas de esa mesa
    cargarMesas();
    cargarReservas();
}

// ------------------ FUNCIONES RESERVAS ------------------
function cargarSelectMesas() {
    selectMesa.innerHTML = '';
    mesas.forEach(m => {
        const option = document.createElement('option');
        option.value = m.id;
        option.textContent = `Mesa ${m.numero_mesa} (Capacidad: ${m.capacidad})`;
        selectMesa.appendChild(option);
    });
}

function cargarReservas() {
    listaReservas.innerHTML = '';
    reservas.forEach(reserva => {
        const li = document.createElement('li');
        const mesa = mesas.find(m => m.id === reserva.mesa_id);
        li.textContent = `ID ${reserva.id} - Mesa ${mesa.numero_mesa} - ${reserva.personas} personas`;

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => editarReserva(reserva.id);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarReserva(reserva.id);

        li.appendChild(btnEditar);
        li.appendChild(btnEliminar);
        listaReservas.appendChild(li);
    });
}

// Crear reserva
formReserva.addEventListener('submit', (e) => {
    e.preventDefault();
    const mesa_id = parseInt(selectMesa.value);
    const personas = parseInt(document.getElementById('personas').value);

    const id = reservas.length ? reservas[reservas.length - 1].id + 1 : 1;
    reservas.push({ id, mesa_id, personas });
    formReserva.reset();
    cargarReservas();
});

// Editar reserva
function editarReserva(id) {
    const reserva = reservas.find(r => r.id === id);

    let nuevaMesa = prompt('ID de mesa:', reserva.mesa_id);
    if (nuevaMesa === null) return;
    nuevaMesa = parseInt(nuevaMesa);

    let nuevasPersonas = prompt('Cantidad de personas:', reserva.personas);
    if (nuevasPersonas === null) return;
    nuevasPersonas = parseInt(nuevasPersonas);

    reserva.mesa_id = nuevaMesa;
    reserva.personas = nuevasPersonas;
    cargarReservas();
}

// Eliminar reserva
function eliminarReserva(id) {
    if (!confirm('¿Seguro que quieres eliminar esta reserva?')) return;
    reservas = reservas.filter(r => r.id !== id);
    cargarReservas();
}

// ------------------ INICIALIZACIÓN ------------------
cargarMesas();
cargarSelectMesas();
cargarReservas();
