import { keccak256 } from "forta-agent/dist/sdk/utils";

export const COMPOUND_GOVERNANCE = '0xc0da02939e1441f497fd74f78ce7decb17b66529';

export const PROPOSAL_CREATED_EVENT_SIG = 'ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],uint256,uint256,string)';

export const PROPOSAL_CANCELED_EVENT_SIG = 'ProposalCanceled(uint256)';

export const PROPOSAL_EXECUTED_EVENT_SIG = 'ProposalExecuted(uint256)';

export const PROPOSAL_QUEUED_EVENT_SIG = 'ProposalQueued(uint256,uint256)';

export const VOTE_CAST_EVENT_SIG = 'VoteCast(address,uint256,uint8,uint256,string)';

export const ALERT_ID = 'COMPOUND-4';

export const AGENT_NAME = 'Compound governance';

export const AGENT_DESCRIPTIONS = {
  [keccak256(PROPOSAL_CREATED_EVENT_SIG)]: 'Proposal created',
  [keccak256(PROPOSAL_CANCELED_EVENT_SIG)]: 'Proposal canceled',
  [keccak256(PROPOSAL_EXECUTED_EVENT_SIG)]: 'Proposal executed',
  [keccak256(PROPOSAL_QUEUED_EVENT_SIG)]: 'Proposal queued',
  [keccak256(VOTE_CAST_EVENT_SIG)]: 'Vote cast',
}
