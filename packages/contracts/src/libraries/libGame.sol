pragma solidity >=0.8.0;


library LibGame {

    function addressToEntityKey(address addr)internal pure returns (bytes32) {
        return bytes32(uint256(uint160(addr)));
    }

    function positionToEntityKey(int256 x, int256 y)internal pure returns (bytes32) {
        return keccak256(abi.encode(x, y));
    }
}
 