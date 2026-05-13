<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Error 500</title>

    <style>
        body{
            margin:0;
            height:100vh;
            display:flex;
            flex-direction:column;
            justify-content:center;
            align-items:center;
            background:#07111f;
            color:white;
            font-family:Arial, Helvetica, sans-serif;
        }

        h1{
            font-size:40px;
            margin-bottom:20px;
        }

        a{
            padding:12px 24px;
            border-radius:10px;
            text-decoration:none;
            background:#1CE0EB;
            color:#04121a;
            font-weight:bold;
        }

        a:hover{
            opacity:.9;
        }
    </style>
</head>
<body>

    <h1>Error interno del servidor</h1>

    <a href="{{ route('home') }}">
        Volver al inicio
    </a>

</body>
</html>