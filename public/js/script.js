let contador = 0;
const divContador = document.querySelector('.contador');
const divNivel = document.querySelector('.divNivel');
const divDinero = document.querySelector('.divDinero');
const divDineroQueGenera = document.querySelector('.divDineroQueGenera');
const textoContador = document.querySelector('.contador p');
const grilla = document.querySelector('.grilla');

let dineroActual = parseFloat(divDinero.innerText.replace(/[^0-9.-]+/g, ""));
if (dineroActual > 0) {
    divDinero.innerText = abreviarNumero(dineroActual);

} else {
    divDinero.innerText = '0';
}

dineroQueGenera();

const rutasImagenes = consolas.map(consola => consola.ruta_imagen);
precargarImagenes(rutasImagenes);

function precargarImagenes(rutas) {
    rutas.forEach(ruta => {
        const img = new Image();
        img.src = ruta;
    });
}

divContador.addEventListener('click', (event) => {
    event.preventDefault();
    if (contador < 10) {
        contador++;
        textoContador.innerText = contador;
    }
});

setInterval(() => {
    if (contador <= 10) {
        textoContador.innerText = contador;
    } else {
        contador = 0;
        textoContador.innerText = '0';

        const casillas = document.querySelectorAll('.casilla');
        const casillasLibres = Array.from(casillas).filter(casilla => !casilla.querySelector('img'));

        if (casillasLibres.length > 0) {
            nuevaConsola();
        } else {
            contador = 11;
            textoContador.innerText = 'FULL!';
        }
    }
    contador++;
}, 1000);

setInterval(() => {
    const divsDinero = document.querySelectorAll('.dinero');
    let dineroGenerado = 0;
    const casillas = document.querySelectorAll('.casilla');

    casillas.forEach(casilla => {
        if (casilla.querySelector('img')) {
            let ruta_imagen = obtenerIdConsola(casilla.querySelector('img').src);
            let dinero = 0;
            let coordenadas = casilla.getBoundingClientRect();
            
            consolas.forEach(consola => {
                if (consola.id === ruta_imagen) {
                    dinero = consola.money;
                }
            });

            dineroGenerado += parseFloat(dinero);

            const mostrarDinero = document.createElement('div');
            mostrarDinero.className = 'dinero';
            mostrarDinero.style.position = 'absolute';
            mostrarDinero.style.left = `${coordenadas.left + window.scrollX}px`;
            mostrarDinero.style.top = `${coordenadas.top + window.scrollY}px`;
            mostrarDinero.innerHTML = `+<img src='images/moneda.png' alt='img'> ${dinero % 1 === 0 ? dinero : dinero.toFixed(2)}`;
            
            document.body.appendChild(mostrarDinero);
        }
    });

    // Sumar el dinero generado al dinero total
    dineroActual += dineroGenerado;

    // Actualizar el dinero mostrado
    if (dineroActual > 0) {
        divDinero.innerText = abreviarNumero(dineroActual);
    } else {
        divDinero.innerText = '0';
    }

    // Borrar los div anteriores para no sobrecargar el DOM
    divsDinero.forEach(div => {
        div.remove();
    });

}, 3000);

function dineroQueGenera() {
    let dineroGenerado = 0;
    const casillas = document.querySelectorAll('.casilla');

    casillas.forEach(casilla => {
        if (casilla.querySelector('img')) {
            let ruta_imagen = obtenerIdConsola(casilla.querySelector('img').src);
            let dinero = 0;
            
            consolas.forEach(consola => {
                if (consola.id === ruta_imagen) {
                    dinero = consola.money;
                }
            });

            dineroGenerado += parseFloat(dinero);
        }
    });

    if (dineroGenerado > 0) {
        divDineroQueGenera.innerHTML = `<img src="../images/moneda.png" class="mr-1" style="width: 2vw">` + abreviarNumero(dineroGenerado) + '<div> /3seg </div>';

    } else {
        divDineroQueGenera.innerHTML = '<img src="../images/moneda.png" class="mr-1" style="width: 2vw"><div> 0 /3seg </div>';    
    }
}


function obtenerIdConsola(src) {
    const consola = consolas.find(consola => src.endsWith(consola.ruta_imagen));
    return consola ? consola.id : 0;
}

