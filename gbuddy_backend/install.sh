

StatusCode        : 200
StatusDescription : OK
Content           : #!/bin/bash
                    
                    URL=https://dl.google.com/dl/cloudsdk/channels
                    /rapid/install_google_cloud_sdk.bash
                    
                    function download {
                      scratch="$(mktemp -d -t tmp.XXXXXXXXXX)" || 
                    exit
                      script_file="$scratch/install_...
RawContent        : HTTP/1.1 200 OK
                    Content-Security-Policy-Report-Only: 
                    script-src  'nonce--WIWXeA78Q53jWe3KA_6VA' 
                    'report-sample' 'strict-dynamic' 
                    'unsafe-eval' 'unsafe-hashes' 'unsafe-inline' 
                    http: https:; object-src...
Forms             : {}
Headers           : {[Content-Security-Policy-Report-Only, 
                    script-src  'nonce--WIWXeA78Q53jWe3KA_6VA' 
                    'report-sample' 'strict-dynamic' 
                    'unsafe-eval' 'unsafe-hashes' 'unsafe-inline' 
                    http: https:; object-src 'none'; report-uri ht
                    tps://csp.withgoogle.com/csp/cloud-sdk-build; 
                    base-uri 'self',require-trusted-types-for 
                    'script'; report-uri https://csp.withgoogle.co
                    m/csp/cloud-sdk-build], 
                    [Cross-Origin-Resource-Policy, cross-origin], 
                    [Cross-Origin-Opener-Policy, same-origin; 
                    report-to="cloud-sdk-build"], [Report-To, {"gr
                    oup":"cloud-sdk-build","max_age":2592000,"endp
                    oints":[{"url":"https://csp.withgoogle.com/csp
                    /report-to/cloud-sdk-build"}]}]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : mshtml.HTMLDocumentClass
RawContentLength  : 443



