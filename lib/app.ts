import * as express from "express"
import { Request, Response } from "express"
import * as bodyParser from "body-parser"
import { Writable, Transform } from "stream"

import retrievePartitions from "./partition"

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

    private routes(): void {
        const router = express.Router();

        router.get('/incrementaljson', (req: Request, res: Response) => {
            var rand = req.params.rand;

            var s1 = JSON.stringify({"name": "reza"});
            var s2 = JSON.stringify({"name": "roya"});
            var ss = s1 + s2;

            var s3 = ss.substring(0, 10);
            var s4 = ss.substring(10, ss.length);

            var sss = s3 + rand + s4;
            var ssss = null;
            var loc = sss.indexOf(rand, 0)
            if(loc >= 0) {
                ssss = sss.substr(0, loc) + ":" + sss.substr(loc+rand.length);
            } else {
                ssss = ">" + sss + "<<<"
            }

            res.status(200).send(sss);
        });

        router.get('/', (req: Request, res: Response) => {
            res.status(200).send({
                message: 'Hello world!'
            })
        });

        router.post('/', (req: Request, res: Response) => {
            const data = req.body;
            res.status(200).send(data);
            console.log(data)
        });

        router.get('/partitions', (req: Request, res: Response) => {
            const hubConnectionString = process.env['EVENTHUB_CONNECTION_STRING'];
            const entityName = process.env['EVENTHUB_NAME']
            retrievePartitions(hubConnectionString, entityName).then((result) => {
                console.log('Received this result: ', result);
                res.status(200).send({'partitions': result});
            }, (error) => {
                console.log('Received this error: ', error);
                res.status(500).send({'error': error});
            })
        });

        router.get('/pug', (req: Request, res: Response) => {
            var data = {'title': 'New pug title', 'message': 'Hello Reza!'};
            res.render('index', data);
        });

        this.app.use('/', router)
    };
}

export default new App().app;