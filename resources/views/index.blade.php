<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Merge Games</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    
    <div class="min-h-screen flex items-center justify-center">
        <div class="bg-white shadow-md rounded p-8">
            <h1 class="text-2xl mb-4">Merge Games</h1>
            <div class="grilla grid grid-cols-4 gap-4">
                @for ($i = 1; $i < $numeroCasillas + 1; $i++)
                    @php
                        $consola = $tablero->consolas()
                            ->select('c.ruta_imagen')
                            ->join('tableros_consolas as tc', 'tc.consola_id', '=', 'consolas.id')
                            ->join('consolas as c', 'c.id', '=', 'tc.consola_id')
                            ->where('tc.posicion', $i)
                            ->where('tc.tablero_id', $tablero->id)
                            ->first();
                    @endphp

                    @if ($consola)
                        <div class="casilla bg-gray-200 p-4 text-center w-24 h-24">
                            <img src="{{ asset($consola->ruta_imagen) }}" alt="img">
                        </div>
                    @else
                        <div class="casilla bg-gray-200 p-4 text-center w-24 h-24"></div>
                    @endif
                @endfor
            </div>
            <div class="contador mt-4 text-xl">
                <p>0</p>
            </div>
            <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onclick="pruebas()">Pulsar</button>
        </div>
    </div>

    <script src="js/script.js"></script>
</body>
</html>
