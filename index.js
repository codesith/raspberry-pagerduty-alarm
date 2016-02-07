var config = require("config");
var rest = require("restler");
var dateformat = require("dateformat");
var sleep = require("sleep");

var debug=config.get("debug");
var baseUrl = config.get("url");
var access = config.get("access");
var unit = config.get("unitMilliSeconds")*1000; // convert from millisecond to microsecond
var morseCode = config.get("morseCode");
var pin = config.get("pin");
var limit = 100;
var headers = {
  "Authorization":"Token token="+config.get("access")
}

checkIncident();

function checkIncident() {
  // wait for one minute and check again
  setTimeout(checkIncident, 60000);

  var now = new Date()
  var until = dateformat(now, "isoDateTime");
  now.setDate(now.getDate()-1);
  var since = dateformat(now, "isoDateTime");

  var url = baseUrl + "?since=" + since + "&until=" + until + "&limit=" + limit;
  if(debug) console.log(url);
  rest.get(url, {headers: headers}).on('success', function(result) {
    if (result.total > limit) {
      if(debug) console.log("Skip to the last page.");
      // try again
      var offset = result.total - 1;
      url += "&offset=" + offset;
      if(debug) console.log(url);
      rest.get(url, {headers:headers}).on('success', function(result) {
        processIncident(result.incidents[result.incidents.length-1]);
      });
    } else {
        processIncident(result.incidents[result.incidents.length-1]);
    }
  });
}

function processIncident(incident) {
  var current = new Date();
  var timestamp = dateformat(current, "yyyy-mm-dd HH:MM:ss");
  if (incident.status == "resolveds") {
    console.log("@" + timestamp + " status: normal");
  } else {
    console.log("@" + timestamp + " status: " + incident.status);
  }
}
