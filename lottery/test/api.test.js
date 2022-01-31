var XMLHttpRequest = require('xhr2');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');
var x = 'global'


var getJSON = function(url, callback) {

    var xmlhttprequest = new XMLHttpRequest();
    xmlhttprequest.open('GET', url, true);
    xmlhttprequest.responseType = 'json';

    xmlhttprequest.onload = function() {

        var status = xmlhttprequest.status;

        if (status == 200) {
            callback(null, xmlhttprequest.response);
        } else {
            callback(status, xmlhttprequest.response);
        }
    };

    xmlhttprequest.send();
};



async function upload(json){
   x = json
}


getJSON('http://127.0.0.1:8000/ethereum', async function(err, data) {

    if (err != null) {
        console.error(err);
    } else {
    }

 await upload(data);

let walletId =  await x[0]['walletID']; 
let transHash =  await x[0]['hash'];
let minerId =  await x[0]['minerID'];
let date =  await x[0]['date'];
let miningFee =  await x[0]['miningFee'];




beforeEach( async ()=>{
    accounts = await web3.eth.getAccounts();

    miner = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from: accounts[0], gas: '1000000'})
});

describe('Mining Contract API', ()=>{
    it('Deploys a contract', ()=>{
        assert.ok(miner.options.address);
    });
    it('Assigns wallet', async()=>{
        await miner.methods.assignWallet(walletId).send({
            from: accounts[0]
        });
        const walletSaved = await miner.methods.walletId().call();
        assert.equal(walletId, walletSaved)
    })
    it('Saves the hash id', async ()=>{
        await miner.methods.assignTransHash(transHash).send({
            from: accounts[0], 
        });
        const hashSaved = await miner.methods.transHash().call();
        assert.equal(transHash, hashSaved)
    });
    it('Saves the miner id', async ()=>{
        await miner.methods.assignMiner(minerId).send({
            from: accounts[0], 
        });
        const minerIdSaved = await miner.methods.minerId().call();
        assert.equal(minerId, minerIdSaved)
    });
    it('Saves the date', async ()=>{
        await miner.methods.assignDate(date).send({
            from: accounts[0], 
        });
        const dateSaved = await miner.methods.date().call();
        assert.equal(date, dateSaved)
    });
    it('Saves the mining Fee', async ()=>{
        await miner.methods.assignMiningFee(miningFee).send({
            from: accounts[0], 
        });
        const miningFeeSaved = await miner.methods.miningFee().call();
        assert.equal(miningFee, miningFeeSaved)
    });
    it('Can only be paid by admin', async () =>{
        await miner.methods.assignWallet(accounts[1]).send({
            from: accounts[0]
        });
        await miner.methods.assignTransHash(transHash).send({
            from: accounts[0], 
        });
        await miner.methods.assignMiner(minerId).send({
            from: accounts[0], 
        });
        await miner.methods.assignDate(date).send({
            from: accounts[0], 
        });
        await miner.methods.assignMiningFee(web3.utils.toWei(String(miningFee))).send({
            from: accounts[0], 
        });
        try{
            await miner.methods.payMiner().send({
                from: accounts[1]
            })
           assert(false);
        } catch(err){
            assert(err);
        }
    });
    
    
})

});


