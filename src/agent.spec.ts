import {
  FindingType,
  FindingSeverity,
  Finding,
  HandleTransaction,
  createTransactionEvent
} from 'forta-agent'
import { keccak256 } from 'forta-agent/dist/sdk/utils';
import agent from './agent'
import { AGENT_DESCRIPTIONS, AGENT_NAME, ALERT_ID, COMPOUND_GOVERNANCE, PROPOSAL_CREATED_EVENT_SIG } from './constant';

describe('Compound governance agent', () => {
  let handleTransaction: HandleTransaction;

  const createTxEventWithEventSig = (event: string, address: string) => createTransactionEvent({
    transaction: {
      to: address
    } as any,
    receipt: {
      logs: [
        {
          address,
          topics: [
            keccak256(event)
          ],
          data: '0x0000000000000000000000000000000000000000000000000000000000000041'
        }
      ]
    } as any,
    block: {} as any,
  })

  beforeAll(() => {
    handleTransaction = agent.handleTransaction
  })

  describe('handleTransaction', () => {
    it('returns empty findings if tx not combine event governance', async () => {
      const txEvent = createTxEventWithEventSig('NotAnEvent', COMPOUND_GOVERNANCE);

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    })

    it('returns empty findings if tx address not equal compounod governance', async () => {
      const txEvent = createTxEventWithEventSig(PROPOSAL_CREATED_EVENT_SIG, '0xabcd');

      const findings = await handleTransaction(txEvent);

      expect(findings).toStrictEqual([]);
    })

    it('returns a finding if tx combine governance event', async () => {
      const txEvent = createTxEventWithEventSig(PROPOSAL_CREATED_EVENT_SIG, COMPOUND_GOVERNANCE);

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
    })
  })
})
