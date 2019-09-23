$(document).ready(function () {

  function displayTitleInfo() {

    //Expires Soon Query
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Aexp%3AUS&t=ns&st=adv&p=1",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
        "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
      }
    }

    $.ajax(settings).then(function (response) {
      console.log(response);
    });

    //New Releases Query
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Anew7%3AUS&p=1&t=ns&st=adv",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
        "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
      }
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
    });


  };

  displayTitleInfo();

});