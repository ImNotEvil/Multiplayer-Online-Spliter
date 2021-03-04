var SSE = require('express-sse');
var express = require("express");
var app = express();
var moment = require("moment");

const fs = require('fs');
var sse = new SSE();
var id_admin = Array.from('1'.repeat(5), x => Math.random().toString(36).substring(2, 15)).join('');
var information = {
    "debut": null,
    "en_cours": false,
    "players_id": [],
    "players": {}
};
sse.updateInit(information);

function update_sse() {
    sse.updateInit(information);
    sse.send(information, 'UPDATE');
}

function formatage(milliseconds) {
    return moment.utc(milliseconds - information.debut).format("HH:mm:ss.SSS");
}

app.use('/ressources', express.static(__dirname + '/client/ressources'));
app.get("/", (req, res) => {
    console.log("/");
    res.sendFile(__dirname + "/client/client.html")
})
app.get(`/${id_admin}/`, (req, res) => {
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
			"id" : id,	
            "pseudo": pseudo,
            "étape": 0,
            "temps": "",
            "time_key": 0
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

    if (information.en_cours && information.players_id.includes(id)) {
        information.players[id].temps = formatage(millisecondes);
        information.players[id].time_key = parseInt(millisecondes);
        information.players[id].étape = information.players[id].étape + 1;
        update_sse();
    }
    res.send("next_step");
})

app.post(`/${id_admin}/start`, (req, res) => {
    console.log("/start");
    if (!information.en_cours) {
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
                            setTimeout(function() {
                                //0
                                information.en_cours = true;
                                information.debut = Date.now();
                                update_sse();
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }
    res.send("start");
})

app.post(`/${id_admin}/kill_player`, (req, res) => {

    console.log("/kill_player");
    var id = req.query.id;

    if (information.players_id.includes(id)) {

		information.players_id = information.players_id.filter(item => item !== id);

		delete information.players[id];

        update_sse();
    }
    res.send("kill_player");
})


app.listen(8080, () => {
    console.log("HTTP Server started on port 8080");
	console.log("id_admin : ", id_admin);
})
