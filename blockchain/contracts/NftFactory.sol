// SPDX-License-Identifier: SUPSI
pragma solidity ^0.8.28;

import "./Nft.sol";

/**
 * @title NFTFactory
 * @dev A factory contract for deploying new NFT collections
 * @notice This contract manages the creation of new NFT collections and keeps track of all deployed collections
 */
contract NFTFactory {
    // State Variables
    address[] public deployedNFTs;           // Array of all deployed NFT contract addresses
    address public marketplaceAddress;       // Address of the marketplace contract
    
    // Events
    event NFTContractCreated(address nftAddress, string name, string symbol, address owner);

    /**
     * @dev Constructor initializes the factory with the marketplace address
     * @param _marketplaceAddress Address of the marketplace contract
     */
    constructor(address _marketplaceAddress) {
        marketplaceAddress = _marketplaceAddress;
    }

    /**
     * @dev Creates a new NFT collection contract
     * @param name Name of the new NFT collection
     * @param symbol Symbol of the new NFT collection
     * @return address Address of the newly created NFT contract
     * @notice The new NFT contract is initialized with the marketplace address
     */
    function createNFTContract(string memory name, string memory symbol, string memory collectionImageUri ) public returns (address) {
        NFT newNFT = new NFT(name, symbol, marketplaceAddress, msg.sender, collectionImageUri);
        deployedNFTs.push(address(newNFT));
        emit NFTContractCreated(address(newNFT), name, symbol, msg.sender);
        return address(newNFT);
    }

    /**
     * @dev Returns an array of all deployed NFT contract addresses
     * @return address[] Array of all deployed NFT contract addresses
     */
    function getDeployedNFTs() public view returns (address[] memory) {
        return deployedNFTs;
    }
}