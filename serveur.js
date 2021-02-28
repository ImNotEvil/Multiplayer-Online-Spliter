var SSE = require('express-sse');
var express = require("express");
var app = express();
var moment = require("moment");

const fs = require('fs');

var sse = new SSE();

var information = {
	"debut" : null,
    "en_cours": false,
    "players_id": [],
    "players": {}
};
sse.updateInit(information);



//const SPLITS = JSON.parse(fs.readFileSync('splits.json', 'utf8'));


function update_sse() {
    sse.updateInit(information);
    sse.send(information, 'UPDATE');
}

function formatage(milliseconds){
	return (moment.duration(milliseconds-information.debut, "milliseconds").format("h:mm:ss:SS"));
}

app.get("/sse", (req, res) => {
    console.log("/");
    res.sendFile(__dirname + "/client/client.html")
})
app.get('/sse', sse.init);

app.post("/add_player", (req, res) => {

    console.log("/add_player");
    var id = req.query.id
    var pseudo = req.query.pseudo

    if (!information.players_id.includes(id)) {

        information.players_id.push(id);
        information.players[id] = {
            "pseudo": pseudo,
            "étape": 0,
            "temps": "",
			"time_key" : 0;
        }
        update_sse();
    }
    res.send("add_player");
})
app.post("/next_step", (req, res) => {

    console.log("/next_step");
    var id = req.query.id;
    var pseudo = req.query.pseudo;
	var millisecondes = req.query.millisecondes;

    if (information.en_cours && !information.players_id.includes(id)) {

		information.players.temps = formatage(millisecondes);
		information.players.time_key = millisecondes;
		information.players[id].étape = information.players[id].étape+1;

        update_sse();
    }
    res.send("next_step");
})


app.post("/start", (req, res) => {
    console.log("/start");
    if (!information.en_cours) {
		information.en_cours=false;
        setTimeout(function() {
            //1
            sse.send(4, 'COUNTDOWN');
            setTimeout(function() {
                //2
                sse.send(3, 'COUNTDOWN');
                setTimeout(function() {
                    //3
                    sse.send(2, 'COUNTDOWN');
                    setTimeout(function() {
                        //4
                        sse.send(1, 'COUNTDOWN');
                        setTimeout(function() {
                            //5
                            sse.send("GO", 'COUNTDOWN');
							information.debut = Date.now();
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }
})

app.listen(8080, () => {
    console.log("HTTP Server started on port 8080");
})
