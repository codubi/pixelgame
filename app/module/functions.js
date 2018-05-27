module.exports.level = function (level) { 
 
        // Niveles y sus propiedades
        var levels = {
            0 : { delay : 30, color : "blue", level : 1 },
            5 : { delay : 28, color : "lightblue", level : 2 },
            10 : { delay : 27, color : "lightgreen", level : 3 },
            20 : { delay : 25, color : "green", level : 4 },
            35 : { delay : 24, color : "lightorange", level : 5 },
            50 : { delay : 22, color : "orange", level : 6 },
            60 : { delay : 21, color : "purple", level : 7 },
            80 : { delay : 20, color : "red", level : 8 },
            100 : { delay : 19, color : "brown", level : 9 },
            120 : { delay : 18, color : "grey", level : 10 },
            150 : { delay : 17, color : "yellow", level : 11 },
            200 : { delay : 15, color : "black", level : 12 },
            300 : { delay : 14, color : "black", level : 13 },
            400 : { delay : 13, color : "black", level : 14 },
            500 : { delay : 12, color : "black", level : 15 },
            700 : { delay : 11, color : "black", level : 16 },
            1000 : { delay : 10, color : "black", level : 17 }
        }; 
         
        
            if(level < 1000){ 
                var i = 0;
                for (var key in levels) {
                    if(level < key){ 
                        var key_obj = Object.keys(levels)[i-1];
                        return levels[key_obj];
                    }
                i++;
                }
            }else{
                return levels[1000];
            }  
        
        
};