window.onload = function () {
    var ratedIndex = -1;
    resetStarColors();

    if (localStorage.getItem('ratedIndex') != null) {
        setStars(parseInt(localStorage.getItem('ratedIndex')));
    }

    $('.movieStars').on('click', function () {
        ratedIndex = parseInt($(this).data('index'));
        localStorage.setItem('ratedIndex', ratedIndex);
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
    });

    $('.movieStars').mouseover(function () {
        resetStarColors();
        var currentIndex = parseInt($(this).data('index'));
        setStars(currentIndex);
    });

    $('.movieStars').mouseleave(function () {
        resetStarColors();

        if (ratedIndex != -1)
           setStars(ratedIndex);
    });

    function setStars(max) {
        for (var i = 0; i <= max; i++) {
            $('.movieStars:eq(' + i + ')').css('color', '#9b7617');
            $('.movieStars:eq(' + i + ')').removeClass('far');
            $('.movieStars:eq(' + i + ')').addClass('fas');
        }
    }

    function resetStarColors() {
        $('.movieStars').css('color', 'white');
        for (var i = 0; i <= 4; i++) {
            $('.movieStars:eq(' + i + ')').removeClass('fas');
            $('.movieStars:eq(' + i + ')').addClass('far');
        }
    }

    var coll = document.getElementsByClassName("collapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
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