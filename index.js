var config = require("config");
var rest = require("restler");
var dateformat = require("dateformat");

var debug=config.get("debug");
var baseUrl = config.get("url");
var access = config.get("access");
var timeout = config.get("timeoutMilliSeconds");
var normal = config.get("normalStatus");
var limit = config.get("limit");
var headers = {
  "Authorization":"Token token="+config.get("access")
}

var alarm = null;
Gpio = require("onoff").Gpio,
alarmSpeaker = new Gpio(config.get("alarmSpeaker"), "out");
heartbeatLed = new Gpio(config.get("heartbeatLed"), "out");
alarmLed = new Gpio(config.get("alarmLed"), "out");


checkIncident();

function checkIncident() {
  // wait for one minute and check again
  setTimeout(checkIncident, timeout);

  var now = new Date()
  var until = dateformat(now, "isoDateTime");
  now.setDate(now.getDate()-1);
  var since = dateformat(now, "isoDateTime");

  var url = baseUrl + "?since=" + since + "&until=" + until + "&limit=" + limit;
  if(debug) console.log(url);
  rest.get(url, {headers: headers}).on("success", function(result) {
    if (result.total > limit) {
      if(debug) console.log("Skip to the last page.");
      // try again
      var offset = result.total - 1;
      url += "&offset=" + offset;
      if(debug) console.log(url);
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
  if (incident.status == normal) {
    console.log("@" + timestamp + " status: normal");
    heartbeatLed.writeSync(1);
    alarmLed.writeSync(1);
  } else {
    console.log("@" + timestamp + " status: " + incident.status);
    heartbeatLed.writeSync(0);
    alarmLed.writeSync(1);
    alarmSpeaker.writeSync(1);
    setTimeout(10, turnOffAlarm);
  }
}

function turnOffAlarm() {
  alarmSpeaker.writeSync(0);
}
