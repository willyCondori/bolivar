<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>404 - Página no encontrada</title>

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
            font-size:42px;
            margin-bottom:15px;
        }

        p{
            color:rgba(255,255,255,.7);
            margin-bottom:25px;
        }

        a{
            padding:12px 24px;
            border-radius:10px;
            text-decoration:none;
            background:#1CE0EB;
            color:#04121a;
            font-weight:bold;
            transition:.2s;
        }

        a:hover{
            opacity:.9;
            transform:translateY(-2px);
        }
    </style>
</head>
<body>

    <h1>404</h1>

    <p>Página no encontrada</p>

    <a href="{{ route('home') }}">
        Volver al inicio
    </a>

</body>
</html>