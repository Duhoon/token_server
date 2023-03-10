const Web3 = require("web3");
const axios = require("axios");
require("dotenv").config();
const provider = process.env.PROVIDER;

const web3 = new Web3(provider);



// Contract
const RockCoin = require("./contract.js");

const getTransactionsByAccount = async(account, startBlock, endBlock)=>{
    const result = await web3.eth.getPastLogs({
        fromBlock: startBlock || "earliest", 
        toBlock: endBlock || "latest", 
        address: account,
        topics:[null]
    })
    .then(console.log);
}

module.exports = {
    sendToken : async (req, res) =>{
        if(!req.body.recipient || !req.body.amount) 
            return res.status(400).send("Require All Parameter for Transfer Token");

        const data = RockCoin.methods.transfer(req.body.recipient,req.body.amount).encodeABI();

        const tx = {
            from: process.env.CURRENT_ACCOUNT,
            to: "0xe0C753D9d5Bad3b93BACCBeD5821b6d439B49f22",
            gas: 24000,
            data
        }

        const txSigned = await web3.eth.accounts.signTransaction(tx, process.env.CURRENT_PRIVATEKEY)
        .catch(err=>{
            console.log(err);
            return res.status(500).send("Internal Error");
        });

        return await axios.post(process.env.PROVIDER, {
            jsonrpc: "2.0",
            method: "eth_sendRawTransaction",
            params: [txSigned.rawTransaction],
            id: 1
        })
        .then(result=>{
            console.log(result.data);
            return res.status(202).send(result.data);
        })
        .catch(err=>{
            console.log(err);
            return res.status(404).send(err);
        })

        

        /******************************************/
        /*          Failed Case 2           */
        /******************************************/

        // const isUnlocked = await new web3.eth.personal.unlockAccount(process.env.CURRENT_ACCOUNT, "", 600)
        // .then((result)=>{ 
        //     console.log("Account unlocked!")
        //     return result;
        // })
        // .catch(err=>{
        //     console.log("Not available to unlock Account");
        //     return err;
        // })

        // console.log(isUnlocked);
        // if (!isUnlocked) return res.status(500).send("Not available to unlock Account");

        /******************************************/
        /*          Failed Case 1           */
        /******************************************/

        // const signer = web3.eth.accounts.privateKeyToAccount(process.env.CURRENT_PRIVATEKEY)
        // web3.eth.accounts.wallet.add(signer);

        // console.log(signer.address);

        // return RockCoin.methods.transfer(req.body.recipient, req.body.amount).send({from:signer.address})
        // .then(tx=>{
        //     console.log(tx)
        //     res.status(201).send(tx);
        // })
        // .catch(err=>{
        //     console.log(err);
        //     return res.status(500).send("Internal Error");
        // });
    },

    getBalanceOf : async(req, res)=>{
        if (!req.params.owner) return res.status(400).send("Owner address required");

        return await RockCoin.methods.balanceOf(req.params.owner).call()
        .then(receipt=>{
            console.log(receipt);
            res.status(200).send(receipt);
        })
        .catch(err=>{
            console.log(err);
            return res.status(500).send("Internal Error");
        });
    },

    getAccounts : async(req, res)=>{
        return await web3.eth.getAccounts()
        .then(accounts=>{
            if (accounts.length > 0) return res.status(200).send(accounts);
            else return res.status(204).send("Empty");
        })
        .catch(err=>{
            console.log(err);
            return res.status(404).send("Interanl Error");
        });
    }

}