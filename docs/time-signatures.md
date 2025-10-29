# Bitcoin Time Controls Overview

Understanding Bitcoin's time-based constraints is crucial when building a client that must evaluate whether transactions are valid for inclusion in a block or the mempool. Time enforcement in Bitcoin spans multiple layers, from block headers to transaction-level scripts. This document summarizes the key mechanisms and terminology you will encounter while examining time signatures.

## Block Header Timestamp (`nTime`)
- **Purpose:** Indicates when the miner claims to have created the block. Full nodes treat this value as advisory, but it must satisfy consensus rules:
  - It must be greater than the median time past (MTP) of the previous 11 blocks.
  - It must be less than the network-adjusted time plus two hours.
- **Implication for clients:** Nodes use `nTime` to maintain an approximate network clock. When verifying blocks, your client must compute the MTP and enforce both limits before accepting the block.

## Transaction Locktime (`nLockTime`)
- **Definition:** A 4-byte field that specifies the earliest time or block height when the transaction can be added to the blockchain.
- **Encoding rules:**
  - Values below `500000000` are interpreted as block heights.
  - Values equal to or above `500000000` are interpreted as UNIX epoch seconds.
- **Sequence interaction:** A transaction must have at least one input with `nSequence` < `0xffffffff` for `nLockTime` to have any effect. Otherwise, it is considered final regardless of the locktime value.
- **Client responsibility:** Wallets and nodes must compare `nLockTime` to the current chain height or network time (rounded down to the nearest second) to decide whether to relay or mine the transaction.

## Relative Timelocks (`nSequence`, BIP 68/112/113)
- **`nSequence`:** Originally introduced for transaction replacement, sequence numbers now express relative timelocks when used with BIP 68.
- **BIP 68 semantics:**
  - If bit 31 of the sequence number is unset, the lower 16 bits encode a relative delay.
  - Bit 22 selects the unit: blocks (0) or 512-second intervals (1).
- **Script-level enforcement:**
  - `OP_CHECKSEQUENCEVERIFY` (CSV, BIP 112) enforces the relative delay inside scripts.
  - `OP_CHECKLOCKTIMEVERIFY` (CLTV, BIP 65) enforces absolute timelocks using locktime data.
- **Consensus details:** BIP 113 mandates the use of MTP instead of the node’s local clock when evaluating locktimes and timelocks, providing consistency under clock skew.

## Practical Considerations for a Bitcoin Client

![Data flow between a wallet application, thin client node, peer-to-peer network, and the Bitcoin Core blockchain.](assets/btc-thin-client-architecture.svg)
- Maintain both best-known block height and the MTP of the tip to evaluate incoming transactions.
- Track per-input sequence numbers to determine whether relative timelocks apply.
- Use network-adjusted time (median of peer-reported times, limited to 70 minutes skew) rather than the local system clock when comparing UNIX-based locktimes.
- Provide informative validation errors so downstream components (wallet UI, RPC callers) know whether a transaction is simply premature or invalid for other reasons.

## Next Steps
- Implement parsers for block headers and transactions that expose `nTime`, `nLockTime`, and `nSequence` in strongly typed structures.
- Add consensus checks that validate absolute and relative timelocks before accepting transactions into the mempool.
- Extend the scripting engine to support CSV and CLTV opcodes, ensuring error messages reference the relevant timelock condition.

This overview should ground the upcoming work on Bitcoin transaction handling in the broader context of consensus-critical time rules. As the client evolves, revisit these notes to confirm the implementation matches the protocol constraints.
