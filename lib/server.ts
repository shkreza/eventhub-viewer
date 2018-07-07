import app from "./app"
import * as https from "https"
import * as http from "http"
import * as fs from "fs"

const httpPort = 4444;
var httpServer = http.createServer(app);
httpServer.listen(httpPort);

const httpsPort = 443;
var httpsServer = https.createServer({
            key: fs.readFileSync('/secrets/tls-secrets/tls.key'),
            cert: fs.readFileSync('/secrets/tls-secrets/tls.crt')
        }, app);
httpsServer.listen(httpsPort);
