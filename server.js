


const express = require('express')
var cw = require('crypto-wallets');
const app = express();
const path = require('path');
var {engine}  = require('express-handlebars');
const blockexplorer = require('blockexplorer');
var WAValidator = require('wallet-address-validator');
var balance = require('crypto-balances');
var erc20 = require('erc20-wallet');
const Web3 = require('web3');
var bodyParser = require('body-parser')

//let web3 = new Web3('ws://localhost:8546');

//const Web3 = require('web3');
// mainnet
const web3 = new Web3('https://bsc-dataseed1.binance.org:443');

// testnet
//const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');


app.use('/static', express.static('public'));

app.engine('.js', engine());
app.set('views', path.join(__dirname, './apis'));
app.set('view engine', '.js');

app.get('/btc', function (req, res){      
var bitcoinWallet = cw.generateWallet('BTC');
res.json(bitcoinWallet);
});

app.get('/eth', function (req, res){
    var ethWallet = cw.generateWallet('ETH');
res.json(ethWallet);
});

app.get('/bch', function (req, res){
    var bchWallet = cw.generateWallet('BCH');
res.json(bchWallet);
});

app.get('/ltc', function (req, res){
    var ltcWallet = cw.generateWallet('LTC');
res.json(ltcWallet);
});

app.get('/doge', function (req, res){
    var dogeWallet = cw.generateWallet('DOGE');
res.json(dogeWallet);
});

app.get('/bnb', function (req, res){
    var bnb = web3.eth.accounts.create();
    res.json(bnb);
});
//{"address":"0xa111357C5CddA47b9263DDe9D7694008A6b5628b",
//"privateKey":"0x333ade607593d9171346121b7c5215edc50d299cc2acfce37754ff476e1d65eb"}


app.get('/balance', function (req, res){
    var cryptobalance = balance("0x38968A4CE4214d3a3C49B3b2C8E214e6f5F09598", function(error, result) {
        res.json(result);
      });

});

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/bnb-balance', urlencodedParser, function (req, res){
     var balance = req.body.balance;
    web3.eth.getBalance(balance, function(error, result) {
        res.json(result);
      });
});

app.get('/gas', function (req, res){
   var gas = web3.eth.generate_gas_price();
    res.json(gas);
});
app.get('/bnbtx', function (req, res){
    
    var tx = {
        to: '0x083Ad5497e2e02943E7DD8712805f27C38a2A3E2',
        value: '3000000000000000',
        gasPrice: "20000000000",
        gas: "21000",
    }
    // transactionhash = 0xc3b7e98d5d2b0858aa8045a6a8af5ce713897864bc85609dc53cfbdcaa3dfc17
    var privateKey = '0x333ade607593d9171346121b7c5215edc50d299cc2acfce37754ff476e1d65eb';

    web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    });

    
});

app.listen(3000, () => console.log('working'))
