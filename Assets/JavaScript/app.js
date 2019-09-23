$(document).ready(function(){

    function displayTitleInfo() {

        var imdbID = 'tt5753856';
        var queryURL = "https://www.omdbapi.com/?i=" + imdbID + "&apikey=trilogy";

        // Creating an AJAX call for the specific imdbID being called
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log(queryURL);
            console.log(response);
        });
      };

      displayTitleInfo();

  });