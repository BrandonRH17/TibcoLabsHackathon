const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');


let walletId = '0xcC7C4D0F193883b0c090E4d0F18e13592E6234Db'; 
let transHash = 'a98253177d5ab423038313cb591368eacdaf18d4';
let minerId = 'GT-502';
let date = '2022-01-28 16:43:34';
let miningFee = 1;




beforeEach( async ()=>{
    accounts = await web3.eth.getAccounts();

    miner = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from: accounts[0], gas: '1000000'})
});

describe('Mining Contract Local', ()=>{
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