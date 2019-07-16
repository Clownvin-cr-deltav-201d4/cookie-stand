'use strict';

//I miss my factory function :(
//Class notation sexy af tho.
class Shop {

  constructor(shopName, minCusts, maxCusts, avgPerCust) {
    this.shopName = shopName;
    this.minCusts = minCusts;
    this.maxCusts = maxCusts;
    this.avgPerCust = avgPerCust;
    this.hourlyData = [];
  }

  estimateCustsForHour(hour) {
    hour %= 24;
    if (hour < 5 || hour > 19) {
      return 0;
    }
    if (hour < 12) {
      return Math.round(this.minCusts + ((this.maxCusts - this.minCusts) * (Math.random() * ((hour - 5) / 6))));
    }
    return Math.round(this.minCusts + ((this.maxCusts - this.minCusts) * (Math.random() * ((19 - hour) / 8))));
  }

  estimateCookies(customers) {
    return Math.round(customers * this.avgPerCust);
  }

  addHourlyData(hour, customers, cookies) {
    this.hourlyData[hour] = {customers: customers, cookies: cookies};
  }

  getHourlyData(hour) {
    return this.hourlyData[hour % 24];
  }

  getTotalCookiesSold() {
    var cookies = 0;
    this.hourlyData.forEach((hour) => cookies += hour.cookies);
    return cookies;
  }

  createList() {
    var innerList = '';

    for (var i = 5; i < 20; i++) {
      innerList += `  <li>${(i % 12)+1}${i < 11 ? 'am' : 'pm'}: ${this.hourlyData[i].cookies} cookies</li>\n`;
    }
    innerList += `  <li>Total: ${this.getTotalCookiesSold()} cookies\n`;

    return `
    <p id="${this.shopName}-list">${this.shopName}</p>
    <ul>
    ${innerList}
    </ul>
    `;
  }
}

/*
Location	Min / Cust	Max / Cust	Avg Cookie / Sale
1st and Pike	23	65	6.3
SeaTac Airport	3	24	1.2
Seattle Center	11	38	3.7
Capitol Hill	20	38	2.3
Alki	2	16	4.6
*/

var firstAndPike = new Shop('1st and Pike', 23, 65, 6.3);
var seaTacAirport = new Shop('SeaTac Airport', 3, 24, 1.2);
var seattleCenter = new Shop('Seattle Center', 11, 38, 3,7);
var capitolHill = new Shop('Capitol Hill', 20, 38, 2.3);
var alki = new Shop('Alki', 2, 16, 4.6);

var shops = [firstAndPike, seaTacAirport, seattleCenter, capitolHill, alki];

/*Generate 24 hrs worth of data*/
for (var i = 0; i < 24; i++) {
  shops.forEach((shop) => {
    var custsThisHour = shop.estimateCustsForHour(i);
    shop.addHourlyData(i, custsThisHour, shop.estimateCookies(custsThisHour));
  });
}
