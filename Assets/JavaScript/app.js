$(document).ready(function () {

  var dayCountInitial

  var netflixExpiresLocal = JSON.parse(localStorage.getItem("netflixExpireSoon"));
  var netflixNewLocal = JSON.parse(localStorage.getItem("netflixNew"));
  var savedLocal = JSON.parse(localStorage.getItem("savedList"));
  //checks if user has a savedLocal storage and if not it creates one
  if(savedLocal == null) {
    savedLocal = [];
  }
  console.log(netflixNewLocal);
  console.log(netflixExpiresLocal);

  $('#newContent').on('click', loadNewContent);
  $('#expiringContent').on('click', loadExpiringContent);
  $('#savedContent').on('click', loadSavedContent);

  function loadExpiringContent() {
    //resets table body
    $('#empTable').DataTable().destroy();
    $("#empTable tbody").empty();
    if (netflixExpiresLocal == null || moment().format("MM/DD/YY") > netflixExpiresLocal.timeStamp) {
      //Expires Soon Query
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

      $.ajax(settingsExpiring).then(function (netflixResponse) {
        var netflixExpiresSoon = netflixResponse;
        
        netflixExpiresSoon.timeStamp = moment().format("MM/DD/YY");

        for (let i = 0; i < netflixResponse.ITEMS.length; i++) {
          if (netflixResponse.ITEMS[i].imdbid != "") {
            var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

            // Creating an AJAX call for the specific movie button being clicked
            $.ajax({
              url: queryURL,
              method: "GET"
            }).then(function (omdbResponse) {
              netflixExpiresSoon.ITEMS[i].omdbData = omdbResponse;
              localStorage.setItem('netflixExpireSoon', JSON.stringify(netflixExpiresSoon));

              addContentRow(omdbResponse, i, netflixExpiresSoon.ITEMS[i].netflixid);
            });
          }
        }   
        netflixExpiresLocal = netflixExpiresSoon;
      });
    } else {
      for (let i = 0; i < netflixExpiresLocal.ITEMS.length; i++) {
        if (netflixExpiresLocal.ITEMS[i].imdbid != "") {
          addContentRow(netflixExpiresLocal.ITEMS[i].omdbData, i, netflixExpiresLocal.ITEMS[i].netflixid);
        }
      }

      $("#empTable").DataTable();
      $(".dataTables_length").addClass("bs-select");
    }

    $("#tableHeader").text("Expiring Content");
  } 

  //New Releases Query
  function loadNewContent() {
    //resets table body
    $('#empTable').DataTable().destroy();
    $("#empTable tbody").empty();

      var daysSinceRelease = $("#day-count").val();
      console.log(daysSinceRelease);
      // var daysSinceRelease = 7;
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
        var netflixNew = netflixResponse;
        
        netflixNew.timeStamp = moment().format("MM/DD/YY");
        netflixNew.pullNumber = "10";

        for (let i = 0; i < netflixResponse.ITEMS.length; i++) {
          if (netflixResponse.ITEMS[i].imdbid != "") {
            var queryURL = "https://www.omdbapi.com/?i=" + netflixResponse.ITEMS[i].imdbid + "&apikey=trilogy";

            // Creating an AJAX call for the specific movie button being clicked
            $.ajax({
              url: queryURL,
              method: "GET"
            }).then(function (omdbResponse) {
              netflixNew.ITEMS[i].omdbData = omdbResponse;
              localStorage.setItem('netflixNew', JSON.stringify(netflixNew));

              addContentRow(omdbResponse, i, netflixNew.ITEMS[i].netflixid);
            });
          }
        }
        netflixNewLocal = netflixNew;
      });

    $("#tableHeader").text("New Content");
  }

  $(document).ajaxStop(function() {
    setTimeout(function(){
      $("#empTable").DataTable();
      $(".dataTables_length").addClass("bs-select");
    },200);
  });

  //adds content rows
  function addContentRow(omdbObject, itemIndex, netflixid) {
    if(omdbObject.Response == "True") {
      var newRow = $('<tr data-toggle="collapse" data-target="#collapse' + itemIndex + '" class="clickable">');
      
      var linkTD = $('<td style="font-weight:bold;">');
      var linkNetflix = $('<a href="https://www.netflix.com/watch/'+netflixid+'" target="_blank">'+omdbObject.Title+'</a>');
      linkTD.append(linkNetflix);
      newRow.append(linkTD);

      
      if (omdbObject.Poster === "N/A"){
        var posterTD =$("<td>");
        var missingPosterImageLink = 'Assets/Images/noimage.jpg';
        var missingPosterImg = $("<img>").attr("id","titlePoster").attr("src",missingPosterImageLink);
        posterTD.append(missingPosterImg);
        newRow.append(posterTD);
      }
      else{
        var posterTD =$("<td>");
        var posterImage = omdbObject.Poster;
        var posterImg = $("<img>").attr("id","titlePoster").attr("src",posterImage);
        posterTD.append(posterImg);
        newRow.append(posterTD);
      }

      newRow.append($("<td>").text(omdbObject.Genre));
      newRow.append($("<td>").text(omdbObject.Rated));
      newRow.append($("<td>").text(omdbObject.Runtime));
      newRow.append($("<td>").text(omdbObject.Year));
      newRow.append($("<td>").text(omdbObject.imdbRating));
      newRow.append($("<td>").text(omdbObject.imdbVotes));

      var newWatchedTD = $("<td>");
      var newCheckbox = $('<input type="checkbox" arrayIndex="'+itemIndex+'">');
      if(savedLocal.findIndex(function(savedHold) {return savedHold.imdbid == omdbObject.imdbID;}) != -1) {
        newCheckbox.prop('checked', true);
      }
      newWatchedTD.append(newCheckbox);
      newRow.append(newWatchedTD);
      $("#titleContainer").append(newRow);
    }
  };

  function loadSavedContent() {
    $('#empTable').DataTable().destroy();
    $("#empTable tbody").empty();
    for (let i = 0; i < savedLocal.length; i++) {
      if (savedLocal[i].imdbid != "") {
        addContentRow(savedLocal[i].omdbData, i);
      }
    }
    $("#empTable").DataTable();
    $(".dataTables_length").addClass("bs-select");

    $("#tableHeader").text("Saved Content");
  }

  $(document.body).on("click", "input", function() {
    //captures arrayIndex of object item from checkbox
    var arrayIndex = $(this).attr("arrayIndex");
    var selectedBtnText = $("#tableHeader").text()
    //gets Object to save from the main Object
    if(selectedBtnText == "Expiring Content") {
      var saveObject = netflixExpiresLocal.ITEMS[arrayIndex];
    } else if(selectedBtnText == "New Content") {
      var saveObject = netflixNewLocal.ITEMS[arrayIndex];
    } else if(selectedBtnText == "Saved Content") {
      var saveObject = savedLocal[arrayIndex];
    }
    //if row is being checked then add item to the saved local storage
    if($(this).is(":checked")) {
      //sets object position
      savedLocal[savedLocal.length] = saveObject;
      localStorage.setItem('savedList', JSON.stringify(savedLocal));
    } else {
      var index = savedLocal.findIndex(function(savedHold) {
        return savedHold.imdbid == saveObject.imdbid;
      });

      savedLocal.splice(index,1);
      localStorage.setItem('savedList', JSON.stringify(savedLocal));

      if(selectedBtnText == "Saved Content") {
        $(this).prop("disabled",true);
        $('input[type=checkbox]').each(function(){
          if($(this).attr("arrayIndex") > arrayIndex) {
            $(this).attr("arrayIndex",$(this).attr("arrayIndex")-1);
          }
        });
      }   
    }
  });

});