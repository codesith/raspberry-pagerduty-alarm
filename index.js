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
var normal = config.get("normalStatus");
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
  if (incident.status == normal) {
    console.log("@" + timestamp + " status: normal");
  } else {
    console.log("@" + timestamp + " status: " + incident.status);
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
  process.stdout.write(signal);
  if (consoleOnly) {
    sleep.usleep(delay);
  }
  else {
    if (signal == '_') {
        sleep.usleep(delay);
    } else {
        led.writeSync(1);
        sleep.usleep(delay)
        led.writeSync(0);
    }
  }
}
