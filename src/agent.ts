import BigNumber from 'bignumber.js';
import { 
  Finding, 
  HandleTransaction, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType,
  Log
} from 'forta-agent';
import { keccak256 } from 'forta-agent/dist/sdk/utils';
import {
  COMPOUND_GOVERNANCE,
  PROPOSAL_CREATED_EVENT_SIG,
  PROPOSAL_CANCELED_EVENT_SIG,
  PROPOSAL_EXECUTED_EVENT_SIG,
  PROPOSAL_QUEUED_EVENT_SIG,
  AGENT_NAME,
  ALERT_ID,
  AGENT_DESCRIPTIONS,
  VOTE_CAST_EVENT_SIG,
} from './constant';

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  if (txEvent.to !== COMPOUND_GOVERNANCE) return findings;

  const compGovernanceProposalEvents = 
    txEvent
    .filterEvent(PROPOSAL_CREATED_EVENT_SIG, COMPOUND_GOVERNANCE)
    .concat(txEvent.filterEvent(PROPOSAL_CANCELED_EVENT_SIG, COMPOUND_GOVERNANCE))
    .concat(txEvent.filterEvent(PROPOSAL_EXECUTED_EVENT_SIG, COMPOUND_GOVERNANCE))
    .concat(txEvent.filterEvent(PROPOSAL_QUEUED_EVENT_SIG, COMPOUND_GOVERNANCE))
    .concat(txEvent.filterEvent(VOTE_CAST_EVENT_SIG, COMPOUND_GOVERNANCE));
  
  if (!compGovernanceProposalEvents.length) return findings;

  compGovernanceProposalEvents.forEach((log: Log) => {
    const proposalId = `${parseInt(log.data.slice(2, 66), 16)}`;
    if (log.topics[0] === keccak256(VOTE_CAST_EVENT_SIG)) {
      const voter = `0x${log.topics[1].slice(26, 66)}`;
      const support = `${parseInt(log.data.slice(66, 130), 16)}`;
      const votes = (new BigNumber(log.data.slice(130, 194), 16)).toString();

      findings.push(Finding.fromObject({
        name: AGENT_NAME,
        description: `${AGENT_DESCRIPTIONS[log.topics[0]]} - ProposalId ${proposalId}`,
        alertId: ALERT_ID,
        severity: FindingSeverity.Medium,
        type: FindingType.Info,
        metadata: {
          proposalId,
          voter,
          support,
          votes,
        }
      }))
    } else {
      findings.push(Finding.fromObject({
        name: AGENT_NAME,
        description: `${AGENT_DESCRIPTIONS[log.topics[0]]} - ProposalId ${proposalId}`,
        alertId: ALERT_ID,
        severity: FindingSeverity.Medium,
        type: FindingType.Info,
        metadata: {
          proposalId: `${proposalId}`,
        }
      }));
    }
  });
  
  return findings;
}

export default {
  handleTransaction,
}