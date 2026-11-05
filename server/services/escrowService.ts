import { dbStore, EscrowState, EscrowTransactionRecord } from '../data/store.js';

export class EscrowService {
  /**
   * Allowed state transitions
   */
  private static allowedTransitions: Record<EscrowState, EscrowState[]> = {
    CREATED: ['PENDING', 'AUTHORIZED', 'CANCELLED'],
    PENDING: ['AUTHORIZED', 'CANCELLED'],
    AUTHORIZED: ['LOCKED', 'CANCELLED'],
    LOCKED: ['RELEASE_REQUESTED', 'RELEASED', 'REFUNDED', 'DISPUTED'],
    RELEASE_REQUESTED: ['RELEASED', 'LOCKED', 'DISPUTED'],
    RELEASED: [], // Terminal success
    CANCELLED: [], // Terminal cancelled
    REFUNDED: [], // Terminal refunded
    DISPUTED: ['RELEASED', 'REFUNDED', 'LOCKED'],
  };

  /**
   * Generate an auditable transaction reference
   */
  public static generateReference(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `TX-SIM-${random}-TB`;
  }

  /**
   * Initialize a new escrow payment for a milestone
   */
  public static initializePayment(params: {
    projectId: string;
    milestoneId: string;
    clientId: string;
  }): { success: boolean; transaction?: EscrowTransactionRecord; error?: string } {
    const { projectId, milestoneId, clientId } = params;

    // 1. Validate project exists and client owns it
    const project = dbStore.projects.find((p) => p.id === projectId);
    if (!project) {
      return { success: false, error: 'Project not found' };
    }
    if (project.client_id !== clientId) {
      return { success: false, error: 'Unauthorized: Only the project client can initiate payments' };
    }

    // 2. Validate milestone exists and belongs to project
    const milestone = dbStore.milestones.find((m) => m.id === milestoneId && m.project_id === projectId);
    if (!milestone) {
      return { success: false, error: 'Milestone not found for this project' };
    }

    // 3. Prevent duplicate payment requests for an already locked/released milestone
    const existingTx = dbStore.escrow_transactions.find(
      (tx) => tx.milestone_id === milestoneId && ['LOCKED', 'RELEASE_REQUESTED', 'RELEASED'].includes(tx.status)
    );
    if (existingTx) {
      return {
        success: false,
        error: `Milestone already has an active or completed escrow transaction (${existingTx.status}) with reference ${existingTx.transaction_reference}`,
      };
    }

    // 4. Create new transaction with status CREATED
    const newTx: EscrowTransactionRecord = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      project_id: projectId,
      milestone_id: milestoneId,
      client_id: clientId,
      freelancer_id: project.freelancer_id,
      amount: milestone.amount, // Always trust milestone amount from backend, never frontend
      currency: 'USD',
      transaction_reference: this.generateReference(),
      status: 'CREATED',
      payment_method: 'SANDBOX_ESCROW',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dbStore.escrow_transactions.push(newTx);

    return { success: true, transaction: newTx };
  }

