function getCalendar (dayNumber, days) {
    // create the calendar as a table
    var table = document.createElement("table");
    var tr = document.createElement("tr");

    // row for day letters
    for (let i = 0; i < 7; i++) {
        let td = document.createElement("td");
        td.innerHTML = "DLMMJVS"[i];
        tr.appendChild(td);
    }
    table.appendChild(tr); 

    // create the second row
    tr = document.createElement('tr');
    var i;
    for (i = 0; i < 7; i++) {
        if (i == dayNumber) {
            break;
        }
        let td = document.createElement("td");
        td.innerHTML = "";
        tr.appendChild(td);
    }

    var count = 1;
    for (; i < 7; i++) {
        let td = document.createElement("td");
        td.innerHTML = count;
        count++;
        td.classList.add("day");
        tr.appendChild(td);
    }
    table.appendChild(tr);

    // create the rest of the rows
    for (let r = 3; r <= 7; r++) {
        tr = document.createElement("tr");
        for (let j = 0; j < 7; j++) {
            if (count > days) {
                table.appendChild(tr);
                return table;
            }
            let td = document.createElement("td");
            td.innerHTML = count;
            count++;
            td.classList.add("day");
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    return table;

}

window.onload = function () {
    var date = new Date();
    var month = date.getMonth();
    var monthName = ['January', 'February', 'March', 'April', 'May', 'June', 
                     'July', 'August', 'September', 'October', 'November', 'December'];

    var monthNameRo = ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai',
                        'Iunie', 'Iulie', 'August', 'Septembrie', 'Octombrie',
                        'Noiembrie', 'Decembrie']

    var year = date.getFullYear();
    var firstDate = monthName[month] + " " + 1 + " " + year;
    var tmp = new Date(firstDate).toDateString();

    var firstDay = tmp.substring(0, 3);
    var dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var dayNumber = dayName.indexOf(firstDay);
    var days = new Date(year, month + 1, 0).getDate();

    var calendar = getCalendar(dayNumber, days);
    document.getElementById("monthYear").innerHTML = monthNameRo[month] + " " + year;
    document.getElementById("dates").appendChild(calendar);

    var period = document.getElementById("period");

    var card = document.getElementById("card");
    var bodyRect = document.body.getBoundingClientRect(),
        elemRect = card.getBoundingClientRect(),
        offsetTop  = elemRect.top - bodyRect.top,
        offsetLeft = elemRect.left - bodyRect.left,
        offsetRight = bodyRect.right - elemRect.right
        offsetBottom = bodyRect.bottom - elemRect.bottom;

    var clientName = document.createElement("div");
    clientName.style.width = "300px";
    clientName.style.height = "40px";
    clientName.style.position = "absolute";
    clientName.style.left = parseInt(offsetLeft) + 50 + "px";
    clientName.style.top = parseInt(offsetTop) + 70 + "px";
    clientName.style.backgroundColor = "none";
    //clientName.style.border = "2px solid gold";
    clientName.style.padding = "5px";
    document.body.appendChild(clientName);
    
    var nameInput = document.getElementById("clientName");
    var par = document.createElement("p");
    par.style.color = "white";
    par.style.fontSize = "18px";
    par.style.fontFamily = "Courier New, Courier, monospace";

    spanLastName = document.createElement("span");
    spanFirstName = document.createElement("span");
    par.appendChild(spanLastName)
    par.appendChild(spanFirstName)
    clientName.appendChild(par)
    nameInput.onkeyup = function() {
        spanLastName.innerHTML = nameInput.value;
    }

    var firstNameInput = document.getElementById("clientFirstname");
    firstNameInput.onkeyup = function() {
        spanFirstName.innerHTML = '  ' + firstNameInput.value;
    }

    var cardType1 = document.querySelectorAll('input[name="typeOfCard"]')[0];
    var cardType2 = document.querySelectorAll('input[name="typeOfCard"]')[1];
    var premiumImage = document.createElement("img");
    premiumImage.src = "/images/premium.png";
    premiumImage.alt = "Premium";
    premiumImage.style.width = "55px";
    premiumImage.style.position = "absolute";
    premiumImage.style.right = parseInt(offsetRight) + 50 + "px";
    premiumImage.style.top = parseInt(offsetTop) + 60 + "px";
    premiumImage.style.borderRadius = "50%";
    premiumImage.style.backgroundColor = "gold";
    premiumImage.style.display = "none";

    document.body.appendChild(premiumImage);
    
    cardType2.onclick = function() {
        premiumImage.style.display = "block";
    }

    cardType1.onclick = function() {
        premiumImage.style.display = "none";
    }

    var chosenDate = document.createElement("div");
    chosenDate.style.width = "500px";
    chosenDate.style.height = "30px";
    chosenDate.style.position = "absolute";
    chosenDate.style.left = parseInt(offsetLeft) + 50 + "px";
    chosenDate.style.top = parseInt(offsetTop) + 420 + "px";
    chosenDate.style.color = "white";
    chosenDate.style.fontSize = "16px";
    chosenDate.style.fontFamily = "Courier New, Courier, monospace";
    document.body.appendChild(chosenDate);

    var days = document.getElementsByClassName("day");
    for (let i = 0; i < days.length; i++) {
        days[i].onclick = function() {
            for (let j = 0; j < days.length; j++) {
                days[j].style.backgroundColor = "transparent";
            }
            var max = i + 30 > days.length ? days.length : i + 30;
            for (j = i; j < max; j++) {
                days[j].style.backgroundColor = "gold";
            }
            
            period.innerHTML = days[i].innerHTML + ' ' + document.getElementById("monthYear").innerHTML.split(" ")[0] + ' - ';
            var now = new Date();
            current = new Date(now.getFullYear(), now.getMonth()+1, 1);

            nextMonth = monthNameRo[current.getMonth()];
            if(days.length - i < 30) {
                period.innerHTML += (30 - days.length + i) + ' ' + nextMonth;
            }
            else {
                period.innerHTML += (i + 30) + ' ' + document.getElementById("monthYear").innerHTML.split(" ")[0];
            }

            chosenDate.innerHTML = "Valabil în perioada " +  period.innerHTML;
        }
    }

    console.log(days[days.length - 1])


}






