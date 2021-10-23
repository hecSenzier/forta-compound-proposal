import { 
  Finding, 
  HandleTransaction, 
  TransactionEvent, 
  FindingSeverity, 
  FindingType,
  Log
} from 'forta-agent';
import {
  COMPOUND_GOVERNANCE,
  PROPOSAL_CREATED_EVENT_SIG,
  PROPOSAL_CANCELED_EVENT_SIG,
  PROPOSAL_EXECUTED_EVENT_SIG,
  PROPOSAL_QUEUED_EVENT_SIG,
  AGENT_NAME,
  ALERT_ID,
  AGENT_DESCRIPTIONS,
} from './constant';

const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
  const findings: Finding[] = [];

  if (txEvent.to !== COMPOUND_GOVERNANCE) return findings;

  const compGovernanceProposalEvents = 
    txEvent
    .filterEvent(PROPOSAL_CREATED_EVENT_SIG, COMPOUND_GOVERNANCE)
    .concat(txEvent.filterEvent(PROPOSAL_CANCELED_EVENT_SIG, COMPOUND_GOVERNANCE))
    .concat(txEvent.filterEvent(PROPOSAL_EXECUTED_EVENT_SIG, COMPOUND_GOVERNANCE))
    .concat(txEvent.filterEvent(PROPOSAL_QUEUED_EVENT_SIG, COMPOUND_GOVERNANCE));
  
  if (!compGovernanceProposalEvents.length) return findings;

  compGovernanceProposalEvents.forEach((log: Log) => {
    const proposalIdHex = log.data.slice(2, 66);
    const proposalId = parseInt(proposalIdHex, 16);
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
  });
  
  return findings;
}

export default {
  handleTransaction,
}