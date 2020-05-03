var pos;
var x;

window.onload = function () {
    pos = document.getElementById("li").offsetTop;
    x = document.getElementById("hnav").offsetTop + parseInt(getComputedStyle(document.getElementById("hnav")).height);
    console.log(pos);
    console.log(x);
    console.log(document.getElementById("hnav").offsetTop);
}

window.onscroll = function () {
    if (document.documentElement.scrollTop > x) {
        document.getElementById("hnav").classList.add("scrolled");
        for (li of document.getElementById("hnav").children[0].children) {
            //console.log(x);
            li.children[0].classList.add("aScrolled");
        }
    }
    else {
        document.getElementById("hnav").classList.remove("scrolled");
        for (li of document.getElementById("hnav").children[0].children) {
            li.children[0].classList.remove("aScrolled");
        }
    }
}