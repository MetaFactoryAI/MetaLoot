// contracts/MetaLoot.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/*
╔╦╗┌─┐┌┬┐┌─┐╦  ┌─┐┌─┐┌┬┐
║║║├┤  │ ├─┤║  │ ││ │ │
╩ ╩└─┘ ┴ ┴ ┴╩═╝└─┘└─┘ ┴
𝕞𝕒𝕕𝕖 𝕨𝕚𝕥𝕙 ♥ 𝕓𝕪 𝕄𝕖𝕥𝕒𝔽𝕒𝕔𝕥𝕠𝕣𝕪
*/
contract MetaLoot is ERC1155Supply, Ownable {
  uint256 public saleTokenId;
  address public paymentTokenContract;
  uint256 public maxSupply;
  uint256 public salePrice;
  bool public saleActive;

  // Base URI
  string private _baseURI;

  // Custom token URIs for each NFT
  mapping(uint256 => string) private _tokenURIs;

  event Activate(uint256 indexed tokenId, address paymentToken, uint256 price, uint256 maxSupply);
  event Deactivate(uint256 saleTokenId);

  constructor(string memory uri_) ERC1155("") {
    _baseURI = uri_;
  }

  /**
   * @dev returns the base URI since the actual uri function is overridden
   */
  function baseURI() public view returns (string memory) {
    return _baseURI;
  }

  function setBaseURI(string memory uri_) external onlyOwner {
    _baseURI = uri_;
  }

  function uri(uint256 tokenId) public view override returns (string memory) {
    return _tokenURI(tokenId);
  }

  function _tokenURI(uint256 tokenId) internal view returns (string memory) {
    string memory uri_ = _tokenURIs[tokenId];
    string memory base_ = baseURI();

    // If token URI is set, concatenate the baseURI and tokenURI
    if (bytes(uri_).length > 0) {
      return string(abi.encodePacked(base_, uri_));
    }

    return base_;
  }

  /**
   * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
   */
  function _setTokenURI(uint256 tokenId, string memory tokenUri_) internal {
    _tokenURIs[tokenId] = tokenUri_;
    emit URI(_tokenURI(tokenId), tokenId);
  }

  /**
    * @dev Activate public sale
    */
  function activate(address paymentTokenContract_, uint256 salePrice_, uint256 saleTokenId_, string memory tokenURI_, uint256 maxSupply_) external onlyOwner {
    require(!saleActive, "Already active");
    saleActive = true;
    saleTokenId = saleTokenId_;
    paymentTokenContract = paymentTokenContract_;
    salePrice = salePrice_;
    maxSupply = maxSupply_;
    _setTokenURI(saleTokenId_, tokenURI_);
    emit Activate(saleTokenId, paymentTokenContract, salePrice, maxSupply);
  }

  /**
   * @dev Deactivate public sale
   */
  function deactivate() external onlyOwner {
    saleActive = false;
    emit Deactivate(saleTokenId);
  }

  /**
   * @dev Buy and mint MetaLoot
   */
  function buyMetaLoot(uint256 numItems) external {
    require(saleActive, "Inactive");
    require(numItems <= 5 && numItems > 0, "Invalid amount requested");

    IERC20 token = IERC20(paymentTokenContract);
    address self = address(this);

    uint256 totalAmount = salePrice * numItems;
    require(
      token.allowance(msg.sender, self) >= totalAmount,
      "Token allowance too low"
    );

    uint256 newSupply = ERC1155Supply.totalSupply(saleTokenId) + numItems;
    require(newSupply <= maxSupply, "Requesting more than max supply");

    bool sent = token.transferFrom(msg.sender, self, totalAmount);
    require(sent, "Token transfer failed");

    _mint(msg.sender, saleTokenId, numItems, "");
  }

  /**
   * @dev Pull sales proceeds from contract
   */
  function withdrawFunds(IERC20 token, address recipient) external onlyOwner {
    uint256 contractBalance = token.balanceOf(address(this));
    token.transfer(recipient, contractBalance);
  }

  /**
   * @dev mint a new token
   */
  function mint(address account, uint256 id, uint256 amount, bytes memory data) public onlyOwner {
    _mint(account, id, amount, data);
  }

  function burn(
    address account,
    uint256 id,
    uint256 amount
  ) public {
    require(
      account == _msgSender() || isApprovedForAll(account, _msgSender()),
      "ERC1155: caller is not owner nor approved"
    );

    _burn(account, id, amount);
  }

  function burnBatch(
    address account,
    uint256[] memory ids,
    uint256[] memory amounts
  ) public {
    require(
      account == _msgSender() || isApprovedForAll(account, _msgSender()),
      "ERC1155: caller is not owner nor approved"
    );

    _burnBatch(account, ids, amounts);
  }
}