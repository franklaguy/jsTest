/*  ***********************************  */
/*  Parking Garage: Transactions ******* */
/*  Author: R. Lewis ******************* */
/*  Created: 5/21/17, Modified: 5/21/17  */
/*  Reserved: nSbweb ******************* */
/*  ***********************************  */

let PARKINGGARAGE = {
		init() {
			PARKINGGARAGE.transactions.runAjax();
		},
		sortByKey: {
			ascending(array, key) {
				return array.sort(function(a, b) {
			        var x = a[key], y = b[key];
			        
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });
			},
			descending(array, key) {
				return array.sort(function(a, b) {
			        var x = a[key], y = b[key];
			        
			        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
			    });
			}
		},
		transactions: { 			
			ajax(url) {
				return new Promise ( function pr (resolve, reject){

					let xhr = new XMLHttpRequest();
					
					xhr.contentType = 'application/json; charset=utf-8';
					xhr.open("GET", url, true);
					
					xhr.onload = function() {
						if(xhr.status === 200){
							resolve( JSON.parse(xhr.responseText) );
						} else {
							reject( url );
						}
					}
					xhr.send();
				});
			},
			runAjax(){ 
				this.ajax ('/api/event')
					.then( function fulfilled(contents) {
						console.log('Parking Garage transactions: Promise fulfilled'); // remove during code review
						
						contents = PARKINGGARAGE.sortByKey.descending(contents, 'out');
						
						let table = `<table>`;
							table += `<tr class="header"><td>License</td><td>Price</td><td>Duration</td><td>In</td><td>Out</td></tr>`;

							contents.forEach(function (value) {
								// Get Response Data
								let license = value.license,
									dateIn = new Date((value.in)).toLocaleString('en-US'), // not a good idea to name a db object "in"
									dateOut = new Date((value.out)).toLocaleString('en-US');
								
								// Get Duration 
								let park = new Date(value.in).getTime(),
									leave = new Date(value.out).getTime(),
									duration = Math.floor((leave - park) / 3600 / 1000).toFixed(2),
									overLimit = "", underLimit = "", promotion = "";
								
								switch (true) {
									case (duration == 0):
										duration = 1;
										underLimit = "blue";
										break;
									case (duration == 10):
										duration = duration - 2;
										promotion = "green";
										break;
									case (duration > 1 && duration <= 24):
										duration = duration - 1;
										break;
									case (duration > 24):
										overLimit = "red";
										break;
								}
							
								let price = duration * 2.99;
								
								table += `<tr class="entry ${underLimit} ${overLimit} ${promotion}">`;
								table += `<td>${license}</td>`;
								table += `<td>$${price.toFixed(2)}</td>`;
								table += `<td>${Math.trunc(duration)}</td>`;
								table += `<td>${dateIn}</td>`;
								table += `<td>${dateOut}</td>`;
								table += `</tr>`
							});
							
							table += `</table>`;
							
						// Bind 'table' to html markup
						let element = document.querySelector('#parking-garage');
							element.innerHTML = table;
					},
					function rejected(reason) {
						console.log(reason, 'was rejected from inside the "Promise"');
						
						// Bind 'error' to html markup
						let element = document.querySelector('#parking-garage');
							element.innerHTML = '<p>Error: Data Not Available</p>';
					});
			}
		}
}

PARKINGGARAGE.init();