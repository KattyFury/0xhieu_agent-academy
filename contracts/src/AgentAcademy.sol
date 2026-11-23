// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/// @title AgentAcademy
/// @notice Records which chapters of a book an Agent ID holder has completed and
///         issues an on-chain certificate when every chapter is recorded.
/// @dev Independent community project. Not affiliated with, endorsed by, or
///      operated by Binance. No proxy, not payable, holds no funds, takes no
///      approvals, no pause, no mint. The only external call is the view
///      `balanceOf` on the Agent ID contract. Progress is keyed by `msg.sender`.
///      Owner power: `createBook` only.
contract AgentAcademy is Ownable {
    /// @notice Agent ID NFT contract (BSC: 0x60b9262456de011f7d15a54cdd8c48baaa8b022f). Writers must hold one.
    IERC721 public immutable agentId;

    /// @dev bookId => chapter count (1..256); 0 = book does not exist.
    mapping(uint256 bookId => uint16) private _chapterCount;
    /// @dev bit i = chapter i+1 completed.
    mapping(uint256 bookId => mapping(address learner => uint256)) private _mask;
    mapping(uint256 bookId => mapping(address learner => uint40)) private _certificateAt;

    event BookCreated(uint256 indexed bookId, uint16 chapterCount);
    event ChapterCompleted(address indexed user, uint256 indexed bookId, uint256 newBits, uint16 count);
    event CertificateIssued(address indexed user, uint256 indexed bookId);

    error NoAgentId();
    error BookNotFound();
    error BookExists();
    error InvalidChapterCount();
    error InvalidMask();
    error NothingNew();

    constructor(address agentIdContract, address initialOwner) Ownable(initialOwner) {
        agentId = IERC721(agentIdContract);
    }

    /// @notice Create a book once. Its chapter count can never change.
    function createBook(uint256 bookId, uint16 chapterCount) external onlyOwner {
        if (_chapterCount[bookId] != 0) revert BookExists();
        if (chapterCount == 0 || chapterCount > 256) revert InvalidChapterCount();
        _chapterCount[bookId] = chapterCount;
        emit BookCreated(bookId, chapterCount);
    }

    /// @notice Record completed chapters for the caller. `mask` is cumulative progress:
    ///         bits already recorded are ignored, at least one bit must be new.
    function completeChapters(uint256 bookId, uint256 mask) external {
        if (agentId.balanceOf(msg.sender) == 0) revert NoAgentId();
        uint16 total = _chapterCount[bookId];
        if (total == 0) revert BookNotFound();
        if (mask == 0 || (total < 256 && mask >> total != 0)) revert InvalidMask();

        uint256 old = _mask[bookId][msg.sender];
        uint256 newBits = mask & ~old;
        if (newBits == 0) revert NothingNew();

        uint256 next = old | mask;
        _mask[bookId][msg.sender] = next;
        uint16 count = _popcount(next);
        emit ChapterCompleted(msg.sender, bookId, newBits, count);

        if (count == total) {
            _certificateAt[bookId][msg.sender] = uint40(block.timestamp);
            emit CertificateIssued(msg.sender, bookId);
        }
    }

    function books(uint256 bookId) external view returns (uint16 chapterCount) {
        return _chapterCount[bookId];
    }

    function progressOf(address learner, uint256 bookId)
        external
        view
        returns (uint256 mask, uint16 count, bool certified)
    {
        mask = _mask[bookId][learner];
        count = _popcount(mask);
        certified = _certificateAt[bookId][learner] != 0;
    }

    function hasCertificate(address learner, uint256 bookId) external view returns (bool certified, uint40 issuedAt) {
        issuedAt = _certificateAt[bookId][learner];
        certified = issuedAt != 0;
    }

    function _popcount(uint256 x) private pure returns (uint16 n) {
        while (x != 0) {
            x &= x - 1;
            ++n;
        }
    }
}
