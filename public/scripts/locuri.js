
$(document).ready(function() {
	var array = []
	var $cart = $('#selectedSeats'), //Sitting Area
	$counter = $('#counter'), //Votes
	$total = $('#total'); //Total money
	
	var sc = $('#seatMap').seatCharts({
		map: [  //Seating chart
			'aaaaaaaaaa',
            'aaaaaaaaaa',
            '__________',
            'aaaa_aaaaa',
            'aaaa_aaaaa',
			'aaaa_aaaaa',
			'aaaa_aaaaa',
			'aaaa_aaaaa',
			'aaaa_aaaaa',
            'aaaa_aaaaa'
		],
		naming : {
			top : false,
			getLabel : function (character, row, column) {
				return column;
			}
		},
		legend : { //Definition legend
			node : $('#legend'),
			items : [
				[ 'a', 'available',   'Liber' ],
				[ 'a', 'unavailable', 'Ocupat']
			]					
		},
		click: function () { //Click event
			if (this.status() == 'available') { //optional seat
				$('<li>R'+(this.settings.row+1)+' S'+this.settings.label+'</li>')
					.attr('id', 'cart-item-'+this.settings.id)
					.data('seatId', this.settings.id)
					.appendTo($cart);
	
				$counter.text(sc.find('selected').length+1);
				array.push((this.settings.row+1)+' '+this.settings.label)
							
				return 'selected';
			} else if (this.status() == 'selected') { //Checked
					//Update Number
					$counter.text(sc.find('selected').length-1);
					//update totalnum
					array.splice(array.indexOf((this.settings.row+1)+' '+this.settings.label),1);
					
					//Delete reservation
					$('#cart-item-'+this.settings.id).remove();
					//optional
					return 'available';
			} else if (this.status() == 'unavailable') { //sold
				return 'unavailable';
			} else {
				return this.style();
			}
		}
	});
	//sold seat
	//sc.get(['1_2', '4_4','4_5','6_6','6_7','8_5','8_6','8_7','8_8', '10_1', '10_2']).status('unavailable');
	soldSeats = []
	var seats = document.getElementById("hidden").children;
	for(seat of seats){
		soldSeats.push(seat.innerHTML);
	}
	sc.get(soldSeats).status('unavailable');
	var total = document.getElementById("total");
	total.innerHTML = localStorage.getItem("total");
	var butt = document.getElementById("but");
	butt.addEventListener('click',function(){
	counter = document.getElementById("counter");
	if(counter.innerHTML == localStorage.getItem("nrTickets")){
		localStorage.setItem("selectedSeats",array);
		idEcranizare = localStorage.getItem("idEcranizare");
		window.document.location='confirm'+'?id='+idEcranizare;
	}
	else{
		alert("Numarul biletelor nu corespunde cu ce ati ales!");
	}
	});
	
});
