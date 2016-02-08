var config = require("config");
var rest = require("restler");
var dateformat = require("dateformat");

var baseUrl = config.get("url");
var access = config.get("access");
var timeout = config.get("timeoutMilliSeconds");
var limit = config.get("limit");
var headers = {
  "Authorization":"Token token="+config.get("access")
}

Gpio = require("onoff").Gpio;
var alarm = new Gpio(config.get("alarm"), "out");
var green = new Gpio(config.get("green"), "out");
var yellow = new Gpio(config.get("yellow"), "out");
var red = new Gpio(config.get("red"), "out");
alarm.writeSync(0);
green.writeSync(0);
yellow.writeSync(0);
red.writeSync(0);

checkIncident();

function checkIncident() {
  // wait for one minute and check again
  setTimeout(checkIncident, timeout);

  var now = new Date()
  var until = dateformat(now, "isoDateTime");
  now.setDate(now.getDate()-1);
  var since = dateformat(now, "isoDateTime");

  var url = baseUrl + "?since=" + since + "&until=" + until + "&limit=" + limit;
  console.log(url);
  rest.get(url, {headers: headers}).on("success", function(result) {
    if (result.total > limit) {
      console.log("Skip to the last page.");
      // try again
      var offset = result.total - 1;
      url += "&offset=" + offset;
      console.log(url);
      rest.get(url, {headers:headers}).on("success", function(result) {
        processIncident(result.incidents[result.incidents.length-1]);
      });
    } else {
        processIncident(result.incidents[result.incidents.length-1]);
    }
  });
}

function processIncident(incident) {
  var now = new Date()
  var timestamp = dateformat(now, "isoDateTime");
  console.log("@" + timestamp + " status: " + incident.status);
  if (incident.status == "resolved") {
    green.writeSync(1);
    yellow.writeSync(0);
    red.writeSync(0);
    alarm.writeSync(0);
  } else if (incident.status == "acknowledged")  {
    green.writeSync(0);
    yellow.writeSync(1);
    red.writeSync(0);
    alarm.writeSync(1);
    setTimeout(turnOffAlarm, 3000);
  } else {
    green.writeSync(0);
    yellow.writeSync(0);
    red.writeSync(1);
    alarm.writeSync(1);
    setTimeout(turnOffAlarm, 10000);
  }
}

function turnOffAlarm() {
  alarm.writeSync(0);
}
