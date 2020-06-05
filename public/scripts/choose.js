//sum total money
function recalculateTotal(total) {
	var selections = document.getElementsByTagName("select");
	var labels = document.getElementsByClassName("pret");
	var total = document.getElementsByClassName("total");
	total[0].value = 0;
	for(let i=0;i<4;i++){
		total[0].value += selections[i].value*labels[i].value;
	}		
	total[0].innerHTML = "Total: "+total[0].value;
}
function creare_select(tip){
	var choosig_box=document.getElementById("choosing_box");
	var container=document.createElement("div");
	container.className="container"
	choosig_box.appendChild(container);
	
	var select_tip=document.createElement("select");
	var label_tip=document.createElement("label");
	
	label_tip.innerHTML="Alegeti numarul de bilete pentru "+tip+":";
	container.appendChild(label_tip);
	
	for(i=0;i<=10;i++){
		let option_tip = document.createElement("option");
		option_tip.innerHTML=i;
		option_tip.setAttribute("value",i);
		option_tip.style.color="black";
		select_tip.appendChild(option_tip);
		
	}
	select_tip.style.color="black";
	container.appendChild(select_tip);	
	var pret=document.createElement("label");	
	if(tip=="adulti"){
		pret.value=15;
	}
	if(tip=="copii"){
		pret.value=7;
	}
	if(tip=="elevi"){
		pret.value=10;
	}
	if(tip=="studenti"){
		pret.value=10;
	}
	pret.innerHTML = "pret:"+pret.value+"lei";
	container.appendChild(pret);
	pret.className = "pret";
	
}
window.onload=function(){
	
	var choosig_box=document.getElementById("choosing_box");
	creare_select("adulti");
	creare_select("copii");
	creare_select("elevi");
	creare_select("studenti");	
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
}
		
	
