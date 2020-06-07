//sum total money
function recalculateTotal(total) {
	var selections = document.getElementsByTagName("select");
	var labels = document.getElementsByClassName("price");
	var total = document.getElementsByClassName("total");
	total[0].value = 0;
	for(let i=0;i<4;i++){
		total[0].value += selections[i].value*labels[i].value;
	
	}		
	total[0].innerHTML = "Total: "+total[0].value;
}
function create_select(type){
	var choosig_box=document.getElementById("choosing_box");
	var container=document.createElement("div");
	container.className="container"
	choosig_box.appendChild(container);
	
	var select_type=document.createElement("select");
	var label_type=document.createElement("label");
	
	label_type.innerHTML="Alegeti numarul de bilete pentru "+type+":";
	container.appendChild(label_type);
	
	for(i=0;i<=10;i++){
		let option_type = document.createElement("option");
		option_type.innerHTML=i;
		option_type.setAttribute("value",i);
		option_type.style.color="black";
		select_type.appendChild(option_type);
		
	}
	select_type.style.color="black";
	container.appendChild(select_type);	
	var price=document.createElement("label");	
	if(type=="adulti"){
		price.value=15;
	}
	if(type=="copii"){
		price.value=7;
	}
	if(type=="elevi"){
		price.value=10;
	}
	if(type=="studenti"){
		price.value=10;
	}
	price.innerHTML = "pret:"+price.value+"lei";
	container.appendChild(price);
	price.className = "price";
	
}
window.onload=function(){
	
	var choosig_box=document.getElementById("choosing_box");
	var butt = document.getElementById("but");
	
	create_select("adulti");
	create_select("copii");
	create_select("elevi");
	create_select("studenti");	
	var total=document.createElement("label");
	total.value=0;

	total.innerHTML = "Total: "+total.value;
	total.className ="total";
	choosig_box.appendChild(total);
	var selections = document.getElementsByTagName("select");	
	selections[0].onchange = function(){recalculateTotal()};
	selections[1].onchange = function(){recalculateTotal()};
	selections[2].onchange = function(){recalculateTotal()};
	selections[3].onchange = function(){recalculateTotal()};
	butt.addEventListener('click',function(){
		var total=document.getElementsByClassName("total");
		localStorage.setItem('total',total[0].value);		
		var selections = document.getElementsByTagName("select");
		var nrTickets = 0;
		for(let i = 0;i < 4; i++){
			nrTickets += parseInt(selections[i].value);
		}
		localStorage.setItem('nrTickets',nrTickets);
		localStorage.setItem('nrAdulti',selections[0].value);
		localStorage.setItem('nrCopii',selections[1].value);
		localStorage.setItem('nrElevi',selections[2].value);
		localStorage.setItem('nrStudenti',selections[3].value);
		
		idEcranizare = localStorage.getItem("idEcranizare");
		window.document.location='locuri'+'?id='+idEcranizare;
	
	});
}
		
	
