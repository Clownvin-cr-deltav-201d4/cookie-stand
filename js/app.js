(() => {
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

    render(table) {
      var row = document.createElement('tr');
      row.id = this.shopName;

      var location = document.createElement('td');
      location.classList.add('location');
      location.innerHTML = this.shopName;

      row.appendChild(location);
      for (var i = 5; i < 20; i++) {
        var hour = document.createElement('td');
        hour.classList.add(`hour-${(i % 12)+1}`);
        hour.innerHTML = this.hourlyData[i].cookies;
        row.appendChild(hour);
      }

      var total = document.createElement('td');
      total.classList.add('total');
      total.innerHTML = this.getTotalCookiesSold();

      row.appendChild(total);
      table.appendChild(row);
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

  function createTableHeader() {
    var header = document.createElement('thead');
    var headerRow = document.createElement('tr');

    var headings = ['Locations', '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm', 'Totals'];
    headings.forEach((heading) => {
      var h = document.createElement('th');
      h.classList.add('heading');
      h.innerHTML = heading;
      headerRow.appendChild(h);
    });
    header.appendChild(headerRow);
    return header;
  }

  function createTableFooter() {
    var footer = document.createElement('tfoot');
    var footerRow = document.createElement('tr');
    footerRow.id = 'footer';

    var label = document.createElement('td');
    label.id = 'footer-label';
    label.innerHTML = 'Totals';

    footerRow.appendChild(label);
    var totals = [];
    for (var i = 5; i < 20; i++) {
      totals[i - 5] = 0;
      shops.forEach((shop) => {
        totals[i - 5] += shop.getHourlyData(i).cookies;
      });
    }
    var totalTotals = 0;
    shops.forEach((shop) => {
      totalTotals += shop.getTotalCookiesSold();
    });
    totals[totals.length] = totalTotals;
    totals.forEach((total) => {
      var t = document.createElement('th');
      t.innerHTML = total;
      footerRow.appendChild(t);
    });
    footer.appendChild(footerRow);
    return footer;
  }

  var table = document.getElementById('sales-report');

  table.appendChild(createTableHeader());

  var body = document.createElement('tbody');

  shops.forEach((shop) => shop.render(table));

  table.appendChild(body);

  table.appendChild(createTableFooter());

})();
