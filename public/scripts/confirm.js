window.onload=function(){
	
	var ul = document.getElementById("selectedSeats");
	var seats = localStorage.getItem("selectedSeats").split(",");
	for(seat in seats){
		let li = document.createElement("li");
		let inside = seats[seat].split(" ");
		li.appendChild(document.createTextNode('R'+inside[0]+' S'+inside[1]));
		ul.appendChild(li);
		}
	
	var nrTickets = document.getElementById("NrTickets");
	var nrElevi= localStorage.getItem("nrElevi");
	var nrAdulti = localStorage.getItem("nrAdulti");
	var nrCopii = localStorage.getItem("nrCopii");
	var nrStudenti = localStorage.getItem("nrStudenti");
	nrTickets.innerHTML=nrElevi+' elevi,'+nrAdulti+' adulti,'+nrCopii+' copii,'+nrStudenti+' studenti';
	document.getElementById("bilete").value=nrElevi+','+nrAdulti+','+nrCopii+','+nrStudenti;
	document.getElementById("locuri").value=localStorage.getItem("selectedSeats");
	
	var total = document.getElementById("total");
	total.innerHTML = localStorage.getItem("total")+' lei';
}
