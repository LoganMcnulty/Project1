$(document).ready(function () {

  // Create variables that fetch and store "netflixExpireSoon" and "netflixNewLocal" objects from local storage
  // These objects contain data returned from UnOGS, the API provider of the soon to expire and recently added Netflix Data.
  // **Note: These ITEMS also have the IMDB Data included in the "omdbData" object, coded on line (xyz)**
    var netflixExpiresLocal = JSON.parse(localStorage.getItem("netflixExpireSoon"));
    var netflixNewLocal = JSON.parse(localStorage.getItem("netflixNew"));
    console.log(netflixExpiresLocal);
    // console.log(netflixNewLocal);

  // on click function for "What's New?" and "What's Leaving?" buttons. On click they run loadNewContent() or loadExpiringContent()
    $('#newContent').on('click', loadNewContent);
    $('#expiringContent').on('click', loadExpiringContent);

  function loadExpiringContent() {
    //resets the existing table body if user clicks on "what's new" or "what's leaving" more than once
      $('#empTable').DataTable().destroy();
      $("#empTable tbody").empty();

    // if the netFlixExpiresLocal object is "null" (this implies that the user does not yet have the objects locally stored), OR
    // today's date is greater than the timeStamp of the locally stored object, THEN
    // call the APIs and update the locally stored object
      if (netflixExpiresLocal == null || moment().format("MM/DD/YY") > netflixExpiresLocal.timeStamp) {
        // Querying uNogS API for expiring content
          var settingsExpiring = {
            "async": true,
            "crossDomain": true,
            "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Aexp%3AUS&t=ns&st=adv&p=1",
            "method": "GET",
            "headers": {
              "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
              "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
            }
          }

    // this is the Ajax call that was included in the uNoGS example. The response file is stored in "netflixResponse"
      $.ajax(settingsExpiring).done(function (netflixResponse) {
        console.log(netflixResponse);

    // store response file in netflixExpireSoon and convert their timestamp to "MM/DD/YY"
        var netflixExpiresSoon = netflixResponse;
        netflixExpiresSoon.timeStamp = moment().format("MM/DD/YY");

    // execute the following for as many times as the netflixResponse.ITEMS array is long
        for (let i = 0; i < netflixResponse.ITEMS.length; i++) {
          // if the imdbid (Title of the movie/show) is NOT empty, THEN
          // create a URL to be passed to the omdbAPI using the imdbID
            if (netflixResponse.ITEMS[i].imdbid != "") {
              var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

          // Creating an AJAX call, passing the queryURL, to the omdbAPI to get the title's IMDB data
            $.ajax({
              url: queryURL,
              method: "GET"
          // store the omdbAPI response in "omdbResponse"
            }).then(function (omdbResponse) {

          // log the response, and add the response to the netflixExpiresSoon.ITEM
              console.log(omdbResponse);
              netflixExpiresSoon.ITEMS[i].omdbData = omdbResponse;
          // push to the local storage object/array "netflixExpireSoon" the netflixExpiresSoon response using JSON.stringify
              localStorage.setItem('netflixExpireSoon', JSON.stringify(netflixExpiresSoon));
          // run addContentRow function, passing the omdbResponse, and the index of the item from te for loop
          // **Note: we pass the index for future use by the "saved content" feature
              addContentRow(omdbResponse, i);
            });
          }
        }
      });
    } 
    // ELSE if the initial IF statement (the objects are NOT already up to date) then push/update the items in local storage, and run addContent()
      else {
        for (let i = 0; i < netflixExpiresLocal.ITEMS.length; i++) {
          if (netflixExpiresLocal.ITEMS[i].imdbid != "") {
            addContentRow(netflixExpiresLocal.ITEMS[i].omdbData, i);
          }
        }
    // calling the Material Design for Bootstrap (MDB) functions so that the table is sortable
        $("#empTable").DataTable();
        $(".dataTables_length").addClass("bs-select");
      }
    }

  // New Releases Query
  // *** NOTE: this function is mostly the same as loadExpiringContent(), only the differences are commented below ***
  function loadNewContent() {
    // resets table body
      $('#empTable').DataTable().destroy();
      $("#empTable tbody").empty();
      if (netflixNewLocal == null || moment().format("MM/DD/YY") > moment(netflixNewLocal.timeStamp).add(1, 'days')) {
    // define daysSinceRelase to modify how far back in days uNoGS is queried for new content
      var daysSinceRelease = 7;
      var resultsPage = 1;
      var settingsNew = {
        "async": true,
        "crossDomain": true,
        "url": "https://unogs-unogs-v1.p.rapidapi.com/aaapi.cgi?q=get%3Anew" + daysSinceRelease + "%3AUS&p=" + resultsPage + "&t=ns&st=adv",
        "method": "GET",
        "headers": {
          "x-rapidapi-host": "unogs-unogs-v1.p.rapidapi.com",
          "x-rapidapi-key": "e138a5e326mshee193d9b02e3dafp19cc7djsn4aa0ac2244fa"
        }
      }

      $.ajax(settingsNew).done(function (netflixResponse) {
        console.log(netflixResponse);

        var netflixNewLocal = netflixResponse;
        netflixNewLocal.timeStamp = moment().format("MM/DD/YY");

        for (let i = 0; i < netflixResponse.ITEMS.length; i++) {
          if (netflixResponse.ITEMS[i].imdbid != "") {
            var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

            $.ajax({
              url: queryURL,
              method: "GET"
            }).then(function (omdbResponse) {
              console.log(omdbResponse);
              netflixNewLocal.ITEMS[i].omdbData = omdbResponse;
              localStorage.setItem('netflixNew', JSON.stringify(netflixNewLocal));

              addContentRow(omdbResponse, i);
            });
          }
        }
      });
    } else {
      for (let i = 0; i < netflixNewLocal.ITEMS.length; i++) {
        if (netflixNewLocal.ITEMS[i].imdbid != "") {
          addContentRow(netflixNewLocal.ITEMS[i].omdbData, i);
        }
      }
      $("#empTable").DataTable();
      $(".dataTables_length").addClass("bs-select");
    }
  }

  // adds content row to table, passing the omdbObject, and itemIndex of that object (for use with saved content)
    function addContentRow(omdbObject, itemIndex) {
      // create a new table row, and add the item Index to the entire row (for use with saved content)
        var newRow = $('<tr data-toggle="collapse" data-target="#collapse' + itemIndex + '" class="clickable">');
      // append the title of the content to the row 
        newRow.append($('<td style="font-weight:bold;">').text(omdbObject.Title));
        console.log(omdbObject);
      // if the Poster returned by OMDB Api is null, then use the default poster image
        if (omdbObject.Poster === "N/A"){
          var posterTD =$("<td>");
          var missingPosterImageLink = 'Assets/Images/noimage.jpg';
          var missingPosterImg = $("<img>").attr("id","titlePoster").attr("src",missingPosterImageLink);
          posterTD.append(missingPosterImg);
          newRow.append(posterTD);
        }
      // assuming OMDB poster link is not null...
        else{
      // create table data for the poster 
        var posterTD =$("<td>");
      // assign the poster image URL, to posterImage variable 
        var posterImage = omdbObject.Poster;
      // create an image tag variable and add appropriate attributes
        var posterImg = $("<img>").attr("id","titlePoster").attr("src", posterImage);
      // append poster image tag to poster image table tada
        posterTD.append(posterImg);
      // append all to the new row
        newRow.append(posterTD);
        }
      
      // create new table data for each trait of the OMDB response that we have deemed useful for the user to know about. Append to newRow
        newRow.append($("<td>").text(omdbObject.Genre));
        newRow.append($("<td>").text(omdbObject.Rated));
        newRow.append($("<td>").text(omdbObject.Runtime));
        newRow.append($("<td>").text(omdbObject.Year));
        newRow.append($("<td>").text(omdbObject.imdbRating));
        newRow.append($("<td>").text(omdbObject.imdbVotes));
      
      // create the check box for whether the user wants to save the result
        var newWatchedTD = $("<td>");
        newWatchedTD.append($('<input type="checkbox">'));
        newRow.append(newWatchedTD);

      // append the new row to the table body with ID = titleContainer
        $("#titleContainer").append(newRow);
  };

});