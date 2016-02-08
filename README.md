# raspberry-pagerduty-alarm  

This application checks PagerDuty incidents and sounds alarm.

# Configuration
Default configuration is is "config/default.json".  Set set application specific configuration, create "config/production.json".  Here is an example:
<pre><code>
    {
        "url":"https://your-app.pagerduty.com/api/v1/incidents",
        "access":"E7px6VVr3PVHZPJq51oa"
    }
</code></pre>
To obtain your own access code, visit https://developer.pagerduty.com/documentation/rest/authentication.

# Run
After pull the last code, you need to create application specific configuration, see above.  Then, you need to set node_evn to "production".  
<pre><code>
    export NODE_ENV=production
    sudo -E node index.js
</code></pre>

# Raspberry PI Setup
<a data-flickr-embed="true"  href="https://www.flickr.com/photos/codesith/24257917903/in/dateposted-public/" title="Untitled"><img src="https://farm2.staticflickr.com/1619/24257917903_9fe02c228b_k.jpg"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script>
***
<p><a data-flickr-embed="true"  href="https://www.flickr.com/photos/codesith/24791391531/in/dateposted-public/" title="Untitled"><img src="https://farm2.staticflickr.com/1701/24791391531_3a2a17b5b9_k.jpg"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script></p>
***
<p><a data-flickr-embed="true"  href="https://www.flickr.com/photos/codesith/24884788075/in/dateposted-public/" title="Untitled"><img src="https://farm2.staticflickr.com/1566/24884788075_c1aa505d17_k.jpg"></a><script async src="//embedr.flickr.com/assets/client-code.js" charset="utf-8"></script></p>
