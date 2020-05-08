var movieTemplate = {};

movieTemplate.render = function (obj) {
	function classes(genres){
		s = "";
		genres = genres.split(", ");
		for(let i of genres){
			s += i + " ";
		}
		return s;
	}
	
	return "" +
		"<div class=\"" + classes(obj.genFilm) + "movieItem" + "\">" +
		"<h1 class = \"movieName\">" + obj.numeFilm + " (" + obj.anAparitie + ")" + "</h1>" +
		"<h2>" + obj.genFilm + "</h2>" +
		"<p class = \"distribution\">" + "Distributie: " + obj.actori + "</p>" +
		"<img src=\"" + obj.linkAfis + "\"alt=\"" + obj.numeFilm + "\">" +
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
			var allMovies = document.getElementsByClassName("movieItem");
			for(let i = 0; i < allMovies.length; i++){
				var ok = false;
				for(let j = 0; j < checkboxes.length; j++){
					var checkboxValue = checkboxes[j].value;
					if(allMovies[i].classList.contains(checkboxValue)){
						if(checkboxes[j].checked == true)
							ok = true;
					}
				}
				if(ok == true)
					allMovies[i].style.display = "block";
				else
					allMovies[i].style.display = "none";
				
			}
			
			/*
			for(let i = 0; i < checkboxes.length; i++){
				var checkboxValue = checkboxes[i].value;
				var movieDiv = document.getElementsByClassName(checkboxValue);
				for(let j = 0; j < movieDiv.length; j++){
					if(checkboxes[i].checked == false)
						movieDiv[j].style.display = "none";
					else 
						movieDiv[j].style.display = "block";
				}
			}
			*/			
		}
	}
	
	var resetButton = document.getElementById("resetButton");
	resetButton.onclick = function(){
		console.log("ok");
		for(let i = 0; i < checkboxes.length; i++) {
			var checkboxValue = checkboxes[i].value;
			var movieDiv = document.getElementsByClassName(checkboxValue);
			for(let j = 0; j < movieDiv.length; j++){
				movieDiv[j].style.display = "block";
				checkboxes[i].checked = false;
			}
		}
	}
	
	
}