function obtenerRutaImagenConsola(id) {
    const consola = consolas.find(consola => consola.id === id);
    return consola ? consola.ruta_imagen : "/images/defect.png";
}

function nuevaConsola(id = null, precio = null) {
    const casillas = document.querySelectorAll('.casilla');
    let casillasLibres = Array.from(casillas).filter(casilla => !casilla.querySelector('img'));

    if (casillasLibres.length > 0) {
        const nuevaCasilla = casillasLibres[Math.floor(Math.random() * casillasLibres.length)];
        const consolaId = id || 1;
        const imagenConsola = obtenerRutaImagenConsola(consolaId);

        if (id === null || (precio !== null && precio <= dineroActual)) {
            nuevaCasilla.innerHTML = `<img src='${imagenConsola}' alt='img' loading="lazy">`;
            const posicion = Array.from(nuevaCasilla.parentNode.children).indexOf(nuevaCasilla) + 1;

            if (precio) {
                const nuevoDinero = dineroActual - precio;
                const divTienda = document.getElementById('divTienda');
                divTienda.style.display = 'none';
                console.log(dineroActual, nuevoDinero);
                dineroActual = nuevoDinero;
                divDinero.innerText = abreviarNumero(nuevoDinero);
            }

        } else {
            mensaje = document.createElement('div');
            mensaje.innerHTML = '<div class="mensaje"><img src="/images/warning.png"> Dinero insuficiente.</div>';
            document.body.appendChild(mensaje);

            setTimeout(() => {
                document.querySelector('.mensaje').remove();
            }, 2000);
        }

        dineroQueGenera();

    } else {
        mensaje = document.createElement('div');
        mensaje.innerHTML = '<div class="mensaje"><img src="/images/warning.png"> No hay casillas libres.</div>';
        document.body.appendChild(mensaje);

        setTimeout(() => {
            document.querySelector('.mensaje').remove();
        }, 2000);
    }
}

function mostrarNuevaConsola(id) {
    consolas.forEach(consola => {
        if (consola.id === id) {
            divInfoConsola = document.getElementById('divInfoConsola');
            divInfoConsola.style.display = 'block';
            divInfoConsola.innerHTML = `
                <button onclick="ocultarContenedor(this)" class="p-2 px-4">X</button>
                <h1 class="font-bold mb-4">Enhorabuena, nueva consola!</h1>
                <img src='${consola.ruta_imagen}' alt='img' class="w-32 h-32 mx-auto mb-4">
                <h2 class="font-semibold mb-2">${consola.nombre}</h2>
                <p class="text-gray-700">${consola.descripcion}</p>
            `;
        }
    })
}

function pruebas(id_consola) {
    const n_casillas = grilla.children.length;

    if (id_consola > nivelUsuario) {
        // Actualizar el nivel del usuario
        nivelUsuario += 1;
        divNivel.innerHTML = '<img src="../images/estrella.png" class="mr-1" style="width: 2vw">' + nivelUsuario;

        mostrarNuevaConsola(id_consola);
    }
}

let dragging = false;
let draggedElement = null;
let originalWidth = null;
let originalHeight = null;
let casillasCoords = [];

document.addEventListener('mousedown', (event) => {
    if (event.target.tagName === 'IMG') {
        if (event.target.parentElement.classList.contains('casilla')) {
            event.target.style.cursor = 'grabbing';
            dragging = true;
            draggedElement = event.target;
            originalWidth = draggedElement.width;
            originalHeight = draggedElement.height;
            draggedElement.style.width = originalWidth + 'px';
            draggedElement.style.height = originalHeight + 'px';
            event.preventDefault();
            obtenerCoordenadasCasillas();
        }
    }
});

document.addEventListener('mousemove', (event) => {
    if (dragging && draggedElement) {
        draggedElement.style.position = 'absolute';
        draggedElement.style.left = event.pageX - (originalWidth / 2) + 'px';
        draggedElement.style.top = event.pageY - (originalHeight / 2) + 'px';
    }
});

