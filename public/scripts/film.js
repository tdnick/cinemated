window.onload=function(){
	var butt = document.getElementById("but");
	butt.addEventListener('click',function(){
		idEcranizare= document.getElementById("selectScreening").value;
		idFilm= document.location.search.replace(/^.*?\=/,'');
		localStorage.setItem('idFilm',idFilm);
		localStorage.setItem('idEcranizare',idEcranizare);
		window.document.location='choose'+'?id='+idEcranizare;
	});
}