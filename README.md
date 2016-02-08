# raspberry-pagerduty-alarm  

This application checks PagerDuty incidents and sounds alarm.

# How it Works
Raspberry PI pings PagerDuty every 30 seconds (configurable).  LED or alarm gets triggered based on last incident status.
 * Resolved -- green LED
 * Acknowledged -- yellow LED and 3 seconds alarm
 * Triggered -- red LED and 10 seconds alarm

# Configuration
Default configuration is is "config/default.json".  Set set application specific configuration, create "config/production.json".  Here is an example:
<pre><code>
    {
        "url":"https://your-app.pagerduty.com/api/v1/incidents",
        "access":"E7px6VVr3PVHZPJq51oa"
    }
</code></pre>
To obtain your own access code, visit https://developer.pagerduty.com/documentation/rest/authentication.

Pin configuration (configurable), see pictures.
 * Green -- 4
 * Red -- 17
 * Yellow -- 22
 * Alarm -- 18

# Run
After pull the last code, you need to create application specific configuration, see above.  Then, you need to set node_evn to "production".  
<pre><code>
    export NODE_ENV=production
    sudo -E node index.js
</code></pre>

# Raspberry PI Setup
<a data-flickr-embed="true"  href="https://www.flickr.com/photos/codesith/24769277212/in/datetaken/" title="Untitled"><img src="https://farm2.staticflickr.com/1649/24769277212_4e2715d1bb_b.jpg" width="1024" height="768" alt="Untitled"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
***
<a data-flickr-embed="true"  href="https://www.flickr.com/photos/codesith/24769277032/in/datetaken/" title="Untitled"><img src="https://farm2.staticflickr.com/1710/24769277032_0dd8ac0224_b.jpg" width="1024" height="768" alt="Untitled"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
***
<a data-flickr-embed="true"  href="https://www.flickr.com/photos/codesith/24793789381/in/datetaken/" title="Untitled"><img src="https://farm2.staticflickr.com/1541/24793789381_64bac0e987_b.jpg" width="1024" height="768" alt="Untitled"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
***
