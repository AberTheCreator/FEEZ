pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract FeezNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    string private _baseTokenURI;

    mapping(address => uint256) public mintsPerAddress;

    uint256 public constant MAX_MINTS_PER_ADDRESS = 10;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }

    function mint(address to, string memory tokenURI) public returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(mintsPerAddress[to] < MAX_MINTS_PER_ADDRESS, "Max mints per address exceeded");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        unchecked { mintsPerAddress[to]++; }

        emit NFTMinted(to, tokenId, tokenURI);

        return tokenId;
    }

    function mintToSelf() public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();

        string memory defaultURI = string(
            abi.encodePacked(
                _baseTokenURI,
                Strings.toString(tokenId)
            )
        );

        return mint(msg.sender, defaultURI);
    }

    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
}
