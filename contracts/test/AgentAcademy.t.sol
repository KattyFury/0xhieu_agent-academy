// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AgentAcademy} from "../src/AgentAcademy.sol";

contract MockAgentId is ERC721 {
    constructor() ERC721("Agent ID", "AI") {}

    function mint(address to, uint256 id) external {
        _mint(to, id);
    }
}

contract AgentAcademyTest is Test {
    MockAgentId internal nft;
    AgentAcademy internal academy;

    address internal owner = makeAddr("owner");
    address internal alice = makeAddr("alice");
    address internal nobody = makeAddr("nobody");

    uint256 internal constant BOOK = 1;
    uint16 internal constant CHAPTERS = 16;

    event ChapterCompleted(address indexed user, uint256 indexed bookId, uint256 newBits, uint16 count);
    event CertificateIssued(address indexed user, uint256 indexed bookId);

    function setUp() public {
        nft = new MockAgentId();
        nft.mint(alice, 1);
        academy = new AgentAcademy(address(nft), owner);
        vm.prank(owner);
        academy.createBook(BOOK, CHAPTERS);
    }

    // --- createBook ---
    function test_OnlyOwnerCreatesBook() public {
        vm.prank(alice);
        vm.expectRevert(abi.encodeWithSelector(Ownable.OwnableUnauthorizedAccount.selector, alice));
        academy.createBook(2, 5);
    }

    function test_DuplicateBookReverts() public {
        vm.prank(owner);
        vm.expectRevert(AgentAcademy.BookExists.selector);
        academy.createBook(BOOK, 3);
        assertEq(academy.books(BOOK), CHAPTERS, "chapter count is immutable");
    }

    function test_ChapterCountBounds() public {
        vm.startPrank(owner);
        vm.expectRevert(AgentAcademy.InvalidChapterCount.selector);
        academy.createBook(2, 0);
        vm.expectRevert(AgentAcademy.InvalidChapterCount.selector);
        academy.createBook(2, 257);
        academy.createBook(2, 256);
        academy.createBook(3, 1);
        vm.stopPrank();
        assertEq(academy.books(2), 256);
        assertEq(academy.books(3), 1);
    }

    // --- completeChapters ---
    function test_NoAgentIdReverts() public {
        vm.prank(nobody);
        vm.expectRevert(AgentAcademy.NoAgentId.selector);
        academy.completeChapters(BOOK, 1);
    }

    function test_UnknownBookReverts() public {
        vm.prank(alice);
        vm.expectRevert(AgentAcademy.BookNotFound.selector);
        academy.completeChapters(99, 1);
    }

    function test_InvalidMasks() public {
        vm.startPrank(alice);
        vm.expectRevert(AgentAcademy.InvalidMask.selector);
        academy.completeChapters(BOOK, 0);
        vm.expectRevert(AgentAcademy.InvalidMask.selector);
        academy.completeChapters(BOOK, uint256(1) << CHAPTERS); // bit 16 = chapter 17
        vm.expectRevert(AgentAcademy.InvalidMask.selector);
        academy.completeChapters(BOOK, type(uint256).max);
        vm.stopPrank();
    }

    function test_ValidMaskRecordsAndEmits() public {
        vm.expectEmit(true, true, false, true);
        emit ChapterCompleted(alice, BOOK, 0x5, 2);
        vm.prank(alice);
        academy.completeChapters(BOOK, 0x5);
        (uint256 mask, uint16 count, bool certified) = academy.progressOf(alice, BOOK);
        assertEq(mask, 0x5);
        assertEq(count, 2);
        assertFalse(certified);
    }

    function test_CumulativeMaskOnlyNewBits() public {
        vm.startPrank(alice);
        academy.completeChapters(BOOK, 0x3);
        vm.expectEmit(true, true, false, true);
        emit ChapterCompleted(alice, BOOK, 0x4, 3); // 0x7 = old 0x3 + new 0x4
        academy.completeChapters(BOOK, 0x7);
        vm.stopPrank();
        (uint256 mask, uint16 count,) = academy.progressOf(alice, BOOK);
        assertEq(mask, 0x7);
        assertEq(count, 3);
    }

    function test_RepeatMaskNothingNew() public {
        vm.startPrank(alice);
        academy.completeChapters(BOOK, 0x6);
        vm.expectRevert(AgentAcademy.NothingNew.selector);
        academy.completeChapters(BOOK, 0x6);
        vm.expectRevert(AgentAcademy.NothingNew.selector);
        academy.completeChapters(BOOK, 0x2);
        vm.stopPrank();
    }

    function test_FullBookIssuesCertificate() public {
        uint256 full = (uint256(1) << CHAPTERS) - 1;
        vm.prank(alice);
        academy.completeChapters(BOOK, full >> 1);
        (bool c0,) = academy.hasCertificate(alice, BOOK);
        assertFalse(c0);

        vm.warp(1_800_000_000);
        vm.expectEmit(true, true, false, false);
        emit CertificateIssued(alice, BOOK);
        vm.prank(alice);
        academy.completeChapters(BOOK, full);

        (bool c1, uint40 at) = academy.hasCertificate(alice, BOOK);
        assertTrue(c1);
        assertEq(at, 1_800_000_000);
        (, uint16 count, bool certified) = academy.progressOf(alice, BOOK);
        assertEq(count, CHAPTERS);
        assertTrue(certified);
    }

    function test_AllAtOnceAnd256Chapters() public {
        vm.prank(owner);
        academy.createBook(2, 256);
        vm.prank(alice);
        academy.completeChapters(2, type(uint256).max);
        (, uint16 count, bool certified) = academy.progressOf(alice, 2);
        assertEq(count, 256);
        assertTrue(certified);
    }

    function test_ProgressIsPerAddressAndBook() public {
        vm.prank(owner);
        academy.createBook(900, 1);
        vm.prank(alice);
        academy.completeChapters(900, 1);
        (, , bool certified900) = academy.progressOf(alice, 900);
        (uint256 maskBook1,,) = academy.progressOf(alice, BOOK);
        (uint256 maskNobody,,) = academy.progressOf(nobody, 900);
        assertTrue(certified900);
        assertEq(maskBook1, 0);
        assertEq(maskNobody, 0);
    }

    function test_NotPayable() public {
        vm.deal(alice, 1 ether);
        vm.prank(alice);
        (bool ok,) = address(academy).call{value: 1}(abi.encodeCall(academy.completeChapters, (BOOK, 1)));
        assertFalse(ok);
        assertEq(address(academy).balance, 0);
    }

    function testFuzz_MaskWithinBounds(uint256 mask) public {
        uint256 full = (uint256(1) << CHAPTERS) - 1;
        vm.prank(alice);
        if (mask == 0 || mask & ~full != 0) {
            vm.expectRevert(AgentAcademy.InvalidMask.selector);
            academy.completeChapters(BOOK, mask);
        } else {
            academy.completeChapters(BOOK, mask);
            (uint256 m,,) = academy.progressOf(alice, BOOK);
            assertEq(m, mask);
        }
    }
}