function obtenerCoordenadasCasillas() {
    casillasCoords = [];
    const casillas = document.querySelectorAll('.casilla');
    casillas.forEach((casilla) => {
        const rect = casilla.getBoundingClientRect();
        const coords = {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            bottom: rect.bottom + window.scrollY,
            right: rect.right + window.scrollX
        };
        casillasCoords.push(coords);
    });
}

document.addEventListener('mouseup', (event) => {
    if (dragging) {
        const mouseX = event.pageX;
        const mouseY = event.pageY;
        const divContenedor = draggedElement.parentElement;

        let casillaSoltada = null;
        for (let i = 0; i < casillasCoords.length; i++) {
            const coords = casillasCoords[i];
            if (mouseX >= coords.left && mouseX <= coords.right && mouseY >= coords.top && mouseY <= coords.bottom) {
                casillaSoltada = i + 1;
                break;
            }
        }

        if (casillaSoltada !== null && divContenedor !== grilla.children[casillaSoltada - 1]) {
            const divDestino = grilla.children[casillaSoltada - 1];
            const imagenCasilla = divDestino.querySelector('img');

            if (imagenCasilla && draggedElement.src.toLowerCase() === imagenCasilla.src.toLowerCase()) {
                // Obtener el ID de la consola actual y la siguiente consola
                let idConsolaActual = obtenerIdConsola(imagenCasilla.src.toLowerCase());
                let idConsolaSiguiente = idConsolaActual + 1;
                console.log(idConsolaActual, idConsolaSiguiente);
                    
                let nuevaImagenSrc = obtenerRutaImagenConsola(idConsolaSiguiente);
                
                // Actualizar la casilla de destino con la nueva consola
                divDestino.innerHTML = `<img src="${nuevaImagenSrc}" alt="img">`;
                divContenedor.innerHTML = '';
                
                pruebas(idConsolaSiguiente);
                dineroQueGenera();
                console.log('Son la misma consola, se combinan y se actualiza a la siguiente consola.');
                
            } else if (imagenCasilla) {
                let imagenOrigen = draggedElement.src;
                let imagenDestino = imagenCasilla.src;

                // Poner la imagen de la consola arrastrada en la casilla destino
                divDestino.innerHTML = `<img src="${imagenOrigen}" alt="img">`;

                // Poner la imagen de la casilla destino en la casilla de la consola arrastrada
                divContenedor.innerHTML = `<img src="${imagenDestino}" alt="img">`;

                console.log('Son distintas consolas y se intercambian.');
                
            } else {
                // La casilla destino está vacía, mover la consola a esta posición
                let imagenOrigen = draggedElement.src;
                divDestino.innerHTML = `<img src="${imagenOrigen}" alt="img">`;
                divContenedor.innerHTML = '';

                console.log('Consola movida a una casilla vacía.');
            }

            console.log('El ratón fue soltado en la casilla:', casillaSoltada);
        } else {
            const nuevaImagen = document.createElement('img');
            nuevaImagen.src = draggedElement.src;
            nuevaImagen.alt = 'Imagen de consola';
            draggedElement.remove();
            divContenedor.appendChild(nuevaImagen);
            console.log('El ratón fue soltado fuera de cualquier casilla o en la misma casilla.');
        }

        dragging = false;
        draggedElement = null;
    }
});


function mostrarLogros() {
    divLogros = document.getElementById('divLogros');
    divLogros.style.display = 'block';
    divLogros.innerHTML = '<button onclick="ocultarContenedor(this)" class="p-2 px-4">X</button>';

    consolas.forEach(consola => {
        if (consola.id <= nivelUsuario) {
            divLogros.innerHTML += `
                <div class="infoConsola">
                    <img src="${consola.ruta_imagen}" alt="imagen de consola" class="object-contain">
                    <div>
                        <h1><b>${consola.nombre}</b></h1>
                        <p>${consola.descripcion}</p>
                    </div>
                </div>
                <hr class="my-4 border-gray-500 w-90">
            `;
        }
    });
}