  /**
   * Lock funds in escrow (Simulates authorization and deposit)
   */
  public static lockPayment(params: {
    transactionId: string;
    clientId: string;
  }): { success: boolean; transaction?: EscrowTransactionRecord; error?: string } {
    const { transactionId, clientId } = params;

    const tx = dbStore.escrow_transactions.find((t) => t.id === transactionId);
    if (!tx) {
      return { success: false, error: 'Transaction not found' };
    }

    // Client verification
    if (tx.client_id !== clientId) {
      return { success: false, error: 'Unauthorized: Cannot lock payment for another client project' };
    }

    // State transition check (CREATED or PENDING -> AUTHORIZED -> LOCKED)
    if (tx.status !== 'CREATED' && tx.status !== 'AUTHORIZED') {
      return {
        success: false,
        error: `Invalid state transition: Cannot lock transaction in status ${tx.status}`,
      };
    }

    // Check client simulated balance
    const client = dbStore.profiles.find((p) => p.id === clientId);
    if (client && client.simulated_balance < tx.amount) {
      return {
        success: false,
        error: `Insufficient simulated client balance ($${client.simulated_balance} available, $${tx.amount} required)`,
      };
    }

    // Deduct from client simulated balance into locked escrow
    if (client) {
      client.simulated_balance = Math.max(0, client.simulated_balance - tx.amount);
    }

    // Update status to LOCKED
    tx.status = 'LOCKED';
    tx.updated_at = new Date().toISOString();

    // Update milestone status to escrow_funded
    const milestone = dbStore.milestones.find((m) => m.id === tx.milestone_id);
    if (milestone) {
      milestone.status = 'escrow_funded';
    }

    // Audit notification
    dbStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: tx.freelancer_id,
      title: `Escrow Secured ($${tx.amount})`,
      description: `Client funded milestone in escrow. Ref: ${tx.transaction_reference}. You can begin work safely.`,
      notification_type: 'escrow',
      is_read: false,
      link_tab: 'milestones',
      link_resource_id: tx.project_id,
      created_at: new Date().toISOString(),
    });

    return { success: true, transaction: tx };
  }

  /**
   * Freelancer submits deliverable and requests release
   */
  public static requestMilestoneRelease(params: {
    milestoneId: string;
    freelancerId: string;
    deliverableNotes?: string;
  }): { success: boolean; transaction?: EscrowTransactionRecord; error?: string } {
    const { milestoneId, freelancerId, deliverableNotes } = params;

    const milestone = dbStore.milestones.find((m) => m.id === milestoneId);
    if (!milestone) {
      return { success: false, error: 'Milestone not found' };
    }

    const project = dbStore.projects.find((p) => p.id === milestone.project_id);
    if (!project || project.freelancer_id !== freelancerId) {
      return { success: false, error: 'Unauthorized: Only the assigned freelancer can submit deliverables' };
    }

    // Find the escrow transaction
    const tx = dbStore.escrow_transactions.find(
      (t) => t.milestone_id === milestoneId && t.status === 'LOCKED'
    );
    if (!tx) {
      return { success: false, error: 'Cannot request release: Funds are not currently LOCKED in escrow' };
    }

    // Update transaction to RELEASE_REQUESTED
    tx.status = 'RELEASE_REQUESTED';
    tx.updated_at = new Date().toISOString();

    // Update milestone to in_review
    milestone.status = 'in_review';
    milestone.deliverable_notes = deliverableNotes || 'Work completed and submitted for client review.';
    milestone.submitted_at = new Date().toISOString();

    // Notify client
    dbStore.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: tx.client_id,
      title: `Deliverable Submitted for Review`,
      description: `Freelancer submitted work for "${milestone.title}". Please review deliverables and authorize release.`,
      notification_type: 'milestone',
      is_read: false,
      link_tab: 'milestones',
      link_resource_id: tx.project_id,
      created_at: new Date().toISOString(),
    });

    return { success: true, transaction: tx };
  }

  /**
   * Client reviews and releases escrow funds to freelancer
   */
  public static releasePayment(params: {
    transactionId: string;
    clientId: string;
  }): { success: boolean; transaction?: EscrowTransactionRecord; error?: string } {
    const { transactionId, clientId } = params;

    const tx = dbStore.escrow_transactions.find((t) => t.id === transactionId);
    if (!tx) {
      return { success: false, error: 'Transaction not found' };
    }

    // Rule: Client cannot release funds for another client's project
    if (tx.client_id !== clientId) {
      return { success: false, error: 'Unauthorized: You are not authorized to release funds for this project' };
    }

    // Rule: Freelancer cannot approve their own milestone (handled by clientId != freelancer_id check)
    if (clientId === tx.freelancer_id) {
      return { success: false, error: 'Forbidden: Freelancers cannot approve their own payments' };
    }

    // Rule: A payment cannot be released before it is locked
    if (tx.status !== 'LOCKED' && tx.status !== 'RELEASE_REQUESTED') {
      return {
        success: false,
        error: `Cannot release funds: Transaction status is ${tx.status}. Must be LOCKED or RELEASE_REQUESTED.`,
      };
    }

    // Rule: A milestone cannot be approved twice
    const milestone = dbStore.milestones.find((m) => m.id === tx.milestone_id);
    if (milestone && milestone.status === 'released') {
      return { success: false, error: 'Milestone is already approved and released' };
    }

    // Transition state
    tx.status = 'RELEASED';
    tx.updated_at = new Date().toISOString();

    // Update milestone
    if (milestone) {
      milestone.status = 'released';
      milestone.approved_at = new Date().toISOString();
    }

    // Atomic Balance Credit: Credit freelancer's simulated balance
    const freelancer = dbStore.profiles.find((p) => p.id === tx.freelancer_id);
    if (freelancer) {
      freelancer.simulated_balance = (freelancer.simulated_balance || 0) + tx.amount;
    }

    // Notify both parties
    dbStore.notifications.unshift({
      id: `notif-${Date.now()}-f`,
      user_id: tx.freelancer_id,
      title: `🎉 Payment Released: $${tx.amount}`,
      description: `Client approved deliverable. $${tx.amount} released to your simulated wallet. Ref: ${tx.transaction_reference}`,
      notification_type: 'milestone',
      is_read: false,
      link_tab: 'milestones',
      link_resource_id: tx.project_id,
      created_at: new Date().toISOString(),
    });

    dbStore.notifications.unshift({
      id: `notif-${Date.now()}-c`,
      user_id: tx.client_id,
      title: `Milestone Payment Authorized`,
      description: `You successfully released $${tx.amount} to freelancer for "${milestone?.title || 'Deliverable'}".`,
      notification_type: 'milestone',
      is_read: false,
      link_tab: 'milestones',
      link_resource_id: tx.project_id,
      created_at: new Date().toISOString(),
    });

    return { success: true, transaction: tx };
  }

  /**
   * Get transaction history for user or project
   */
  public static getHistory(filters?: {
    userId?: string;
    projectId?: string;
    role?: string;
  }): EscrowTransactionRecord[] {
    let results = [...dbStore.escrow_transactions];

    if (filters?.projectId) {
      results = results.filter((tx) => tx.project_id === filters.projectId);
    }

    if (filters?.userId) {
      if (filters.role === 'client') {
        results = results.filter((tx) => tx.client_id === filters.userId);
      } else if (filters.role === 'freelancer') {
        results = results.filter((tx) => tx.freelancer_id === filters.userId);
      } else {
        results = results.filter(
          (tx) => tx.client_id === filters.userId || tx.freelancer_id === filters.userId
        );
      }
    }

    return results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
}
