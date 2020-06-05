window.onload = function () {
    var card = document.getElementById("card");
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = card.getBoundingClientRect(),
        offsetTop  = elemRect.top - bodyRect.top,
        offsetLeft = elemRect.left - bodyRect.left,
        offsetRight = bodyRect.right - elemRect.right
        offsetBottom = bodyRect.bottom - elemRect.bottom;

    chosenDate = document.getElementById("chosenDate");
    chosenDate.style.left = parseInt(offsetLeft) + 50 + "px";
    chosenDate.style.top = parseInt(offsetTop) + 320 + "px";

    chosenName = document.getElementById("chosenName");
    chosenName.style.left = parseInt(offsetLeft) + 50 + "px";
    chosenName.style.top = parseInt(offsetTop) + 70 + "px";


}