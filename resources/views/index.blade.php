<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grid 4x4 con Tailwind CSS</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-white shadow-md rounded p-8">
            <h1 class="text-2xl mb-4">Merge Games</h1>
            <div class="grilla grid grid-cols-2 gap-4">

                @for ($i = 1; $i < $numeroCasillas + 1; $i++)
                    @php
                        // Busca la consola en la posición actual
                        $consola = $tablero->consolas()
                            ->select('c.ruta_imagen')
                            ->join('tableros_consolas as tc', 'tc.consola_id', '=', 'consolas.id')
                            ->join('consolas as c', 'c.id', '=', 'tc.consola_id')
                            ->where('tc.posicion', $i)
                            ->where('tc.tablero_id', $tablero->id)
                            ->first();
                    @endphp

                    {{-- Verifica si hay una consola en la posición actual --}}
                    @if ($consola)
                        <div class="casilla bg-gray-200 p-4 text-center" style="width: 90px; height: 90px;">
                            <img src="{{ asset($consola->ruta_imagen) }}" alt="img">
                        </div>
                    @else
                        <div class="casilla bg-gray-200 p-4 text-center" style="width: 90px; height: 90px;"></div>
                    @endif
                @endfor

            </div>
            <div class="contador">
                <p>0</p>
            </div>
            <div class="boton" onclick="pruebas()">Pulsar</div>
        </div>
    </div>

    <script>
        let contador = 0;
        let nivelUsuario = {{ Auth::user()->nivel ?? 'null' }};
        console.log(nivelUsuario);
        const divContador = document.querySelector('.contador');
        const textoContador = document.querySelector('.contador p');
        const grilla = document.querySelector('.grilla');

        divContador.addEventListener('click', () => {
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

                var casillas = document.querySelectorAll('.casilla');
                var casillasLibres = [];
                for (var i = 0; i < casillas.length; i++) {
                    if (casillas[i].querySelector('img') == null) {
                        casillasLibres.push(casillas[i]);
                    }
                }

                if (casillasLibres.length > 0) {
                    nuevaConsola();
                } else {
                    contador = 11;
                    textoContador.innerText = 'FULL!';
                }

            }
            contador++;
        }, 1000);

        function nuevaConsola() {
            var casillas = document.querySelectorAll('.casilla');
            var casillasLibres = [];
            for (var i = 0; i < casillas.length; i++) {
                if (casillas[i].querySelector('img') == null) {
                    casillasLibres.push(casillas[i]);
                }
            }

            if (casillasLibres.length > 0) {
                // Obtener una casilla libre aleatoria del tablero
                var nuevaCasilla = casillasLibres[Math.floor(Math.random() * casillasLibres.length)];

                // Obtener la imagen de una consola aleatoria
                var imagenConsola = "{{ $imagenConsola }}";

                // Imprimir la imagen de la consola en la casilla elegida al azar
                nuevaCasilla.innerHTML = "<img src='" + imagenConsola + "' alt='img'>";

                // Obtener la posición de la casilla
                var posicion = Array.from(nuevaCasilla.parentNode.children).indexOf(nuevaCasilla) + 1;
                console.log(posicion);

                // Realizar la solicitud AJAX para agregar la consola al tablero
                fetch('/agregar-consola', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({ id_consola: 1, posicion: posicion }) 
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

            } else {
                console.log("No hay casillas libres disponibles.");
            }
        }

        function pruebas() {
            contador = 0;
            textoContador.innerText = contador;

            /* if (nivelUsuario == 2) {
                grilla.classList.add('grid-cols-3');
            } */

            grilla.innerHTML += '<div class="casilla bg-gray-200 p-4 text-center" style="width: 90px; height: 90px;"></div>';

            // llamar a una funcion que esta en el controlador
            // Realizar una solicitud AJAX
            fetch('/incrementar-casillas')
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    // Aquí puedes manejar la respuesta si es necesario
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }

            

    </script>
</body>
</html>
