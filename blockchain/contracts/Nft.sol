// SPDX-License-Identifier: SUPSI
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.28;

import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFT
 * @dev A contract for creating and managing NFTs with metadata storage
 * @notice This contract implements ERC721 with additional features like pausing and URI storage
 */
contract NFT is ERC721, ReentrancyGuard, ERC721URIStorage, Ownable, ERC721Pausable {

    address public immutable deployer;
    // State Variables
    uint256 private _nextTokenId;                    // Counter for the next token ID
    address private _marketplaceAddress;             // Address of the marketplace contract
    uint256[] private _mintedNfts;                   // Array of all minted token IDs
    mapping(uint256 => address) private _creators;   // Mapping of token IDs to their creators
    string private _collectionImageUri;              // URI for the collection image

    // Events
    event TokenMinted(uint256 indexed tokenId, string tokenURI, address marketplaceAddress);
    event CollectionImageUpdated(string newImageUri);

    /**
     * @dev Constructor initializes the NFT contract
     * @param name Name of the NFT collection
     * @param symbol Symbol of the NFT collection
     * @param marketplaceAddress Address of the marketplace contract
     * @param collectionImageUri URI for the collection image
     */
    constructor(
        string memory name,
        string memory symbol,
        address marketplaceAddress,
        address _deployer,
        string memory collectionImageUri
    ) 
        ERC721(name, symbol)
        Ownable(msg.sender) 
    {
        _marketplaceAddress = marketplaceAddress;
        deployer = _deployer;
        _collectionImageUri = collectionImageUri;
    }

    /**
     * @dev Mints a new NFT with the given metadata URI
     * @param uri URI pointing to the NFT's metadata
     * @return tokenId The ID of the newly minted token
     * @notice Only works when contract is not paused
     * @notice Automatically assigns the next available token ID
     */
    function mint(string memory uri) public whenNotPaused returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        _mintedNfts.push(tokenId);
        _creators[tokenId] = msg.sender; 
        emit TokenMinted(tokenId, uri, _marketplaceAddress);
        _nextTokenId++;
        return tokenId;
    }

    function getLastTokenId() public view returns (uint256){
        return _nextTokenId-1;
    }

    /**
     * @dev Pauses all token transfers and minting
     * @notice Only callable by the contract owner
     */
    function pause() public onlyOwner {
        _pause();
    }

    /**
     * @dev Unpauses all token transfers and minting
     * @notice Only callable by the contract owner
     */
    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Returns an array of all minted token IDs
     * @return uint256[] Array of all minted token IDs
     */
    function getAllMintedNfts() view public returns (uint256[] memory) {
        return _mintedNfts;
    }

    /**
     * @dev Returns an array of token IDs owned by the caller
     * @return uint256[] Array of token IDs owned by the caller
     */
    function getTokensOwnedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _nextTokenId;
        uint256 numberOfTokensOwned = balanceOf(msg.sender);
        uint256[] memory ownedTokenIds = new uint256[](numberOfTokensOwned);

        uint256 currentIndex = 0;
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            if (ownerOf(i) == msg.sender) {
                ownedTokenIds[currentIndex] = i;
                currentIndex += 1;
            }
        }

        return ownedTokenIds;
    }

    /**
     * @dev Returns the creator address of a specific token
     * @param tokenId ID of the token to query
     * @return address Address of the token's creator
     */
    function getTokenCreatorById(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    /**
     * @dev Returns an array of token IDs created by the caller
     * @return uint256[] Array of token IDs created by the caller
     */
    function getTokensCreatedByMe() public view returns (uint256[] memory) {
        uint256 numberOfExistingTokens = _nextTokenId;
        uint256 numberOfTokensCreated = 0;

        // First count how many tokens were created by the caller
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            if (_creators[i] == msg.sender) {
                numberOfTokensCreated += 1;
            }
        }

        uint256[] memory createdTokenIds = new uint256[](numberOfTokensCreated);
        uint256 currentIndex = 0;

        // Then collect the token IDs
        for (uint256 i = 0; i < numberOfExistingTokens; i++) {
            if (_creators[i] == msg.sender) {
                createdTokenIds[currentIndex] = i;
                currentIndex += 1;
            }
        }

        return createdTokenIds;
    }

    /**
     * @dev Returns the collection image URI
     * @return string The URI of the collection image
     */
    function getCollectionImageUri() public view returns (string memory) {
        return _collectionImageUri;
    }

    /**
     * @dev Updates the collection image URI
     * @param newImageUri The new URI for the collection image
     * @notice Only callable by the contract owner
     */
    function updateCollectionImageUri(string memory newImageUri) public onlyOwner {
        _collectionImageUri = newImageUri;
        emit CollectionImageUpdated(newImageUri);
    }

    // Override functions required by Solidity
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}