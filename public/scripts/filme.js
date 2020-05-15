window.onload = function () {
	// when we press the "filterIcon", all filtering choices appear in the page
	// if we press again, they dissapear
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
	
	// filter button
	var checkboxes = document.querySelectorAll("input[type = 'checkbox']");
	var filterButton = document.getElementById("filterButton");
	
	filterButton.onclick = function() {
		// if no checkbox is selected, we ignore the genre filtering
		var selected = false;
		for(let i = 0; i < checkboxes.length; i++)
			if(checkboxes[i].checked == true){
				selected = true;
				break;
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
			
			/*
			// doesn't work for movies with multiple genres 
			// depends on the position of the checkbox value
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
	
	// Reset button
	var resetButton = document.getElementById("resetButton");
	resetButton.onclick = function(){
		// console.log("ok");
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