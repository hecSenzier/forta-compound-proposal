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

- 0x5852a29fcb7b5fcc52bfb19235a2ad87687e6b16478b742054163e8b9c490e62

```js
{
  "name": "Compound governance",
  "description": "Vote cast - ProposalId 65",
  "alertId": "COMPOUND-4",
  "protocol": "ethereum",
  "severity": "Medium",
  "type": "Info",
  "metadata": {
    "proposalId": "65",
    "support": "2",
    "voter": "0x6626593c237f530d15ae9980a95ef938ac15c35c",
    "votes": "1.26082429625124603868793e+23"
  }
}
```

## Agent Id

Agent Id
```
0xc2e9bd153a531de86c6b2b4b2e17267178ee3d3b3298db63928ce458d8dd2f11
```