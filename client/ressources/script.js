var es = new EventSource('/sse');
var id = sessionStorage.getItem('id');
var pseudo = sessionStorage.getItem('pseudo');
if (id == null || id == "" || pseudo == null || pseudo == "") {
    var pseudo = prompt("Quel est ton pseudo ?", "Manuel Ferrara");
    if (pseudo == null || pseudo == "") {
        document.location.reload();
    } else {
        id = Math.random().toString(36).substring(2, 15) + Date.now() + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('id', id);
        sessionStorage.setItem('pseudo', pseudo);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log('add_player', xhttp.responseText);
            }
        };
        xhttp.open("POST", "add_player" + '?id=' + id + "&pseudo=" + pseudo, true);
        xhttp.send();

    }
} else {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('add_player', xhttp.responseText);
        }
    };
    xhttp.open("POST", "add_player" + '?id=' + id + "&pseudo=" + pseudo, true);
    xhttp.send();
}


es.onmessage = function (event) {
	actualise(event);
};
es.addEventListener('UPDATE', function(event) {
	actualise(event);
});
function actualise(event){
	document.getElementById("main").innerHTML = "";
	splits.forEach((item, i) => {
		document.getElementById("main").innerHTML += fill_splits(i,item);
	});
	var reponse = JSON.parse(event.data);

	if (reponse.en_cours){document.getElementById('COUNTDOWN_').innerHTML = "PARTIE EN COURS";}

    console.log("UPDATE", reponse);
    var tableau = []
    for (const [key, value] of Object.entries(reponse.players)) {
		tableau.push(reponse.players[key])
    }
    tableau.sort(
        function(a, b) {
            if (a.étape === b.étape) {return a.time_key - b.time_key;}
            return a.étape < b.étape ? 1 : -1;
		}
	);

	console.log(tableau);

    tableau.forEach((item, i) => {
    	document.getElementById(`split_${item.étape}_participants`).innerHTML+=fill_participants(i+1,item);
    });

}







es.addEventListener('COUNTDOWN', function(event) {
	var brut = JSON.parse(event.data);
    console.log('COUNTDOWN', brut );
	document.getElementById('COUNTDOWN_').innerHTML = brut;
});


function buzz() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('buzz', xhttp.responseText);
        }
    };
    xhttp.open("POST", "next_step?id=" + id + "&millisecondes=" + Date.now(), true);
    xhttp.send();
}

function fill_splits(i,split){
	return (`<div class="row" id="split_${i}_row"><div class="col-3" id="split_${i}_titre"><div class="card badge-dark"><h3 class="card-header">SPLIT : ${split.Name}</h3><img src="${split.icone}" alt="Card image"><div class="card-body"><p class="card-text">${split.Détail}</p></div></div></div><div class="col-9 outline-dark card-columns" id="split_${i}_participants"></div></div></br>`);
}
function fill_participants(i,participant){
	var base = "dark"
	if (i==1) base="warning"
	if (i==2) base="primary"
	if (i==3) base="success"
	return (`<div class="card badge-dark bg-${base}"><h3 class="card-header"><button type="button" class="close" onclick="kill_player('${participant.id}')">&times;</button>${participant.pseudo}</h3><h4>RANK <span class="badge badge-pill">${i}</span></h4><h4>TEMPS <span class="badge badge-pill">${participant.temps}</span></h4></div>`);
}


var pathname = window.location.pathname + "/";


function start() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('start', xhttp.responseText);
        }
    };
    xhttp.open("POST", pathname+"start", true);
    xhttp.send();
}

function kill_player(id_joueur) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log('buzz', xhttp.responseText);
        }
    };
    xhttp.open("POST", pathname+ "kill_player?id=" + id_joueur, true);
    xhttp.send();
}
