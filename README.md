# PaySignal

A decentralized prediction market platform that empowers communities to evaluate borrower creditworthiness and repayment risk — replacing opaque credit bureaus with transparent, crowd-powered signals on-chain.

---

## Overview

PaySignal consists of ten core smart contracts that together form a transparent, incentive-driven prediction market protocol for assessing repayment risk and building open credit reputations:

1. **Borrower Registry Contract** – Stores borrower identities and loan metadata.
2. **Prediction Market Factory Contract** – Creates borrower-specific prediction markets.
3. **Credit Prediction Market Contract** – Manages staking, outcomes, and market resolution.
4. **Reputation Token Contract** – Issues accuracy-based tokens to predictors.
5. **Staking Contract** – Handles stake deposits, slashing, and reward distribution.
6. **Oracle Adapter Contract** – Connects with off-chain repayment data or lending APIs.
7. **Governance DAO Contract** – Enables protocol governance by token holders.
8. **Dispute Resolution Contract** – Arbitrates disputes in market outcomes.
9. **Verifier Registry Contract** – Maintains a list of trusted oracles and verifiers.
10. **Protocol Fees Contract** – Manages fees and treasury routing.

---

## Features

- **Crowdsourced borrower risk prediction** using staked tokens  
- **Decentralized credit reputation system** based on real-time forecasts  
- **On-chain incentives** for accurate predictors  
- **Modular prediction markets** per borrower or loan instance  
- **Oracle integration** for loan outcome verification  
- **Dispute resolution layer** for integrity and trust  
- **Governance control** over protocol rules and verifiers  
- **Open borrower identity registry**  
- **Staking mechanisms** for signal reliability  
- **Fee routing and sustainability mechanisms**

---

## Smart Contracts

### Borrower Registry Contract
- Register borrower addresses with loan metadata
- Associate repayment terms and reference IDs
- Track borrower participation history

### Prediction Market Factory Contract
- Deploy new prediction markets per borrower or loan event
- Track active and resolved markets
- Enforce market creation rules

### Credit Prediction Market Contract
- Allow users to stake on repayment outcomes
- Distribute rewards or penalties based on oracle result
- Handle market lifecycle and participation logic

### Reputation Token Contract
- Mint tokens based on predictor accuracy
- Serve as governance and credibility weight
- Burn on dispute loss or manipulation

### Staking Contract
- Accept and escrow predictor stakes
- Slash incorrect predictions
- Distribute proportional rewards to accurate predictors

### Oracle Adapter Contract
- Pull borrower repayment status from external sources
- Interface with verified lending platforms or databases
- Secure settlement data to smart contracts

### Governance DAO Contract
- Submit and vote on proposals (e.g., fee changes, oracle updates)
- Control dispute logic and market parameters
- Enforce quorum and delay periods

### Dispute Resolution Contract
- Raise and resolve disputes in prediction outcomes
- Community jury or DAO voting model
- Slash fraudulent actors and refund affected users

### Verifier Registry Contract
- Register and manage approved oracle data providers
- Assign weights to trusted oracles
- Allow DAO-based onboarding/removal

### Protocol Fees Contract
- Manage staking fees and treasury routing
- Fund oracle calls, disputes, and governance
- Support long-term protocol sustainability

---

## Installation

1. Install [Clarinet CLI](https://docs.hiro.so/clarinet/getting-started)
2. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/paysignal.git
   ```
3. Run tests:
    ```bash
    npm test
    ```
4. Deploy contracts:
    ```bash
    clarinet deploy
    ```

---

## Usage

Each smart contract operates independently but integrates seamlessly for full protocol utility.
Refer to individual contract files and test suites for available functions, usage parameters, and integration flows.

---

## License

MIT License