const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let miner; 
let accounts; 


beforeEach( async ()=>{
    accounts = await web3.eth.getAccounts();

    miner = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({data:bytecode})
    .send({from: accounts[0], gas: '1000000'})
});

describe('Mining Contract', ()=>{
    it('Deploys a contract', ()=>{
        assert.ok(miner.options.address);
    });
    it('Assigns wallet', async()=>{
        await miner.methods.assignWallet(accounts[1]).send({
            from: accounts[0]
        });
        const wallet = await miner.methods.walletId().call();
        assert.equal(accounts[1], wallet)
    })
    it('Saves the data id', async ()=>{
        await miner.methods.assignTransHash('1dd4984b0d118569da8620fe67e7fd4bd2889bb316d5ee40ba914eb65f19107d').send({
            from: accounts[0], 
        });
        const hash = await miner.methods.transHash().call();
        assert.equal('1dd4984b0d118569da8620fe67e7fd4bd2889bb316d5ee40ba914eb65f19107d', hash)
    });
    it('Saves the miner id', async ()=>{
        await miner.methods.assignMiner('1A027B').send({
            from: accounts[0], 
        });
        const minerId = await miner.methods.minerId().call();
        assert.equal('1A027B', minerId)
    });
    it('Saves the date', async ()=>{
        await miner.methods.assignDate('20-JUN-1990 08:03:00').send({
            from: accounts[0], 
        });
        const date = await miner.methods.date().call();
        assert.equal('20-JUN-1990 08:03:00', date)
    });
    it('Saves the mining Fee', async ()=>{
        await miner.methods.assignMiningFee(2).send({
            from: accounts[0], 
        });
        const miningFee = await miner.methods.miningFee().call();
        assert.equal(2, miningFee)
    });
    it('Can only be paid by admin', async () =>{
        await miner.methods.assignWallet(accounts[1]).send({
            from: accounts[0]
        });
        await miner.methods.assignTransHash('1dd4984b0d118569da8620fe67e7fd4bd2889bb316d5ee40ba914eb65f19107d').send({
            from: accounts[0], 
        });
        await miner.methods.assignMiner('1A027B').send({
            from: accounts[0], 
        });
        await miner.methods.assignDate('20-JUN-1990 08:03:00').send({
            from: accounts[0], 
        });
        await miner.methods.assignMiningFee(2).send({
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
    it('Pays the miner', async () =>{
        await miner.methods.fundMining().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });
        await miner.methods.assignWallet(accounts[1]).send({
            from: accounts[0]
        });
        await miner.methods.assignTransHash('1dd4984b0d118569da8620fe67e7fd4bd2889bb316d5ee40ba914eb65f19107d').send({
            from: accounts[0], 
        });
        await miner.methods.assignMiner('1A027B').send({
            from: accounts[0], 
        });
        await miner.methods.assignDate('20-JUN-1990 08:03:00').send({
            from: accounts[0], 
        });
        await miner.methods.assignMiningFee(web3.utils.toWei('1.9', 'ether')).send({
            from: accounts[0], 
        });

        const initialBalance = await web3.eth.getBalance(accounts[1]);

        await miner.methods.payMiner().send({
            from: accounts[0]
        });

        const finalBalance = await web3.eth.getBalance(accounts[1])
        const difference = finalBalance - initialBalance;
       

        assert(difference > web3.utils.toWei('1.8', 'ether'))
    });
    
    
})