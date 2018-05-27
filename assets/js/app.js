
        // Variables
        var game = document.getElementById("game");
        var game_ctx = game.getContext("2d");
        var gameW = game.width;
        var gamePixel = 360;
        var c = gameW / gamePixel;
        var selectColor = 'r';
        
        // Mapa

        var map;
        // Funciones
        

        
        function parseColor(a){
    
        var parse = {
            r : "ca0000", // red
            p : "D81B60", // pink
            v : "8E24AA", // purple
            c : "006699", // blue
            l : "0075c7", // lightblue
            g : "009933", // green
            h : "14b53e", // lightgreen
            y : "ffcc33", // yellow
            o : "FB8C00", // orange
            w : "FFFFFF", // white
            z : "a9a9a9", // grey
            b : "131313", // black
            k : "f5bb80", // lightorange
            m : "795548", // brown
            };
        
            return "#" + parse[a];
    
        }

        function pixel(event) {
            if(secret_key_pixelgame == "null"){
                swal("Error", "Debes tener una sesion activa en Voxed hace mas de 1 dia para poder dibujar", "error");
            }else{
                var x = Math.floor(event.offsetX / c);
                var y = Math.floor(event.offsetY / c);
                drawMap(y, x, selectColor);
                socket.emit('newPixel', { y : y, x : x, color : selectColor });
            }
        }  

        function reload(){
            //console.log(map);
            map.forEach(function(key, y2) {
            key.forEach(function(key2, x2) {
                        draw(y2, x2, parseColor(key2));
            });
            });
        }


        function draw(y, x, color){

            var x = x*c;
            var y = y*c;
            

            game_ctx.fillStyle = color;
            game_ctx.fillRect(x, y, c, c);
            game_ctx.strokeStyle = "#e2e2e2";
            game_ctx.lineWidth   = 1;
            game_ctx.strokeRect(x,y, c,c);
            game_ctx.stroke();
        }

        function drawMap(y, x, color){

            // Edita el array del mapa
            map[y][x] = color;
    
        }
        


        // sockets


        

        socket.on("map", function(data){
            
            map = data["room_map"];
            var pixel_count = data["pixel_count"];
            var pixel_time = data["pixel_time"];
            var level_count = data["level_count"];
            var level_time = data["level_time"];
            sumPixel(pixel_count);
            sumLevel(level_count);
            sumTime(level_time); 
            $(".pixelCount").attr('class', 'pixelCount').addClass(data["colorCount"]);
            console.log(data); 
            if(pixel_time > 0) { countDown(pixel_time) }; 
            reload(); 
        });  

        socket.on("countdown", function(data){
            $(".pixelCount").attr('class', 'pixelCount').addClass(data["colorCount"]);
            countDown(data["countdown"]);
            sumPixel(data["pixelcount"]);
            var level_count = data["level_count"];
            var level_time = data["level_time"];
            sumLevel(level_count);
            sumTime(level_time); 
        });  

        socket.on("pixel", function(data){

            var status = data["status"];
            
            
            if(status){
                var y = data["y"];
                var x = data["x"];
                var color = data["color"];
                //console.log(y, x, color);
                draw(y,x, parseColor(color));
                //$(".time").show();
                
            }

            
        });  

        socket.on("pixel_fail", function(data){

     
                swal("Ya falta poco", "Debes esperar " + data["countdown"] + " segundos para volver a dibujar", "error")
            
            });  
 

        function FormatMe(n) {
            return (n<10) ? '0'+n : n;
         }
         

         function sumPixel(number){
            $(".pixelCount").find("span").slice(0, 1).html("<i class='fas fa-gem'></i>" + number);
         }

         function sumLevel(number){
            $(".pixelCount").find("span").slice(1, 2).html("<i class='fas fa-bolt'></i>" + number);
         }

         function sumTime(number){
            $(".pixelCount").find("span").slice(2, 3).html("<i class='fas fa-clock'></i>" + number);
         }

        function countDown(timeLeft){
            
            $(".time").show();
            timeLeft = timeLeft;
            var elem = $(".time").find("span");
        
            var timerId = setInterval(Intcountdown, 1000);
            // Return a string padded
            
            function Intcountdown() {
              if (timeLeft == 0) {
                clearTimeout(timerId);
                $(".time").hide();
                document.title = "Listo!";
              } else {
                var t = "00:" + FormatMe(timeLeft);
                document.title = t;
                elem.html(t);
                timeLeft--;
              }
            }
        }
         
        // Seleccionar color

        $("*[data-select]").on("click", function(){ 
            selectColor = $(this).data("select") 
            $(".selectColor").removeClass("selectColor");
            $(this).addClass("selectColor");
        });

