window.onload = function(){
	var butt = document.getElementById("but");
	butt.onclick = function() {
		idEcranizare = document.getElementById("selectScreening").value;
		idFilm = document.location.search.replace(/^.*?\=/,'');
		localStorage.setItem('idFilm',idFilm);
		movieName = document.getElementById("movieName").innerHTML;
		localStorage.setItem('movieName',movieName);
		localStorage.setItem('idEcranizare',idEcranizare);
		let params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=750,height=570,left=300,top=75';
		window.open('http://localhost:5000/choose' + '?id='+idEcranizare, 'Choose', params);
	}
}
