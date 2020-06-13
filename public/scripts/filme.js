window.onload = function () {
	// when we press the "filterIcon", all filtering choices appear in the page
	// if we press again, they disappear
	var filter = document.getElementById("filterIcon");
	var addMovie = document.getElementById("addMovieIcon");
	var closeButton = document.getElementById("closeButton");
	var clickedF = false;
	var clickedM = false;
	
	filter.onclick = function(){
		var filterContent = document.getElementById("filterContent");
		if(clickedF == false){
			filterContent.style.display = "block";
			clickedF = true;
		}
		else {
			filterContent.style.display = "none";
			clickedF = false;
		}
	}
	
	addMovie.onclick = function () {
		var addMovieDiv = document.getElementById("addMovie");
		if(clickedM == false){
			addMovieDiv.style.display = "block";
			clickedM = true;
		}
	}
	
	closeButton.onclick = function () {
		var addMovieDiv = document.getElementById("addMovie");
		if(clickedM == true){
			addMovieDiv.style.display = "none";
			clickedM = false;
		}
	}
	
	// filter button
	var checkboxes = document.querySelectorAll("input[type = 'checkbox']");
	var filterButton = document.getElementById("filterButton");
	
	filterButton.onclick = function() {
		// Filtering by genre (checkbox)
		// if no checkbox is selected, we ignore the genre filtering
		var selected = false;
		for(let i = 0; i < checkboxes.length; i++)
			if(checkboxes[i].checked == true){
				selected = true;
				break;
			}
		if(selected == false){
			for(let i = 0; i < checkboxes.length; i++) {
				var checkboxValue = checkboxes[i].value;
				var movieDiv = document.getElementsByClassName(checkboxValue);
				for(let j = 0; j < movieDiv.length; j++){
					movieDiv[j].style.display = "block";
				}
			}
		}
		// if at least one checkbox is selected, we go through every movie
		// for every checkbox value, we verify if the value exists between the classes of that movie
		// if at least one of them exists and is checked, we display the movie; if not, display = none
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
			// if there are no movies with that value, we display a message
			var noMovie = document.getElementById("noMovie");
			if(ok == true){
				noMovie.style.display = "none";
			}
			else {
				noMovie.style.display = "block";
				filterContent.style.display = "none";
			}			
		}
		
		// Sorting movies (select)
		var selectList = document.getElementById("selectFilter");
		var chosenValue = selectList.options[selectList.selectedIndex].text;
		var moviePlace = document.getElementById("movies");
		// Default: sorted by id
		if(chosenValue == "Selecteaza optiunea"){
			var allMovies = document.getElementsByClassName("movieItem");
			allMovies = Array.prototype.slice.call(allMovies);
			allMovies.sort(function(a, b){
				var movie1 = a.getElementsByTagName("a")[0].classList[0];
				var movie2 = b.getElementsByTagName("a")[0].classList[0];
				return movie1 - movie2;
			});
			for (m of allMovies){
				moviePlace.appendChild(m);
			}
		}
		// Sorting movies alphabetically (A-Z or Z-A)
		if(chosenValue == "Nume A-Z" || chosenValue == "Nume Z-A"){
			var allMovies = document.getElementsByClassName("movieItem");
			allMovies = Array.prototype.slice.call(allMovies);
			allMovies.sort(function(a, b){
				var movie1 = a.getElementsByTagName("h1")[0].textContent;
				var movie2 = b.getElementsByTagName("h1")[0].textContent;
				movie1 = movie1.substr(0, movie1.length - 7);
				movie2 = movie2.substr(0, movie2.length - 7);
				if(chosenValue == "Nume A-Z")
					return movie1.localeCompare(movie2);
				else if(chosenValue == "Nume Z-A")
					return movie2.localeCompare(movie1);
			});
			for (m of allMovies){
				moviePlace.appendChild(m);
			}
		}
		// Sorting movies by duration
		if(chosenValue == "Crescator dupa durata" || chosenValue == "Descrescator dupa durata"){
			var allMovies = document.getElementsByClassName("movieItem");
			allMovies = Array.prototype.slice.call(allMovies);
			allMovies.sort(function(a, b){
				var movie1 = a.getElementsByTagName("p")[0].textContent;
				var movie2 = b.getElementsByTagName("p")[0].textContent;
				movie1 = parseInt(movie1);
				movie2 = parseInt(movie2);
				if(chosenValue == "Crescator dupa durata")
					return movie1 - movie2;
				else if(chosenValue == "Descrescator dupa durata")
					return movie2 - movie1;
			});
			for (m of allMovies){
				moviePlace.appendChild(m);
			}
		}
		// Sorting movies by year
		if(chosenValue == "Cele mai recente" || chosenValue == "Cele mai vechi"){
			var allMovies = document.getElementsByClassName("movieItem");
			allMovies = Array.prototype.slice.call(allMovies);
			allMovies.sort(function(a, b){
				var movie1 = a.getElementsByTagName("h1")[0].textContent;
				var movie2 = b.getElementsByTagName("h1")[0].textContent;
				movie1 = movie1.substr(movie1.length - 7, 6);
				movie2 = movie2.substr(movie2.length - 7, 6);
				if(chosenValue == "Cele mai recente")
					return movie2.localeCompare(movie1);
				else if(chosenValue == "Cele mai vechi")
					return movie1.localeCompare(movie2);
			});
			for (m of allMovies){
				moviePlace.appendChild(m);
			}
		}
	}
	
	// Reset button
	var resetButton = document.getElementById("resetButton");
	resetButton.onclick = function(){
		// checkbox reset
		for(let i = 0; i < checkboxes.length; i++) {
			var checkboxValue = checkboxes[i].value;
			var movieDiv = document.getElementsByClassName(checkboxValue);
			for(let j = 0; j < movieDiv.length; j++){
				movieDiv[j].style.display = "block";
				checkboxes[i].checked = false;
			}
		}
		// select reset
		var selectList = document.getElementById("selectFilter");
		selectList.selectedIndex = 0;
		var moviePlace = document.getElementById("movies");
		var allMovies = document.getElementsByClassName("movieItem");
		allMovies = Array.prototype.slice.call(allMovies);
		allMovies.sort(function(a, b){
			var movie1 = a.getElementsByTagName("a")[0].classList[0];
			var movie2 = b.getElementsByTagName("a")[0].classList[0];
			return movie1 - movie2;
		});
		for (m of allMovies){
			moviePlace.appendChild(m);
		}
	}
}

// search bar
function searchMovie() {
	var input = document.getElementById('searchBar').value;
	input = input.toLowerCase();
	if( input !== ""){
	var allMovies = document.getElementsByClassName("movieItem");
	ok = true;
	for(let i = 0; i < allMovies.length; i++){
		var title = allMovies[i].getElementsByTagName("h1")[0].textContent;
		title = title.substr(0, title.length - 7);
		if(!title.toLowerCase().includes(input)){
			allMovies[i].style.display = "none";
		}
		else {
			allMovies[i].style.display = "block";
			ok = false;
		}
	}
	// if there are no movies with that value, we display a message
	var noMovie = document.getElementById("noMovie");
	if(ok == false){
		noMovie.style.display = "none";
	}
	else {
		noMovie.style.display = "block";
	}
	}
}