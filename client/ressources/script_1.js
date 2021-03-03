function fill_splits(i,split){
	return (`<div class="row" id="split_${i}_row"><div class="col-3" id="split_${i}_titre"><div class="card badge-dark"><h3 class="card-header">SPLIT : ${split.Name}</h3><img src="${split.icone}" alt="Card image"><div class="card-body"><p class="card-text">${split.Détail}</p></div></div></div><div class="col-9 outline-dark card-columns" id="split_${i}_participants"></div></div></br>`);
}
function fill_participants(i,participant){
	return (`<div class="card badge-dark"><h3 class="card-header">${participant.pseudo}</h3><h4>RANK <span class="badge badge-pill">${i}</span></h4><h4>TEMPS <span class="badge badge-pill">${participant.temps}</span></h4></div>`);
}
