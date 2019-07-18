(() => {
  function showContent(content, title = 'Lab 6') {
    var contentRoot = document.getElementById('content');
    contentRoot.innerHTML = ''; //"Remove" all content from root (doesn't destroy it though).
    contentRoot.appendChild(content);
    document.querySelector('title').textContent = title;
  }

  // Create home content
  var homeContent = (() => {

    function createTextArticle(title, content) {
      var article = document.createElement('article');
      var header = document.createElement('header');
      var h3 = document.createElement('h3');
      h3.textContent = title;
      header.appendChild(h3);
      article.appendChild(header);
      var p = document.createElement('p');
      p.innerHTML = content;
      article.appendChild(p);
      return article;
    }

    var clearfix = document.createElement('div');
    clearfix.classList.add('clearfix');
    //Notifications
    var section = document.createElement('section');
    section.id = 'notifications';
    //Article 1
    section.appendChild(createTextArticle('New Location Opening', `We're pleased to announce the grand opening of a new Pat's Salmon Cookies branch, Alki!<br><br>
      Alki is located in the small town of Tokyo, with only a population of 3, but that's not stopping them
      from dreaming big!`));
    //Article 2
    section.appendChild(createTextArticle('New Salmon Supplier', `Thanks to a lucky accident in the gulf of mexico, we have had to change our salmon supplier. Our new Supplier
      is a Japanese company called "Gotta Catch em All", and they pride themselves on catching every last Salmon in existence.
      Needless to say, we've got plently of Salmon to turn into cookies, and it's higher quality now. Or whatever.`));
    //Append notifications
    clearfix.appendChild(section);

    //Menu
    section = document.createElement('section');
    section.id = 'menu';

    //Am lazy, could have broken up into factory functions, like for notifications..
    section.appendChild(createTextArticle('Menu', `<ul>
      <li class="menu-item">
        <header>
          <h3>Salmon Cookie</h3>
        </header>
        <p>Our specialty! Made with love, fresh every day.</p>
      </li>
      <li class="menu-item">
        <header>
          <h3>Tuna Cookie</h3>
        </header>
        <p>Made from only the finest quality Tuna from the Berring Straight.</p>
      </li>
      <li class="menu-item">
        <header>
          <h3>Caviar Cookie</h3>
        </header>
        <p>North-atlantic sturgeon caviar provides a savory flavor you just can't beat!</p>
      </li>
      <br>
      <li class="menu-item">
        <header>
          <h3>Trout Cookie</h3>
        </header>
        <p>Wild-caught Alaskan Trout with a hint of Ginger?</p>
      </li>
      <li class="menu-item">
        <header>
          <h3>Bass Cookie</h3>
        </header>
        <p>Bass Pro Fishermen rejoice! This succulent sweet will have you back to 100% in no time!</p>
      </li>
      <li class="menu-item">
        <header>
          <h3>Carp Cookie</h3>
        </header>
        <p>You know what a carp is? Then you know that these cookies are actually pretty gross...</p>
      </li>
    </br>
    <li class="menu-item">
      <header>
        <h3>Betafish Cookie</h3>
      </header>
      <p>It's like M&M cookies, except with colorful fish instead of chocolate candies.</p>
    </li>
    <li class="menu-item">
      <header>
        <h3>Mackeral Cookie</h3>
      </header>
      <p>Deep from the depths of the ocean, we bring you this delectable delight.</p>
    </li>
    <li class="menu-item">
      <header>
        <h3>Squid Cookie</h3>
      </header>
      <p>Very popular in Japan, this cookie might still be wriggling after purchase!</p>
    </li>
    </ul>`));

    clearfix.appendChild(section);

    return clearfix;
  })();

  // Create sales content container
  var salesContent = (() => {
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

    function createForm(id, populate) {
      var form = document.createElement('form');
      form.id = id;
      populate(form);
      return form;
    }

    class Field {
      constructor(labelText, id, type, placeholder, value = null) {
        this.labelText = labelText;
        this.id = id;
        this.type = type;
        this.placeholder = placeholder;
        this.value = value;
      }
    }

    function createFieldset(legendTitle, fields) {
      var fieldset = document.createElement('fieldset');
      var legend = document.createElement('legend');
      legend.textContent = legendTitle;
      fieldset.appendChild(legend);
      for (var i = 0; i < fields.length; i++) {
        createInput(fieldset, fields[i]);
        if (i < fields.length - 1) {
          fieldset.appendChild(document.createElement('br'));
        }
      }
      return fieldset;
    }

    function createInput(fieldset, field) {
      var element = document.createElement('label');
      element.htmlFor = field.id;
      element.textContent = field.labelText;
      fieldset.appendChild(element);
      fieldset.appendChild(document.createElement('br'));
      element = document.createElement('input');
      element.id = field.id;
      element.type = field.type;
      element.placeholder = field.placeholder;
      element.value = field.value;
      fieldset.appendChild(element);
    }

    var salesContent = document.createElement('div');
    var salesForm = createForm('create-store', (form) => {
      form.appendChild(createFieldset('Name', [
        new Field('Enter name:', 'store-name', 'text', 'Store name'),
      ]));
      form.appendChild(createFieldset('Data', [
        new Field('Minimum Customers (per hour):', 'store-min', 'number', '5'),
        new Field('Maximum Customers (per hour):', 'store-max', 'number', '25'),
        new Field('Average Cookies (per customer):', 'store-avg', 'number', '1'),
      ]));
      var fieldset;
      form.appendChild(fieldset = createFieldset('Submit', [
        new Field('', 'store-submit', 'submit', '', 'Submit'),
      ]));
      var error = document.createElement('p');
      error.id = 'store-error';
      fieldset.appendChild(error)
    });
    salesForm.addEventListener('submit', (event) => {
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
    //Append form, then br
    salesContent.appendChild(salesForm);
    salesContent.appendChild(document.createElement('br'));

    var table = document.createElement('table');
    table.id = 'sales-report';
    table.appendChild(createTableHeader());
    var body = document.createElement('tbody');
    stores.forEach((store) => store.render(body));
    table.appendChild(body);
    var footer = createTableFooter();
    table.appendChild(footer);
    //Append Table
    salesContent.appendChild(table);

    return salesContent;
  })();

  /*
  <a id='home' href=''>Home</a>
  <a id='about' href=''>About Us</a>
  <a id='merch' href=''>Merchandise</a>
  <a id='sales' href=''>Sales</a>
  */

  document.querySelector('nav #home').addEventListener('click', (event) => {
    event.preventDefault();
    showContent(homeContent, 'Lab 6 - Home');
  });
  document.querySelector('nav #sales').addEventListener('click', (event) => {
    event.preventDefault();
    showContent(salesContent, 'Lab 6 - Sales');
  });

  showContent(homeContent, 'Lab 6 - Home');
})();
