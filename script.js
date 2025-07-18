const whatsapp = '2235931151';
let turnos = [];
let reservados = [];

async function cargarTurnos() {
  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbx-KAVSOkEnvGSeo03y_tLQO2d5f2o2My5evShk63-Kld7Ro68fUIdVLXHu-pZEVBXE/exec");
    reservados = await response.json();  // debe ser un array como ["T1", "T3", ...]

    const fechas = generarFechas();
    let turnoNumero = 1;

    fechas.forEach(fecha => {
      const bloques = generarBloques(fecha);
      bloques.forEach(hora => {
        const diaTexto = formatoDia(fecha);
        const id = `T${turnoNumero}`;
        if (!reservados.includes(id)) {
          turnos.push({ nro: id, diaTexto, hora });
        }
        turnoNumero++;
      });
    });

    mostrarTurnos();
  } catch (error) {
    alert("Error cargando turnos: " + error.message);
  }
}

function generarFechas() {
  const hoy = new Date();
  const fechas = [];
  for (let i = 0; i < 14; i++) {
    const f = new Date(hoy);
    f.setDate(f.getDate() + i);
    if (f.getDay() !== 0) fechas.push(f); // omite domingos
  }
  return fechas;
}

function generarBloques(fecha) {
  const bloques = [];
  let inicio = fecha.getDay() === 6 ? 8 : 6;  // sábado: 8 a 16
  let fin = fecha.getDay() === 6 ? 16 : 20;  // lunes-viernes: 6 a 20
  for (let i = inicio; i < fin; i++) {
    bloques.push(`${i}:00`);
  }
  return bloques;
}

function formatoDia(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaSemana = dias[fecha.getDay()];
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  return `${diaSemana} - ${dia}/${mes}/${año}`;
}

function mostrarTurnos() {
  const contenedor = document.getElementById('turnos');
  contenedor.innerHTML = '';
  turnos.forEach(turno => {
    const div = document.createElement('div');
    div.className = 'turno';
    div.innerHTML = `
      <div><strong>${turno.diaTexto} - ${turno.hora}</strong></div>
      <button onclick="reservarTurno('${turno.nro}', '${turno.diaTexto}', '${turno.hora}')">Reservar turno</button>
    `;
    contenedor.appendChild(div);
  });
}

function reservarTurno(nro, dia, hora) {
  const nombre = prompt("Ingresá tu nombre:");
  const celular = prompt("Ingresá tu número de celular:");
  if (!nombre || !celular) return alert("Debes completar tus datos para continuar.");

  const mensajeWp = `Ya reservé mi turno para el ${dia} a las ${hora}. Mi nombre es ${nombre}.`;

  // Redirección directa a la app de WhatsApp
  window.location.href = `whatsapp://send?phone=549${whatsapp}&text=${encodeURIComponent(mensajeWp)}`;
}

window.onload = cargarTurnos;

