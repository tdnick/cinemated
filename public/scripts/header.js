var pos;
var navHeight = 0;

function showAccount() {
    div = document.getElementById('loginDiv');
    if (!div.style.display) div.style.display = 'none';
    if (div.style.display === 'none'){
        div.style.display = 'inline';
    }
    else {
        div.style.display = 'none';
    }
}

// Doesn't work on "Filme" page: moved navHeight to window.onscroll
// window.onload = function () {
//     pos = document.getElementById("li").offsetTop;
//     navHeight = document.getElementById("hnav").offsetTop + parseInt(getComputedStyle(document.getElementById("hnav")).height);
//     console.log(navHeight)
//     // console.log(pos);
//     // console.log(x);
//     //console.log(document.getElementById("hnav").offsetTop);
// }



window.onscroll = function () {
    navHeight = document.getElementById("hnav").offsetTop + parseInt(getComputedStyle(document.getElementById("hnav")).height);

    if (document.documentElement.scrollTop > navHeight) {

        document.getElementById("hnav").style.visibility = "hidden";
        document.getElementById("hnavSticky").style.display = "block";
    }
    else {
        document.getElementById("hnav").style.visibility = "visible";
        document.getElementById("hnavSticky").style.display = "none";
    }

}