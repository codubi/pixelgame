# PixelGame.js

PixelGame es un juego en tiempo real, similar a PixelCanvas de r/place. Donde multiples usuarios pueden hacer dibujos de a un pixel a la vez.

Esta desarrollado en su totalidad en JavaScript, utilizando NodeJS del lado del servidor.

Del lado del cliente el juego es renderizado mediante Canvas, y la informacion circula por medio de Socket.io

Para iniciar el juego es necesario primero instalar las dependencias de NodeJS mediante el comando:

```sh
$ npm install
```

Y luego iniciarlo mediante:

```sh
$ node server.js
```

# Niveles

El sistema de niveles permite a los usuarios recortar el tiempo de espera entre cada pixel, avanzando de nivel cada cierta cantidad de pixels dibujados.

Por defecto el codigo esta configurado para que solo se sumen pixels cuando se pinta sobre color blanco.

Lo niveles pueden ser editados desde /app/module/functions.js

* Nivel 1 : 0 Pixels - Delay 30s
* Nivel 2 : 5 Pixels - Delay 29s
* Nivel 3 : 10 Pixels - Delay 28s
* Nivel 4 : 20 Pixels - Delay 26s
* Nivel 5 : 35 Pixels - Delay 24s
* Nivel 6 : 50 Pixels - Delay 22s
* Nivel 7 : 60 Pixels - Delay 21s
* Nivel 8 : 80 Pixels - Delay 20s
* Nivel 9 : 100 Pixels - Delay 19s
* Nivel 10 : 120 Pixels - Delay 18s
* Nivel 11 : 150 Pixels - Delay 17s
* Nivel 12 : 200 Pixels - Delay 15s
* Nivel 13: 300 Pixels - Delay 14s
* Nivel 14: 400 Pixels - Delay 13s
* Nivel 15: 500 Pixels - Delay 12s
* Nivel 16: 700 Pixels - Delay 11s
* Nivel 17: 1000 Pixels - Delay 10s

# Seguridad

El codigo cuenta con un sistema muy sencillo de autentificado mediante encriptacion MD5.

Cuando un usuario abre el juego, desde el cliente se envian 2 variables:

| Variable | Descripcion |
| ------ | ------ |
| Hash | Nombre de usuario o id que utilizes para identificarlos. |
| Secret Key |  Es el nombre de usuario encriptado en MD5 |

Del lado del servidor esto se valida, y evita que los usuarios puedan saltar el limite de tiempo entre cada pixel.

Si el codigo es implementado para proyectos serios, recomiendo cambiar el tipo de ecriptacion a otra que no sea MD5, o utilizar varias encriptaciones para que sea mas seguro. En el codigo lo implemente de esta manera para que sea lo mas facil posible de entender.


