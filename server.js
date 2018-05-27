/*
PixelGame.js creado por Codubi
*/
var fs = require('fs'),
http = require('http'),
express = require('express'),
crypto = require('crypto'),
roomdata = require('roomdata'),
functions = require('./app/module/functions.js');

var version = "1.0.1";
var port = 8880;
var app = express();
var server = http.createServer(app).listen(port, function() {
console.log("[ Log ] Pixel Game Server " + version + " iniciado en el puerto " + port);
});

var io = require('socket.io').listen(server);
/*
app.get('/', function(req, res) {
res.writeHead(200);
res.end("Pixel Game Server " + version + "\n");
});*/

app.use('/', express.static(__dirname + '/'));

var map = []; 
var usernames = {}; // Lista de usuarios
var colors = ["r", "p", "v", "c", "l", "g", "h", "y", "o", "w", "z", "b", "k", "m"]; // Colores permitidos
var a = 360; // Cantidad de filas por columnas

/* Sirve para generar un mapa nuevo en blanco
var y;
var x;
for (y = 0; y < a; y++) { 
  map.push([]);
  for (x = 0; x < a; x++) { 
         map[y].push("w");
  }
  
}
*/
// Carga el mapa desde un archivo
fs.readFile("./core/maps/map.js", function(err, data) {
    map = JSON.parse(data);
});


// Guarda el mapa en un archivo
function saveMap() {
fs.writeFile("./core/maps/map.js", JSON.stringify(map), function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("[ Log ] Mapa guardado");
    }
});
}
// Guarda el mapa cada 30 segundos
setInterval(saveMap, 30 * 1000);



io.sockets.on('connection', function(socket) {
socket.on("loadMap", function(data) {

    // Opcionalmente se puede habilitar la variable room, para crear multiples salas de juego.
    // Esta funcion no esta desarrollada por completo
    //var room =      data["room"];
    var room = "multi";
    var username = data["hash"]; // Es un nombre de usuario o id que uses para identificar a los usuarios
    var secret_key = data["secret_key"]; // Es un hash de validacion, en mi caso use md5, mas info en la documentacion.
    // Variables de la sesion del cliente
    socket.room = room;
    socket.username = username;
    socket.secret_key = secret_key;
    // Agregar username a la lista globar
    usernames[username] = username;
    // Unir a la sala
    roomdata.joinRoom(socket, room);
    console.log("[ User ] Se ha unido a:", username, "a la sala:", room);
    // Mapa
    if (roomdata.get(socket, "map")) {
        var room_map = roomdata.get(socket, "map")
    } else {
        var room_map = map;
        roomdata.set(socket, "map", room_map);
    }
    // Enviar puntuacion actual
    var pixelCount = roomdata.get(socket, socket.username + "_pixel_count");
    if (!pixelCount) {
        pixelCount = 0
    };
    // Enviar tiempo faltante
    var user_time = roomdata.get(socket, socket.username + "_updated_at");
    if (user_time) {
        var delay = functions.level(pixelCount)["delay"];
        var actual_time = Math.floor(Date.now() / 1000);
        var checkTime = Number(delay - (actual_time - user_time));
    } else {
        var checkTime = 0;
    }
    var level = functions.level(pixelCount);
    // Enviar mapa de la partida
    socket.emit("map", {
        room_map: room_map,
        pixel_count: pixelCount,
        pixel_time: checkTime,
        colorCount: level["color"],
        level_count: level["level"],
        level_time: "00:" + level["delay"].toString()
    });
});
socket.on("newPixel", function(data) {
    // Chequea que el usuario existe
 
    if (socket.username) {
        var color = data["color"];
        var x = data["x"];
        var y = data["y"];
        // Chequea que el color existe
        if (colors.indexOf(color) != -1) {
            if (x >= 0 && y >= 0 && x < a && y < a) {
                if (socket.username.toString()) { 
                    var secret_hash = crypto.createHash('md5').update(socket.username.toString()).digest("hex");
                    // Verifica que la session este activa
                    if (secret_hash == socket.secret_key) {
                        var previus_color = roomdata.get(socket, "map")[y][x];
                        if (previus_color == "w") {
                            var add_pxl = 1;
                        } else {
                            var add_pxl = 0;
                        }
                        var actual_time = Math.floor(Date.now() / 1000);
                        var user_time = roomdata.get(socket, socket.username + "_updated_at");
                        if (!user_time) {
                            user_time = 0
                        };
                        var pixelCount = roomdata.get(socket, socket.username + "_pixel_count");
                        if (!pixelCount) {
                            pixelCount = 0
                        };
                        var level = functions.level(pixelCount + add_pxl);
                        var delay = level["delay"];
                        var checkTime = Number(delay - (actual_time - user_time));

                        // Chequea que el mapa exista
                        if (roomdata.get(socket, "map")) {
                            // Chequea el tiempo entre cada pixel
                            //if ((actual_time - user_time) > delay) {
                                // Edita el mapa del servidor
                                roomdata.get(socket, "map")[y][x] = color;
                                // Envia el nuevo pixel a todos los usuarios
                                io.to(socket.room).emit("pixel", {
                                    status: true,
                                    x: x,
                                    y: y,
                                    color: color,
                                });
                                console.log("[ Pixel ] Nuevo Pixel: Usuario:", socket.username,  " X:", x, "Y:", y, "Color:", color);
                                // Envia el countdown al que envio el click
                                socket.emit("countdown", {
                                    countdown: delay,
                                    pixelcount: Number(pixelCount + add_pxl),
                                    colorCount: level["color"],
                                    level_count: level["level"],
                                    level_time: "00:" + level["delay"].toString()
                                });
                                // Edita el tiempo para volver a colorcar un pixel
                                roomdata.set(socket, socket.username + "_updated_at", actual_time);
                                // Sumar un nuevo pixel
                                if (previus_color == "w") {
                                    roomdata.set(socket, socket.username + "_pixel_count", Number(pixelCount + 1));
                                }
                           /* } else {
                                // Devuelve el tiempo faltante
                                socket.emit("pixel_fail", {
                                    countdown: checkTime + 1
                                });
                            }*/
                        } else {
                            console.log("[ Error ] El mapa no existe");
                        }
                    } else {
                        console.log("[ Error ] El username no coincide con el secret_key");
                    }
                } else {
                    console.log("[ Error ] No existe el usuario");
                }
            } else {
                console.log("[ Error ] El pixel esta fuera de los limites");
            }
        } else {
            console.log("[ Error ] El color no existe");
        }
    }
});
socket.on('disconnect', function(data) {
    //	console.log("Usuario Desconectado");
});
});
