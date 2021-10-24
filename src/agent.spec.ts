import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from 'forta-agent';
import { keccak256 } from 'forta-agent/dist/sdk/utils';
import agent from './agent';
import { AGENT_DESCRIPTIONS, AGENT_NAME, ALERT_ID, COMPOUND_GOVERNANCE, PROPOSAL_CREATED_EVENT_SIG, VOTE_CAST_EVENT_SIG } from './constant';

describe('Compound governance agent', () => {
  let handleTransaction: HandleTransaction;

  const createTxEventWithEventSig = (address: string, topics: string[], data: string ) => createTransactionEvent({
    transaction: {
      to: address
    } as any,
    receipt: {
      logs: [
        {
          address,
          topics,
          data,
        }
      ]
    } as any,
    block: {} as any,
  });

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  });

  describe('handleTransaction', () => {
    it('returns empty findings if tx not combine event governance', async () => {
      const txEvent = createTxEventWithEventSig(COMPOUND_GOVERNANCE, ['NotAnEvent'], '');

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it('returns empty findings if tx address not equal compounod governance', async () => {
      const txEvent = createTxEventWithEventSig('0xabcd', [PROPOSAL_CREATED_EVENT_SIG], '');

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    });

    it('returns a finding if tx combine governance proposal event', async () => {
      const txEvent = createTxEventWithEventSig(
        COMPOUND_GOVERNANCE,
        [
          keccak256(PROPOSAL_CREATED_EVENT_SIG)
        ],
        '0x0000000000000000000000000000000000000000000000000000000000000041'
      );

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: AGENT_NAME,
          description: `${AGENT_DESCRIPTIONS[keccak256(PROPOSAL_CREATED_EVENT_SIG)]} - ProposalId 65`,
          alertId: ALERT_ID,
          severity: FindingSeverity.Medium,
          type: FindingType.Info,
          metadata: {
            proposalId: '65'
          }
        }),
      ])
    });

    it('returns a finding if tx combine governance proposal vote cast event', async () => {
      const txEvent = createTxEventWithEventSig(
        COMPOUND_GOVERNANCE,
        [
          keccak256(VOTE_CAST_EVENT_SIG),
          '0x0000000000000000000000006626593c237f530d15ae9980a95ef938ac15c35c',
        ],
        '0x0000000000000000000000000000000000000000000000000000000000000041'
        + '0000000000000000000000000000000000000000000000000000000000000002'
        + '000000000000000000000000000000000000000000001ab2f13462b57b60b679'
      );

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: AGENT_NAME,
          description: `${AGENT_DESCRIPTIONS[keccak256(VOTE_CAST_EVENT_SIG)]} - ProposalId 65`,
          alertId: ALERT_ID,
          severity: FindingSeverity.Medium,
          type: FindingType.Info,
          metadata: {
            proposalId: '65',
            support: "2",
            voter: "0x6626593c237f530d15ae9980a95ef938ac15c35c",
            votes: "1.26082429625124603868793e+23",
          }
        }),
      ])
    });
  });
});

