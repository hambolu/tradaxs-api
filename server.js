const express = require('express')
var cw = require('crypto-wallets');
const app = express();
const path = require('path');
var { engine } = require('express-handlebars');
const blockexplorer = require('blockexplorer');
var WAValidator = require('wallet-address-validator');
// var balance = require('crypto-balances');
var balance = require('crypto-balances-2');
var erc20 = require('erc20-wallet');
const Web3 = require('web3');
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080;


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

app.get('/', function(req, res) {
    res.json('App is working');
});


app.get('/btc', function(req, res) {
    var bitcoinWallet = cw.generateWallet('BTC');
    res.json(bitcoinWallet);
});

app.get('/eth', function(req, res) {
    var ethWallet = cw.generateWallet('ETH');
    res.json(ethWallet);
});

app.get('/bch', function(req, res) {
    var bchWallet = cw.generateWallet('BCH');
    res.json(bchWallet);
});

app.get('/ltc', function(req, res) {
    var ltcWallet = cw.generateWallet('LTC');
    res.json(ltcWallet);
});

app.get('/doge', function(req, res) {
    var dogeWallet = cw.generateWallet('DOGE');
    res.json(dogeWallet);
});

app.get('/bnb', function(req, res) {
    var bnb = web3.eth.accounts.create();
    res.json(bnb);
});
//{"address":"0xa111357C5CddA47b9263DDe9D7694008A6b5628b",
//"privateKey":"0x333ade607593d9171346121b7c5215edc50d299cc2acfce37754ff476e1d65eb"}

// create application/json parser
var jsonParser = bodyParser.json()

// app.get('/balance', jsonParser,function (req, res){
//     var pk = req.body.pk;
//     var cryptobalance = balance(pk, function(error, result) {
//         res.json(result);
//       });

// });

app.get('/balance', jsonParser, function(req, res) {
    var pk = req.body.pk;
    //     var cryptobalance = balance(pk, function(error, result) {
    //         res.json(result);
    //       });

    balance(pk)
        .then(result => res.json(result))
        .catch(error => res.json(`OH NO! ${error}`));

});



// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/bnb-balance', jsonParser, function(req, res) {
    var balance = req.body.balance;
    web3.eth.getBalance(balance, function(error, result) {
        res.json(result);
    });
});
//req.body.balance
app.get('/gas', function(req, res) {
    var gas = web3.eth.generate_gas_price();
    res.json(gas);
});
app.post('/bnbtx', jsonParser, function(req, res) {

    var decimals = 18;
    var value = (req.body.amount * (10 ** decimals)).toString();
    var amount = web3.utils.toBN(value);

    var tx = {
            to: req.body.holder,
            value: amount,
            gasPrice: req.body.gprice,
            gas: req.body.gas,
        }
        // transactionhash = 0xc3b7e98d5d2b0858aa8045a6a8af5ce713897864bc85609dc53cfbdcaa3dfc17
    var privateKey = req.body.pkey;

    web3.eth.accounts.signTransaction(tx, privateKey)
        .then(signed => {
            web3.eth.sendSignedTransaction(signed.rawTransaction)
                .on('error', function(error) { res.status(404).json(error) })
                .on('receipt', function(receipt) { res.status(200).json(receipt) })
        });


});

//app.listen(3000, () => console.log('working'))

app.get('/bal', jsonParser, async(req, res, next) => {

    var address = req.body.address;

    const busdAddress = "0x55d398326f99059fF775485246999027B3197955";
    const holderAddress = address;

    // just the `balanceOf()` is sufficient in this case
    const abiJson = [
        { "constant": true, "inputs": [{ "name": "who", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" },
    ];

    const contract = new web3.eth.Contract(abiJson, busdAddress);
    const balance = await contract.methods.balanceOf(holderAddress).call();
    // note that this number includes the decimal places (in case of BUSD, that's 18 decimal places)
    // let privKey = myWallet.dumpPrivKey('0x490156852d3fb042bcccb6b797829c70d350357a');
    // console.log(privKey);
    res.json({ "balance": balance });
})

app.get('/send', jsonParser, async(req, res, next) => {
    var privKey = req.body.pKey;
    var toAddress = req.body.toAddress;
    var fromAddress = req.body.fromAddress;
    var amount = req.body.amount;
    const account = new CryptoAccount(privKey);


    await account.send(toAddress, amount, {
        type: "ERC20",
        address: fromAddress,
    }).then((response) => {
        res.json(response);
    }).catch((error) => {
        res.json(error);
    });

})

app.listen(PORT, () => {
    console.log(`Listing ${PORT}`)
})