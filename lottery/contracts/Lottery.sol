pragma solidity ^0.4.17;

contract Mining {
    address public administrator;
    address public walletId;
    string public transHash;
    string public minerId;
    string public date;
    uint256 public miningFee;

    modifier adminRights() {
        require(msg.sender == administrator);
        _;
    }

    function Mining() public {
        administrator = msg.sender;
    }

    function fundMining() public payable {}

    function assignTransHash(string newTransHash) public adminRights {
        transHash = newTransHash;
    }

    function assignWallet(address newWallet) public {
        walletId = newWallet;
    }

    function assignMiner(string newMiner) public adminRights {
        minerId = newMiner;
    }

    function assignDate(string newDate) public adminRights {
        date = newDate;
    }

    function assignMiningFee(uint256 newMiningFee) public adminRights {
        miningFee = newMiningFee;
    }

    function payMiner() public adminRights {
        require(
            bytes(transHash).length > 0 &&
                bytes(date).length > 0 &&
                bytes(minerId).length > 0 &&
                miningFee > 0
        );
        walletId.transfer(miningFee);
    }
}
