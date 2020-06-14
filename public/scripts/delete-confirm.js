function sigur_user(id) {
	cf = confirm("Ești sigur că dorești să îți ștergi contul? Operațiunea este ireversibilă!");
	if (cf){
		location.href = "/deleteuser?id=" + id;
	}
}

function sigur_film(id) {
	cf = confirm("Ești sigur că dorești să ștergi acest film? Operațiunea este ireversibilă!");
	if (cf){
		location.href = "/delete?id=" + id;
	}
}

