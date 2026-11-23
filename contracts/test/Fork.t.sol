// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {AgentAcademy} from "../src/AgentAcademy.sol";

/// Runs against BSC mainnet state: `BSC_RPC=<url> forge test --match-contract Fork`. Skipped without BSC_RPC.
contract ForkTest is Test {
    address internal constant AGENT_ID = 0x60B9262456dE011F7d15a54CdD8c48bAaa8B022F;
    address internal constant HOLDER = 0xe0a34AC1da06423e1e67345828bd629dFAbd4Ca2; // 0xhieu.ai
    AgentAcademy internal academy;

    function setUp() public {
        string memory rpc = vm.envOr("BSC_RPC", string(""));
        if (bytes(rpc).length == 0) vm.skip(true);
        vm.createSelectFork(rpc);
        academy = new AgentAcademy(AGENT_ID, address(this));
        academy.createBook(900, 1);
    }

    function test_RealHolderRecordsAndGetsCertificate() public {
        vm.prank(HOLDER);
        academy.completeChapters(900, 1);
        (, uint16 count, bool certified) = academy.progressOf(HOLDER, 900);
        assertEq(count, 1);
        assertTrue(certified);
    }

    function test_NonHolderReverts() public {
        vm.prank(makeAddr("not-a-holder"));
        vm.expectRevert(AgentAcademy.NoAgentId.selector);
        academy.completeChapters(900, 1);
    }
}
