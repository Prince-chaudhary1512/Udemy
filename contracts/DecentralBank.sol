// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;
    address[] public staker;

    event TokensDeposited(address indexed user, uint256 amount);
    
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    constructor(RWD _rwd, Tether _tether) {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender; // set the owner of the contract
    }

    function depositToken(uint _amount) public {
    require(_amount > 0, 'amount is greater than 0');

    uint approvedAmount = tether.allowance(msg.sender, address(this));
    require(approvedAmount >= _amount, 'amount not approved');

    tether.transferFrom(msg.sender, address(this), _amount);
    stakingBalance[msg.sender] += _amount;

    if(!hasStaked[msg.sender]){ // check if the sender has staked before
        staker.push(msg.sender);
    }

    isStaked[msg.sender] = true;
    hasStaked[msg.sender] = true;

    emit TokensDeposited(msg.sender, _amount);
 }

   function unstakeTokens() public{
    uint balance = stakingBalance[msg.sender];
    require(balance > 0,'staking balance can not be less than zero');

    tether.transfer(msg.sender, balance);

    stakingBalance[msg.sender] = 0;

    isStaked[msg.sender] = false;
   }
   
   function issueTokens() public {
    require(msg.sender == owner , 'caller must be owner');

    for (uint i=0;i<staker.length;i++) {
        address recipient = staker[i];
        uint balance = stakingBalance[recipient]/9;
        if(balance > 0) {
            rwd.transfer(recipient, balance);
        }
    }
   }
  
}