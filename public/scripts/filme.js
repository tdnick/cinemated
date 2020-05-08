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
	// cand apasam pe "filterIcon", toate variantele de filtrare apar in pagina
	// daca apasam din nou, acestea dispar
	var filter = document.getElementById("filterIcon");
	var clicked = false;
	filter.onclick = function(){
		var filterContent = document.getElementById("filterContent");
		if(clicked == false){
			filterContent.style.display = "block";
			clicked = true;
		}
		else {
			filterContent.style.display = "none";
			clicked = false;
		}
	}
	
	var checkboxes = document.querySelectorAll("input[type = 'checkbox']");
	
	var filterButton = document.getElementById("filterButton");
	filterButton.onclick = function() {
	
		var selected = false;
		for(let i = 0; i < checkboxes.length; i++)
			if(checkboxes[i].checked == true){
				selected = true;
				break;
			}
		if(selected == true){
			for(i = 0; i < checkboxes.length; i++){
				var checkboxValue = checkboxes[i].value;
				var movieSection = document.getElementById(checkboxValue);
				if(checkboxes[i].checked == false)
					movieSection.style.display = "none";
				else 
					movieSection.style.display = "block";
					
			}	
		}
		
		
	}
	
	var resetButton = document.getElementById("resetButton");
	resetButton.onclick = function(){
		for(let i = 0; i < checkboxes.length; i++) {
			var checkboxValue = checkboxes[i].value;
			var movieSection = document.getElementById(checkboxValue);
			movieSection.style.display = "block";
			checkboxes[i].checked = false;
		}
	}
	
	
}