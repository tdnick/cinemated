window.onload = function () {
    var ratedIndex = -1;
    var avrageRaitingColor = '#ffd700';
    var userRaitingColor = '#9b7617';
    var user = document.getElementById("user").textContent;
    var starRaiting = document.getElementById("raiting").textContent;
    const nStars = document.querySelectorAll(".nr");
    var usernameList = this.document.querySelectorAll(".usernames");

    setStars(starRaiting, avrageRaitingColor);

    if (user) {
        // Userul este autentificat

        // Verific daca user-ul a dat deja recenzie
        var username = this.document.getElementById("username").textContent;
        var exists = false;
        var nrStars;
        for (var i = 0; i < usernameList.length; i++) {
            if (usernameList[i].textContent == username) {
                exists = true;
                nrStars = nStars[i].textContent;
            }
        }

        if (exists == true) {
            // Userul a votat deja filmul
            setStars(nrStars, userRaitingColor);
            document.getElementById("raiting").innerHTML = starRaiting;
            $('.movieStars').mouseover(function () {
                $('#cRaiting .tooltiptext2').css('visibility', 'visible');
            });

            $('.movieStars').mouseleave(function () {
                $('#cRaiting .tooltiptext2').css('visibility', 'hidden');
            });


        } else {
            // Userul nu a dat inca o recenzie

            // Click pe stele
            $('.movieStars').on('click', function () {
                ratedIndex = parseInt($(this).data('index'));
                document.getElementById("starsInput").value = ratedIndex + 1;


                var modal = document.getElementById("myModal");
                var span = document.getElementsByClassName("close")[0];
                modal.style.display = "block";
                span.onclick = function () {
                    modal.style.display = "none";
                }
                window.onclick = function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                }

                // Hover pe modal => se pastreaza formatul raiting-ului user-ului
                $('.modal').mouseover(function () {
                    setStars(ratedIndex + 1, userRaitingColor);
                    document.getElementById("raiting").innerHTML = (ratedIndex + 1).toFixed(1);
                });

                // Daca am parasit modalul se revine la raiting-ul mediu
                $('.modal').mouseleave(function () {
                    setStars(starRaiting, avrageRaitingColor);
                    document.getElementById("raiting").innerHTML = starRaiting;
                });

            });

            // Hover pe stele
            $('.movieStars').mouseover(function () {
                resetStarColors();
                var currentIndex = parseInt($(this).data('index'));
                setStars(currentIndex + 1, userRaitingColor);
                document.getElementById("raiting").innerHTML = (currentIndex + 1).toFixed(1);
            });

            $('.movieStars').mouseleave(function () {
                setStars(starRaiting, avrageRaitingColor);
                document.getElementById("raiting").innerHTML = starRaiting;
            });
        }

    } else {
        // User-ul nu s-a autentificat deci nu poate da recenzie
        $('.movieStars').mouseover(function () {
            $('#cRaiting .tooltiptext').css('visibility', 'visible');
        });

        $('.movieStars').mouseleave(function () {
            $('#cRaiting .tooltiptext').css('visibility', 'hidden');
        });
        
    }

    // Setez raiting-ul fiecarui user din sectiunea de comentarii
    var k = 0;
    for (var i = 0; i < nStars.length; i++) {
        for (var j = 0; j < nStars[i].textContent; j++) {
            $('.review:eq(' + k + ')').css('color', '#daa520');
            $('.review:eq(' + k + ')').removeClass('far');
            $('.review:eq(' + k + ')').addClass('fas');
            k += 1;
        }
        k += 5 - nStars[i].textContent;
    }

    var butt = document.getElementById("but");
    butt.onclick = function () {
        idEcranizare = document.getElementById("selectScreening").value;
        idFilm = document.location.search.replace(/^.*?\=/, '');
        localStorage.setItem('idFilm', idFilm);
        movieName = document.getElementById("movieName").innerHTML;
        localStorage.setItem('movieName', movieName);
        localStorage.setItem('idEcranizare', idEcranizare);
        let params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=750,height=570,left=300,top=75';
        window.open('http://localhost:5000/choose' + '?id=' + idEcranizare, 'Choose', params);
    }
};

function setStars(starRaiting, color) {
    for (var i = 0; i <= parseInt(starRaiting - 1); i++) {
        $('.movieStars:eq(' + i + ')').css('color', color);
        $('.movieStars:eq(' + i + ')').removeClass('far');
        $('.movieStars:eq(' + i + ')').addClass('fas');
    }

    for (var i = parseInt(starRaiting); i < 5; i++) {
        $('.movieStars:eq(' + i + ')').css('color', 'white');
        $('.movieStars:eq(' + i + ')').removeClass('fas');
        $('.movieStars:eq(' + i + ')').addClass('far');
    }
}

function resetStarColors() {
    $('.movieStars').css('color', 'white');
    for (var i = 0; i <= 4; i++) {
        $('.movieStars:eq(' + i + ')').removeClass('fas');
        $('.movieStars:eq(' + i + ')').addClass('far');
    }
}