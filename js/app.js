'use strict';

//This is a factory "method", NOT a true constructor!
//You cannot expect me to write this same thing like 5 times,
//That's like, the opposite of DRY
function makeShop(shopName, minCusts, maxCusts, avgPerCust) {
  return {
    shopName: shopName,
    minCusts: minCusts,
    maxCusts: maxCusts,
    avgPerCust: avgPerCust,

    //TODO This function probably needs work to generate more accurate results. Math.random can be pretty 0-100
    custsPerHour: function (timeOfDay) {
      timeOfDay %= 24;
      if (timeOfDay < 5 || timeOfDay > 19) {
        return 0;
      }
      if (timeOfDay < 12) {
        return Math.floor(minCusts + ((maxCusts - minCusts) * (Math.random() * ((timeOfDay - 5) / 6))));
      }
      return Math.floor(minCusts + ((maxCusts - minCusts) * (Math.random() * ((19 - timeOfDay) / 8))));
    },

    cookiesPerHour: function (custs) {
      return Math.floor(custs * this.avgPerCust);
    },

    hourlyData: [],
    addHourlyData: function (hour, customers, cookies) {
      this.hourlyData[hour] = {customers: customers, cookies: cookies};
    },

    getHourlyData: function (hour) {
      return this.hourlyData[hour % 24];
    },

    getCookiesSold: function () {
      var cookies = 0;
      this.hourlyData.forEach((hour) => cookies += hour.cookies);
      return cookies;
    },

    createList: function () {
      var innerList = '';
      for (var i = 5; i < 20; i++) {
        innerList += `  <li>${(i % 12)+1}${i < 11 ? 'am' : 'pm'}: ${this.hourlyData[i].cookies} cookies</li>\n`;
      }
      innerList += `  <li>Total: ${this.getCookiesSold()} cookies\n`;
      return `
      <p id="${this.shopName}-list">${this.shopName}</p>
      <ul>
        ${innerList}
      </ul>
      `;
    }
  };
}

/*
Location	Min / Cust	Max / Cust	Avg Cookie / Sale
1st and Pike	23	65	6.3
SeaTac Airport	3	24	1.2
Seattle Center	11	38	3.7
Capitol Hill	20	38	2.3
Alki	2	16	4.6
*/

var firstAndPike = makeShop('1st and Pike', 23, 65, 6.3);
var seaTacAirport = makeShop('SeaTac Airport', 3, 24, 1.2);
var seattleCenter = makeShop('Seattle Center', 11, 38, 3,7);
var capitolHill = makeShop('Capitol Hill', 20, 38, 2.3);
var alki = makeShop('Alki', 2, 16, 4.6);

var shops = [firstAndPike, seaTacAirport, seattleCenter, capitolHill, alki];

for (var i = 0; i < 24; i++) {
  shops.forEach((shop) => {
    var custsThisHour = shop.custsPerHour(i);
    shop.addHourlyData(i, custsThisHour, shop.cookiesPerHour(custsThisHour));
  });
}

console.log(firstAndPike);
console.log(firstAndPike.createList());
