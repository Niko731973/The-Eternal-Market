pragma solidity ^0.4.11;

/* Taken from https://github.com/Dexaran/ERC223-token-standard */

contract ERC223Interface {
    uint public totalSupply;
    function balanceOf(address who) constant returns (uint);
    function transfer(address to, uint value);
    function transfer(address to, uint value, bytes data);
    event Transfer(address indexed from, address indexed to, uint value, bytes data);
}