function mostrarTienda() {
    if (nivelUsuario > 3) {
        const divTienda = document.getElementById('divTienda');
        divTienda.style.display = 'flex';
        divTienda.style.flexDirection = 'column';
        divTienda.style.alignItems = 'center';
        divTienda.innerHTML = '<button onclick="ocultarContenedor(this)" class="p-2 px-4">X</button>';
        divTienda.innerHTML += '<div>Tokens disponibles: ' + abreviarNumero(dineroActual) + '</div>';

        const precioBase = 100;
        const factorCrecimiento = 1.5;

        consolas.forEach((consola, indice) => {
            if (consola.id > 1 && consola.id < nivelUsuario - 1) {
                const precio = precioBase * Math.pow(factorCrecimiento, indice) * consola.money * (nivelUsuario / 2);
                const precioAbreviado = abreviarNumero(precio);
                divTienda.innerHTML += `
                    <div class="divCompra w-70">
                        <div class="flex items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4" style="width: 70%;">
                            <img src="${consola.ruta_imagen}" alt="imagen de consola" class="w-20 h-20 sm:w-34 sm:h-34">
                            <h2>${consola.nombre}</h2>
                        </div>
                        <div onclick="nuevaConsola(${consola.id}, ${precio})" class="botonCompra">
                            <img src="../images/moneda.png" alt="imagen de consola">
                            <p>${precioAbreviado}</p>
                        </div>
                    </div>
                `;
            }
        });

    } else {
        mensaje = document.createElement('div');
        mensaje.innerHTML = '<div class="mensaje"><img src="/images/warning.png"> Todavia no puedes acceder a la tienda.</div>';
        document.body.appendChild(mensaje);

        setTimeout(() => {
            document.querySelector('.mensaje').remove();
        }, 2000);
    }
    
}

function mostrarConfirmacion() {
    const divConfirmacion = document.getElementById('divConfirmacion');
    divConfirmacion.style.display = 'flex';
}

function reiniciarJuego() {
    dineroActual = 0;
    nivelUsuario = 1;
    grilla.innerHTML = '';

    if (!invitado) {
        fetch('/reiniciar-juego', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Juego reiniciado');
                window.location.reload();
            } else {
                alert('Error al reiniciar el juego');
            }
        })
        .catch(error => console.error('Error:', error));
    }  
}

function ocultarContenedor(boton) {
    divPadre = boton.parentNode;
    divPadre.style.display = 'none';
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        document.getElementById('divInfoConsola').style.display = 'none';
        document.getElementById('divLogros').style.display = 'none';
        document.getElementById('divTienda').style.display = 'none';
        document.getElementById('divConfirmacion').style.display = 'none';
    }
});

function abreviarNumero(numero) {
    const unidades = ['', 'k', 'M', 'B', 'T'];
    const orden = Math.floor(Math.log10(Math.abs(numero)) / 3);
    const abreviado = numero / Math.pow(10, orden * 3);

    return `${abreviado.toFixed(2)}${unidades[orden]}`;
}



// Función para actualizar los datos del usuario en el servidor
function actualizarDatosUsuario(event) {
    if (event) event.preventDefault();

    let datosUsuario = {
        dinero: dineroActual,
        nivel: nivelUsuario,
        consolas: []
    };

    // Actualizar la lista de consolas
    const casillas = document.querySelectorAll('.casilla');
    casillas.forEach((casilla, index) => {
        const img = casilla.querySelector('img');
        if (img) {
            const consolaId = obtenerIdConsola(img.src);
            datosUsuario.consolas.push({
                posicion: index + 1,
                consola_id: consolaId
            });
        }
    });

    if (!invitado) {
        fetch('/actualizar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
            },
            body: JSON.stringify(datosUsuario)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos actualizados:', data);
            if (event) {
                document.getElementById('logout-form').submit(); // Envía el formulario de cierre de sesión
            }
        })
        .catch(error => {
            console.error('Error:', error);
            if (event) {
                document.getElementById('logout-form').submit(); // Envía el formulario incluso si hay un error
            }
        });
    } else {
        if (event) {
            document.getElementById('logout-form').submit(); // Envía el formulario si es invitado
        }
    }
}

setInterval(() => {
    actualizarDatosUsuario();
}, 300000);

window.addEventListener('beforeunload', (event) => {
    actualizarDatosUsuario();
});

window.addEventListener('unload', (event) => {
    actualizarDatosUsuario();
});


