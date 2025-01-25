// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

contract Tether
{
    string public name = 'Tether';
    string public symbol = 'dUSDT';
    uint256 public supply = 1000000000000000000000000; // 1 million supply 1eth = 100000000000000000000 wie
    uint public decimal = 18; 

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value 
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping(address => uint) public balanceof;
    mapping(address => mapping(address => uint)) public allowance;

    constructor() {
        balanceof[msg.sender] = supply;
    }

    function transfer(address _to , uint _value) public returns(bool success) {
        require(balanceof[msg.sender] >= _value);
        balanceof[msg.sender] -= _value;
        balanceof[_to] += _value;
        emit Transfer(msg.sender,_to,_value);
        return true;
    }

    function approve(address _spender , uint _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from , address _to , uint _value) public returns(bool success) {
        require(balanceof[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value);
        balanceof[_from] -= _value;
        balanceof[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from,_to,_value);
        return true; 
    }
}