import * as url from 'url';
import * as bodyParser from 'body-parser';
import {DbInfo, Transaction, WalletDB} from './walletDB';


export function plugin(app) {
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

    app.get('/transactions', (req, res) => {
        var url_parts : url.Url = url.parse(req.url, true);
        var dbInfo = new DbInfo(url_parts.query.host, url_parts.query.user, url_parts.query.password, url_parts.query.database);
        WalletDB.getTransactions(dbInfo).then( (transactions) => {
            res.json( transactions );
        }, (error) => {
            res.status(400).send(error);
        });
    });

    app.post('/transactions', (req, res) => {
        var url_parts : url.Url = url.parse(req.url, true);
        var dbInfo = new DbInfo(url_parts.query.host, url_parts.query.user, url_parts.query.password, url_parts.query.database);
        WalletDB.insertTransaction(dbInfo, req.body).then( (data)=> {
            res.send( data );
        }, (error)=> {
            res.status(400).send(error);
        });
    });

    app.put('/transactions', (req, res) => {
        var url_parts : url.Url = url.parse(req.url, true);
        var dbInfo = new DbInfo(url_parts.query.host, url_parts.query.user, url_parts.query.password, url_parts.query.database);
        var body = req.body;
        if ( !Array.isArray(body) ) {
            body = [ body ];
        }
        WalletDB.Update(dbInfo, body).then( (data) => {
            res.send( undefined );
        }, (error) => {
            res.status(400).send(error);
        });
    });
}