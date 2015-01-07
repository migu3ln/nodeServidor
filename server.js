var io = require('socket.io').listen(3000);
console.log("ss");
clicks = 0;
$dataReport = {};
$numeros = 0;
function cambiarDatos($cambio, $conectados, $mostrar) {
    if ($cambio) {
        $numeros = $conectados;
        $cambiar = $mostrar;
    }
    $columns = {
        title: {text: ""},
        credits: {
            enabled: false
        },
        chart: {
            marginTop: "35",
            height: "320",
            type: "column"
        },
        plotOptions: {
            column: {
                depth: 70
            }},
        tooltip: {
            pointFormat: "{series.name}: <b>{point.y:.2f}<\/b>"
        },
        xAxis: {
            categories: ["Conectados"]
        },
        yAxis: {
            title: {
                text: "Conectados"},
            allowDecimals: true
        },
        series:
                [
                    {
                        name: "Conectados",
                        data: [$numeros]
                    }
                ],
        cambiar: {
            mostrar: $cambiar
        }

    };
//    dataReport = {
//        chart: {
//            plotBackgroundColor: null,
//            plotBorderWidth: 1, //null,
//            plotShadow: false
//        },
//        title: {
//            text: 'Usuarios Conectados'
//        },
//        tooltip: {
//            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
//        },
//        plotOptions: {
//            pie: {
//                allowPointSelect: true,
//                cursor: 'pointer',
//                dataLabels: {
//                    enabled: true,
//                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
//                    style: {
//                        color: 'black'
//                    }
//                }
//            }
//        },
//        series: [{
//                type: 'pie',
//                name: 'Browser share',
//                data: [
//                    ['Desconectados', 1],
//                    {
//                        name: 'Conectados',
//                        y: $numeros,
//                        sliced: true,
//                        selected: true
//                    }
//
//                ]
//            }],
//        cambiar: {
//            mostrar: $cambiar
//        }
//    };
    return $columns;
}
io.sockets.on('connection', function(socket) {
    console.log("conectado");
    $dataReport = cambiarDatos(true, $numeros, true);
    //Emitimos nuestro evento connected
    //Devolvemos el ping con los milisegundos al cliente para que pueda calcular la latencia.
    socket.on('ping', function(data, callback) {
        if (callback && typeof callback == 'function') {
            callback(data);
        }
    });
    //Si llega un mensaje del chat de un usuario lo limpiamos y reenviamos a todos los demás.
    socket.on('msg', function(data) {
        $numeros++;
        $dataReport = cambiarDatos(true, $numeros, false);
        io.sockets.emit('msg', data);
    });

    socket.on('mostrarInfo', function(data) {
        console.log("data", data);
        console.log("clicks" + clicks);
        io.sockets.emit('mostrarInfo', clicks);
    }
    );
    socket.emit('connected');
    //Permanecemos a la escucha del evento click
    socket.on('click', function() {
        //Sumamos el click
        clicks++;
        console.log(clicks);
        //Emitimos el evento que dirá al cliente que hemos recibido el click
        //y el número de clicks que llevamos
        socket.broadcast.emit('otherClick', clicks);
    });
});