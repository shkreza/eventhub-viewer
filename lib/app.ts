import * as express from "express"
import { Request, Response } from "express"
import * as bodyParser from "body-parser"
import { Writable, Transform } from "stream"

import retrievePartitions from "./partition"
import retrieveEvents from "./events";

import { getSomeJsonData, getRandomMarker, JSONIncrementalDeserializer, JSONIncrementalSerializer } from "./eventhubutils"

class App {

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    };

    public app: express.Application;

    private config(): void {
        this.app.use('/static', express.static('static'));
        this.app.use('/dist', express.static('dist'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.set('views', './views');
        this.app.set('view engine', 'pug');
    };

    private obfoscate(str): string {
        if(!str) { return "null" }
        return new Array(str.length).fill('X').join('');
    }

    private routes(): void {
        const router = express.Router();

        router.get('/', (req: Request, res: Response) => {
            res.redirect('../views');
        });

        router.get('/views', (req: Request, res: Response) => {
            var data = {'title': 'Event Hubs Event Viewer'};
            res.render('index', data);
        });

        router.post('/events', (req: Request, res: Response) => {
            var randomMarker = req.body.randomMarker;
            var hubConnectionString = req.body.hubConnectionString;
            var entityName = req.body.entityName;
            var startTimestamp = req.body.startTimestamp;
            var partitionName = req.body.partitionName;

            console.log("DATA: randomMarker=", randomMarker)
            console.log("DATA: hubConnectionString=", this.obfoscate(hubConnectionString))
            console.log("DATA: entityName=", this.obfoscate(entityName))
            console.log("DATA: startTimestamp=", this.obfoscate(startTimestamp))
            console.log("DATA: partitionName=", this.obfoscate(partitionName))

            var connectionState = true;
            req.on('close', function() { connectionState = false; });

            retrieveEvents(hubConnectionString, entityName, startTimestamp, partitionName, new Transform({
                writableObjectMode: true,

                transform(events, encoding, callback) {
                    (events as any).forEach(event => {
                        console.log("Writing: ", event.body);
                    });

                    (events as any).forEach(event => {
                        res.write(JSON.stringify(event));
                        res.write(randomMarker);
                    })

                    if(connectionState) {
                        callback();
                    }
                }
            }));
        });

        router.post('/partitions', async function (req: Request, res: Response) {
            var hubConnectionString = req.body.hubConnectionString;
            var entityName = req.body.entityName;
            var partitionIds = await retrievePartitions(hubConnectionString, entityName);
            console.log('Received this result: ', partitionIds);
            res.status(200).send({'partitions': partitionIds});
        });

        this.app.use('/', router)
    };
}

export default new App().app;
