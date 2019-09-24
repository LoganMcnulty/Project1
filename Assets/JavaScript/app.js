$(document).ready(function () {

  function displayTitleInfo() {

    //Expires Soon Query
    // var settings = {
    //   "async": true,
    //   "crossDomain": true,
    //   "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Aexp%3AUS&t=ns&st=adv&p=1",
    //   "method": "GET",
    //   "headers": {
    //     "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
    //     "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
    //   }
    // }

    // $.ajax(settings).then(function (netflixResponse) {
    //   console.log(netflixResponse);

    //   for (let i = 0; i < 3; i++) {
    //     var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

    //     // Creating an AJAX call for the specific movie button being clicked
    //     $.ajax({
    //       url: queryURL,
    //       method: "GET"
    //     }).then(function (omdbResponse) {
    //       console.log(omdbResponse);
    //     });
    //   }
    // });



    //New Releases Query
    var daysSinceRelease = 15;
    var resultsPage = 1;
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Anew" + daysSinceRelease + "%3AUS&p=" + resultsPage + "&t=ns&st=adv",
      "method": "GET",
      "headers": {
        "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
        "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
      }
    }

    $.ajax(settings).done(function (netflixResponse) {
      console.log(netflixResponse);

      for (let i = 0; i < 3; i++) {
        var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

        // Creating an AJAX call for the specific movie button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function (omdbResponse) {
          console.log(omdbResponse);
        });
      }
    });


  };

  displayTitleInfo();

});