var config = require("config");
var rest = require("restler");
var dateformat = require("dateformat");
var sleep = require("sleep");

var debug=config.get("debug");
var baseUrl = config.get("url");
var access = config.get("access");
var timeout = config.get("timeoutMilliSeconds");
var unit = config.get("unitMilliSeconds")*1000; // convert from millisecond to microsecond
var morseCode = config.get("morseCode");
var alarmPin = config.get("alarmPin");
var heartbeatPin = config.get("heartbeatPin");
var normal = config.get("normalStatus");
var limit = config.get("limit");
var headers = {
  "Authorization":"Token token="+config.get("access")
}

var alarm = null;
Gpio = require('onoff').Gpio,
alarm = new Gpio(alarmPin, 'out');
alarm.writeSync(0);
heartbeat = new Gpio(heartbeatPin, 'out');
heartbeat.writeSync(0);


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
  var now = new Date()
  var timestamp = dateformat(now, "isoDateTime");
  if (incident.status == normal) {
    console.log("@" + timestamp + " status: normal");
    heartbeat.writeSync(1);
  } else {
    console.log("@" + timestamp + " status: " + incident.status);
    heartbeat.writeSync(0);
    var signals = convertToSignals("SOS");
    for (var i=0; i<signals.length; i++) {
      flash(signals[i]);
    }
  }
}

function convertToSignals(text) {
  var signals = "";
  for(var i=0; i<text.length; i++) {
    // convert all characters to lower case
    var signal = morseCode[text.charAt(i).toLowerCase()];
    // only output singals that are defined by International Morse Code Standard
    // The only exception is "space" character
    if (signal != undefined) {
      signals+=signal;
    }
    if (i != text.length-1) {
      signals+='___';
    }
  }
  return signals;
}

function flash(signal) {
  if (!(signal == '.' || signal == '-' ||  signal == '_')) {
    return;
  }

  delay = unit;
  if (signal == '-') {
    delay = unit * 3;
  }
  if (signal == '_') {
    sleep.usleep(delay);
  } else {
    alarm.writeSync(1);
    sleep.usleep(delay)
    alarm.writeSync(0);
  }
}
