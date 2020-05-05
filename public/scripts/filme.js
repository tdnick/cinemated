var movieTemplate = {};

movieTemplate.render = function (obj) {
	return "" +
		"<div class=\"movieItem\">" +
		"<div class=\"movieContent\">" +
		"<h2>" + obj.numeFilm + " (" + obj.anAparitie + ")" + "</h2>" +
		"<h4>" + obj.genFilm + "</h4>" +
		"<p>" + "Regia: " + obj.regizori + "</p>" +
		"<p>" + "Distributie: " + obj.actori + "</p>" +
		"<iframe width=\"420\" height=\"345\" src=\"" + obj.linkTrailer + "\">" + "</iframe>" +
		"<img src=\"" + obj.linkAfis + "\"alt=\"" + obj.numeFilm + "\">" +
		"<p>" + obj.descriere + "</p>" +
		"</div>" +
		"</div>" +
		"";
}

var server = "http://localhost:5000/"
function loadMovies() {
	$.ajax({
		url: server + "movies/",
		method: "GET"
	}).done(function (data) {
		data.forEach(function (film) {
			var item = $(movieTemplate.render(film));
			$("#movies").append(item);
		})
		$("#movies").show(400, "swing");
	});
}

loadMovies();

window.onload = function () {
	var filter = document.getElementById("filter_icon");
	var apasat = false;
	filter.onclick = function(){
		var continut_filtrare = document.getElementById("continut_filtrare");
		if(apasat == false){
			continut_filtrare.style.display = "block";
			apasat = true;
		}
		else {
			continut_filtrare.style.display = "none";
			apasat = false;
		}
	}
	
	var checkboxes = document.querySelectorAll("input[type = 'checkbox']");
	
	var buton_filtrare = document.getElementById("buton_filtrare");
	buton_filtrare.onclick = function() {
		
		var neselectat = false;
		for(let i = 0; i < checkboxes.length; i++)
			if(checkboxes[i].checked == true){
				neselectat = true;
				break;
			}
		if(neselectat == true){
			for(i = 0; i < checkboxes.length; i++){
				var valoare = checkboxes[i].value;
				var sectiune = document.getElementById(valoare);
				if(checkboxes[i].checked == false)
					sectiune.style.display = "none";
				else 
					sectiune.style.display = "block";
					
			}	
		}
		
		
	}
	
	var buton_resetare = document.getElementById("buton_resetare");
	buton_resetare.onclick = function(){
		for(let i = 0; i < checkboxes.length; i++) {
			var valoare = checkboxes[i].value;
			var sectiune = document.getElementById(valoare);
			sectiune.style.display = "block";
			checkboxes[i].checked = false;
		}
	}
	
	
}