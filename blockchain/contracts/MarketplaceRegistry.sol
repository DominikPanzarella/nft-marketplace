// SPDX-License-Identifier: SUPSI
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.28;

import "./Nft.sol";

/**
 * @title MarketplaceRegistry
 * @dev A contract for managing NFT marketplace items, including listing, buying, and tracking ownership
 * @notice This contract handles the creation and management of market items for NFTs
 */
contract MarketplaceRegistry is ReentrancyGuard {
    // State Variables
    address payable private owner; // Contract owner address
    uint256 private _marketItemIds; // Counter for market item IDs
    uint256 _tokensSold; // Counter for sold tokens
    uint256 _tokensCanceled; // Counter for canceled listings
    uint256 private listingFee = 0.01 ether; // Fee for listing an itemu
    int256 private unlistingFee = 0.0 ether; // Gratis di default
    uint256 private royaltyPercentage = 25; // 2.5%

    // Mapping to store market items by their ID
    mapping(uint256 => MarketItem) private marketItemIdToMarketItem;

    function getListingFee() public view returns (uint256) {
        return listingFee;
    }


    /**
     * @dev Structure representing a market item
     * @param marketItemId Unique identifier for the market item
     * @param nftContractAddress Address of the NFT contract
     * @param tokenId ID of the NFT token
     * @param creator Original creator of the NFT
     * @param seller Current seller of the NFT
     * @param owner Current owner of the NFT
     * @param price Listing price in wei
     * @param sold Whether the item has been sold
     * @param canceled Whether the listing has been canceled
     */
    struct MarketItem {
        uint256 marketItemId;
        address nftContractAddress;
        uint256 tokenId;
        address payable creator;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
        bool canceled;
        bool list;
    }

    // Events
    event MarketItemCreated(
        uint256 indexed marketItemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price,
        bool sold,
        bool canceled,
        bool list
    );

    event MarketItemListed(
        uint256 indexed marketItemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address creator,
        address seller,
        address owner,
        uint256 price
    );
    
    event MarketItemSold(
                uint256 indexed marketItemId,
        address indexed nftContract,
        uint256 indexed tokenId,
                address seller,
        address owner,
        uint256 price
    );

    /**
     * @dev Constructor initializes the contract with the deployer as owner
     */
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev Creates a new market item for an NFT
     * @param nftContractAddress Address of the NFT contract
     * @param tokenId ID of the NFT token to list
     * @return marketItemId The ID of the newly created market item
     * @notice Requires price to be greater than 0
     * @notice Transfers the NFT from seller to this contract
     */
    function createMarketItem(
        address nftContractAddress,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant returns (uint256) {
        require(
            msg.value == listingFee,
            "Price must be equal to listing price"
        );


        uint256 marketItemId = _marketItemIds;

        address creator = NFT(nftContractAddress).getTokenCreatorById(tokenId);

        marketItemIdToMarketItem[marketItemId] = MarketItem(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(creator),
            payable(msg.sender),
            payable(address(0)),
            price, //eth price
            false,
            false,
            false
        );

        ERC721(nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        emit MarketItemCreated(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(creator),
            payable(msg.sender),
            payable(msg.sender),
            0,
            false,
            false,
            false
        );

        _marketItemIds++;
        return marketItemId;
    }

    function retrieveMarketItemyByMarketId(
                uint256 tokenId
    ) public view returns (MarketItem memory) {
        require(tokenId >= 0, "Invalid tokenId");
        return marketItemIdToMarketItem[tokenId];
    }






    function createUnlistedMarketItem(
        address nftContractAddress,
        uint256 tokenId
    ) public returns (uint256) {
        // Just increment ID and create item

        uint256 marketItemId = _marketItemIds;

        //address creator = NFT(nftContractAddress).getTokenCreatorById(tokenId);

        // Create market item
        marketItemIdToMarketItem[marketItemId] = MarketItem(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(msg.sender), // Owner set to zero address (unclaimed)
            0, // Price = 0 (unlisted)
            false, // Not sold
            false, // Not canceled
            false // Not listed
        );

        require(
            marketItemIdToMarketItem[marketItemId].marketItemId == marketItemId,
            "Creation failed"
        );

        // Transfer NFT - WILL FAIL IF NOT APPROVED
        //IERC721(nftContractAddress).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            marketItemId,
            nftContractAddress,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            payable(msg.sender),
            0,
            false,
            false,
            false
        );

        _marketItemIds++;
        return marketItemId;
    }

    function listMarketItem(
        uint256 marketItemId,
        uint256 price
    ) public payable nonReentrant returns (MarketItem memory) {
        require(msg.value == listingFee, "Must pay listing fee");
        
        MarketItem storage item = marketItemIdToMarketItem[marketItemId];
        
        // Controlli di sicurezza
        require(item.owner == msg.sender, "Only owner can list the item");
        require(
            IERC721(item.nftContractAddress).ownerOf(item.tokenId) == msg.sender,
            "You must possess the NFT to list it"
        );
        //require(!item.sold, "Item already sold");
        require(!item.canceled, "Item is canceled");
        require(price > 0, "Price must be greater than 0");
        require(!item.list, "Item is already listed");

        // Aggiornamento dello stato PRIMA del trasferimento (best practice Checks-Effects-Interactions)
        item.price = price;
        item.list = true;
        item.seller = payable(msg.sender);
        item.owner = payable(address(0)); // Owner diventa zero address quando listato

        // Trasferimento NFT obbligatorio
        IERC721(item.nftContractAddress).transferFrom(
            msg.sender,
            address(this),
            item.tokenId
        );

        // Trasferimento della fee al proprietario del contratto
        payable(owner).transfer(listingFee);

        emit MarketItemListed(
            marketItemId,
            item.nftContractAddress,
            item.tokenId,
            item.creator,
            msg.sender,
            address(0), // Owner è zero quando listato
            price
        );

        return marketItemIdToMarketItem[marketItemId];
    }

    function getItemId(        
        address contractAddress,
        uint256 tokenId
    ) public view returns (uint256, bool) {
        uint256 itemsCount = _marketItemIds;

        for (uint256 i = 0; i < itemsCount; i++) {
            MarketItem memory item = marketItemIdToMarketItem[i];
            if (
                item.tokenId != tokenId &&
                item.nftContractAddress != contractAddress
            ) continue;
            return (i, true);
        }

        return (itemsCount, false);
    }
  

    function getAllContractsAddress() public view returns (address[] memory) {
        // First pass: count unique addresses
        uint256 itemsCount = _marketItemIds;
        address[] memory items = new address[](itemsCount);


        for (uint256 i = 0; i < itemsCount; i++) {
            MarketItem memory item = marketItemIdToMarketItem[i];
            items[i] = item.nftContractAddress;
        }

        //!!!!: actually it doesnt return unique address, need to adjust it at frontend
        return items;
    }

    function retrieveMarketItemByCollectionAndTokenId(
        address contractAddress,
        uint256 tokenId
    ) public view returns (MarketItem memory, bool) {
        uint256 itemsCount = _marketItemIds;

        for (uint256 i = 0; i < itemsCount; i++) {
            MarketItem memory item = marketItemIdToMarketItem[i];
            if (
                item.tokenId != tokenId &&
                item.nftContractAddress != contractAddress
            ) continue;
            return (item, true);
        }

        MarketItem memory emptyMarketItem;
        return (emptyMarketItem, false);
    }

    //TODO: it gives some errors, probably better to delete and filters in frontend.
    function retrieveAllMarketItems()
        public
        view
        returns (MarketItem[] memory)
    {
        uint256 itemsCount = _marketItemIds;
        MarketItem[] memory items = new MarketItem[](itemsCount);

        // Again start from 1
        for (uint256 i = 0; i < itemsCount; i++) {
            items[i] = marketItemIdToMarketItem[i]; // Store in 0-based array
        }
        return items;
    }

    function retrieveByMarketplaceTokenId(
        uint256 marketItemId
    ) public view returns (MarketItem memory) {
        MarketItem memory item = marketItemIdToMarketItem[marketItemId];
        require(item.marketItemId >= 0, "Market item does not exist");
        return item;
    }

    /*

        //TODO: all following indexes need to be adjusted

    */



    /**
     * @dev Returns the latest market item for a given token ID
     * @param tokenId ID of the token to search for
     * @return MarketItem The latest market item for the token
     * @return bool Whether a market item was found
     */
    function getLatestMarketItemByTokenId(
        uint256 tokenId
    ) public view returns (MarketItem memory, bool) {
        uint256 itemsCount = _marketItemIds;

        for (uint256 i = itemsCount; i >= 0; i--) {
            MarketItem memory item = marketItemIdToMarketItem[i];
            if (item.tokenId != tokenId) continue;
            return (item, true);
        }

        MarketItem memory emptyMarketItem;
        return (emptyMarketItem, false);
    }

    /**
     * @dev Creates a market sale for an NFT
     * @param nftContractAddress Address of the NFT contract
     * @param marketItemId ID of the market item to purchase
     * @notice Requires exact payment amount
     * @notice Transfers NFT to buyer and payment to seller
     * @notice Transfers listing fee to contract owner
     */
        function createMarketSale(
            address nftContractAddress,
            uint256 marketItemId
        ) public payable nonReentrant {
            // 1. Get the market item
            MarketItem storage item = marketItemIdToMarketItem[marketItemId];
                // Update validation
            require(msg.value == item.price, "Incorrect payment amount");
            require(item.list, "Item not currently listed");
            require(!item.canceled, "Item was canceled");

            require(
                IERC721(nftContractAddress).ownerOf(item.tokenId) == address(this),
                "Marketplace doesn't hold this NFT"
            );
            require(
                item.seller != msg.sender,
                "Seller cannot buy their own item"
            );

            // 3. Update state BEFORE external calls (Checks-Effects-Interactions pattern)
            item.owner = payable(msg.sender);
            address previouse_seller = item.seller;
            item.seller = payable(msg.sender);
            item.sold = true;
            item.list = false;
            item.canceled = false;
            _tokensSold++;

            // 4. Execute transfers
            
            IERC721(nftContractAddress).transferFrom(
                address(this),
                msg.sender,
                item.tokenId
            );

            // 5. Transfer payments
            // First transfer listing fee to marketplace owner
            (bool feeSuccess, ) = owner.call{value: listingFee}("");
            require(feeSuccess, "Failed to transfer listing fee to marketplace owner");

             // Calculate remaining amount after listing fee
            uint256 remainingAmount = item.price - listingFee;

            // Check if this is a secondary sale (buyer is not the creator)
            if (msg.sender != item.creator) {
                // Calculate royalty amount (2.5% of the remaining amount)
                uint256 royaltyAmount = (remainingAmount * royaltyPercentage) / 1000; // 2.5%
                
                // Transfer royalty to creator
                (bool royaltySuccess, ) = item.creator.call{value: royaltyAmount}("");
                require(royaltySuccess, "Failed to transfer royalty to creator");
                
                // Transfer remaining amount to seller
                uint256 sellerAmount = remainingAmount - royaltyAmount;
                (bool sellerSuccess, ) = previouse_seller.call{value: sellerAmount}("");
                require(sellerSuccess, "Failed to transfer payment to seller");
            } else {
            // If buyer is creator, transfer full remaining amount to seller
                (bool sellerSuccess, ) = previouse_seller.call{value: remainingAmount}("");
                require(sellerSuccess, "Failed to transfer payment to seller");
            }

            emit MarketItemSold(
                marketItemId,
                nftContractAddress,
                item.tokenId,
                item.seller,
                msg.sender,
                item.price
            );
        }

        
    /**
     * @dev Cancels a market item listing
     * @param nftContractAddress Address of the NFT contract
     * @param marketItemId ID of the market item to cancel
     * @notice Only the seller can cancel a listing
     * @notice Transfers NFT back to seller
     */
    function cancelMarketItem(
        address nftContractAddress,
        uint256 marketItemId
    ) public payable nonReentrant {
        uint256 tokenId = marketItemIdToMarketItem[marketItemId].tokenId;
        require(tokenId >= 0, "Market item has to exist");

        require(
            marketItemIdToMarketItem[marketItemId].seller == msg.sender,
            "You are not the seller"
        );

        IERC721(nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        marketItemIdToMarketItem[marketItemId].owner = payable(msg.sender);
        marketItemIdToMarketItem[marketItemId].canceled = true;
        marketItemIdToMarketItem[marketItemId].list = false;
        marketItemIdToMarketItem[marketItemId].sold = false;

        _tokensCanceled++;
    }

    function unlistMarketItem(
        address nftContractAddress,
        uint256 marketItemId
    ) public payable nonReentrant returns (MarketItem memory){
        uint256 tokenId = marketItemIdToMarketItem[marketItemId].tokenId;
        require(tokenId >= 0, "Market item has to exist");

        require(
            marketItemIdToMarketItem[marketItemId].seller == msg.sender,
            "You are not the seller"
        );

        IERC721(nftContractAddress).transferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        marketItemIdToMarketItem[marketItemId].owner = payable(msg.sender);
        marketItemIdToMarketItem[marketItemId].list = false;
        marketItemIdToMarketItem[marketItemId].canceled = false;
        marketItemIdToMarketItem[marketItemId].sold = false;
        return marketItemIdToMarketItem[marketItemId];
    }

}
