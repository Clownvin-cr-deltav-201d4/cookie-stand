(() => {
  'use strict';

  class Store {

    constructor(storeName, minCusts, maxCusts, avgPerCust) {
      this.storeName = storeName;
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

      var variability;
      if (hour < 12) {
        variability = ((hour - 5) / 6);
      } else {
        variability = ((19 - hour) / 8);
      }

      return Math.round(this.minCusts + ((this.maxCusts - this.minCusts) *
      (Math.random() * variability)));
    }

    estimateCookiesForCustomers(customers) {
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
      row.id = this.storeName;

      var location = document.createElement('td');
      location.classList.add('location');
      location.textContent = this.storeName;
      row.appendChild(location);

      for (var i = 5; i < 20; i++) {
        var hour = document.createElement('td');
        hour.classList.add(`hour-${(i % 12)+1}`);
        hour.textContent = this.hourlyData[i].cookies;
        row.appendChild(hour);
      }

      var total = document.createElement('td');
      total.classList.add('total');
      total.textContent = this.getTotalCookiesSold();

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

  var stores = [
    new Store('1st and Pike', 23, 65, 6.3),
    new Store('SeaTac Airport', 3, 24, 1.2),
    new Store('Seattle Center', 11, 38, 3,7),
    new Store('Capitol Hill', 20, 38, 2.3),
    new Store('Alki', 2, 16, 4.6),
  ];

  function createDummyData(store) {
    for (var i = 0; i < 24; i++) {
      var custsThisHour = store.estimateCustsForHour(i);
      store.addHourlyData(i, custsThisHour, store.estimateCookiesForCustomers(custsThisHour));
    }
  }

  /*Generate 24 hrs worth of data*/
  /*I know it's unecessary, but it's
  more flexible to changes in business hours*/
  stores.forEach((store) => createDummyData(store));

  function createTableHeader() {
    var headerRow = document.createElement('tr');

    ['Locations', '6:00am', '7:00am', '8:00am', '9:00am',
    '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm', '3:00pm', '4:00pm',
    '5:00pm', '6:00pm', '7:00pm', '8:00pm', 'Totals'].forEach((heading) => {
      var th = document.createElement('th');
      th.classList.add('heading');
      th.textContent = heading;
      headerRow.appendChild(th);
    });

    var header = document.createElement('thead');
    header.appendChild(headerRow);
    return header;
  }

  function createTableFooter() {
    var footer = document.createElement('tfoot');
    var footerRow = document.createElement('tr');
    footerRow.id = 'footer';

    var label = document.createElement('td');
    label.id = 'footer-label';
    label.textContent = 'Totals';

    footerRow.appendChild(label);

    var totals = [];
    for (var i = 0; i < 15; i++) {
      totals[i] = 0;
      stores.forEach((store) => {
        totals[i] += store.getHourlyData(i + 5).cookies;
      });
    }

    var totalTotals = 0;
    stores.forEach((store) => {
      totalTotals += store.getTotalCookiesSold();
    });

    totals[totals.length] = totalTotals;
    totals.forEach((total) => {
      var t = document.createElement('th');
      t.textContent = total;
      footerRow.appendChild(t);
    });

    footer.appendChild(footerRow);
    return footer;
  }

  var table = document.getElementById('sales-report');
  table.appendChild(createTableHeader());
  var body = document.createElement('tbody');
  stores.forEach((store) => store.render(body));
  table.appendChild(body);
  var footer = createTableFooter();
  table.appendChild(footer);

  var form = document.getElementById('create-store');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    var err = document.getElementById('store-error');
    var name = document.getElementById('store-name').value;
    if (name.length < 2) {
      err.textContent = 'Name length must be at least two characters';
      return;
    }
    var min = document.getElementById('store-min').value;
    if (isNaN(min = Number(min)) || min < 0) {
      err.textContent = 'Minimum customers must be a number that is at least zero';
      return;
    }
    var max = document.getElementById('store-max').value;
    if (isNaN(max = Number(max)) || max < min) {
      err.textContent = `Maximum customers must be a number that is at least your minimum, ${min}`;
      return;
    }
    var avg = document.getElementById('store-avg').value;
    if (isNaN(avg = Number(avg)) || avg <= 0) {
      //Sadface is this is true for the client :(
      err.textContent = 'Averages cookies per customer must be a number greater than zero';
      return;
    }
    err.textContent = '';
    var store = new Store(name, min, max, avg);
    stores.push(store);
    createDummyData(store);
    store.render(body);

    table.removeChild(footer);
    footer = createTableFooter();
    table.appendChild(footer);
  });

})();
