Please add me as a Agent Developer [Published] on Discord, my username is Milkbean#1186
# Compound Governace Proposal Agent

## Description

This agent alert when compound governance propsal has action

## Supported Chains

- Ethereum

## Alerts

- COMPOUND-4
  - Fired when a transaction has event from compound governance proposal
  - Severity is "medium"
  - Type is "info"
  - Metadata: proposalId

## Test Data

- 0xf7dee3a39b6620f2ef265f23ee46dd8944a955e3f369e8a42244760b7094a256

```js
{
  "name": "Compound governance",
  "description": "Proposal executed - ProposalId 65",
  "alertId": "COMPOUND-4",
  "protocol": "ethereum",
  "severity": "Medium",
  "type": "Info",
  "metadata": {
    "proposalId": "65"
  }
}
```