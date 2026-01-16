import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import type { TransactionStatus } from '@prisma/client';

// Initialize Stripe client - uses library's default API version
const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

export interface PaymentIntentResult {
    success: boolean;
    clientSecret?: string;
    paymentIntentId?: string;
    transactionId?: string;
    error?: string;
}

export interface PaymentVerificationResult {
    success: boolean;
    status: TransactionStatus;
    amount?: number;
    error?: string;
}

export interface InitiatePaymentOptions {
    amount: number; // Amount in TRY (will be converted to kuruş for Stripe)
    userId: string;
    policyId?: string;
    description?: string;
    metadata?: Record<string, string>;
}

/**
 * Check if payment service is configured
 */
export function isPaymentConfigured(): boolean {
    return !!stripe;
}

/**
 * Initiate a payment with Stripe PaymentIntent
 * Creates a Transaction record in PENDING status
 */
export async function initiatePayment(options: InitiatePaymentOptions): Promise<PaymentIntentResult> {
    if (!stripe) {
        console.warn('[Payment Service] Stripe not configured');
        return { success: false, error: 'Payment service not configured' };
    }

    try {
        // Convert TRY to kuruş (Stripe uses smallest currency unit)
        const amountInKurus = Math.round(options.amount * 100);

        // Create Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInKurus,
            currency: 'try',
            description: options.description || 'Waypla Koruma Planı',
            metadata: {
                userId: options.userId,
                policyId: options.policyId || '',
                ...options.metadata,
            },
        });

        // Create Transaction record
        const transaction = await prisma.transaction.create({
            data: {
                userId: options.userId,
                policyId: options.policyId || null,
                amount: options.amount,
                currency: 'TRY',
                status: 'PENDING',
                provider: 'stripe',
                providerTxId: paymentIntent.id,
                metadata: {
                    description: options.description,
                    ...options.metadata,
                },
            },
        });

        console.info('[Payment Service] Payment initiated:', {
            transactionId: transaction.id,
            paymentIntentId: paymentIntent.id,
            amount: options.amount,
        });

        return {
            success: true,
            clientSecret: paymentIntent.client_secret!,
            paymentIntentId: paymentIntent.id,
            transactionId: transaction.id,
        };
    } catch (err) {
        console.error('[Payment Service] Initiate payment error:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Payment initiation failed',
        };
    }
}

/**
 * Verify a payment status by PaymentIntent ID
 */
export async function verifyPayment(paymentIntentId: string): Promise<PaymentVerificationResult> {
    if (!stripe) {
        return { success: false, status: 'FAILED', error: 'Payment service not configured' };
    }

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        // Map Stripe status to our TransactionStatus
        let status: TransactionStatus;
        switch (paymentIntent.status) {
            case 'succeeded':
                status = 'SUCCESS';
                break;
            case 'processing':
            case 'requires_action':
            case 'requires_confirmation':
            case 'requires_payment_method':
                status = 'PENDING';
                break;
            case 'canceled':
            default:
                status = 'FAILED';
        }

        // Update transaction record
        const transaction = await prisma.transaction.findFirst({
            where: { providerTxId: paymentIntentId },
        });

        if (transaction && transaction.status !== status) {
            await prisma.transaction.update({
                where: { id: transaction.id },
                data: { status },
            });
            console.info('[Payment Service] Transaction status updated:', { id: transaction.id, status });
        }

        return {
            success: status === 'SUCCESS',
            status,
            amount: paymentIntent.amount / 100, // Convert back to TRY
        };
    } catch (err) {
        console.error('[Payment Service] Verify payment error:', err);
        return {
            success: false,
            status: 'FAILED',
            error: err instanceof Error ? err.message : 'Payment verification failed',
        };
    }
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhook(
    payload: string | Buffer,
    signature: string
): Promise<{ success: boolean; eventType?: string; error?: string }> {
    if (!stripe) {
        return { success: false, error: 'Payment service not configured' };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        return { success: false, error: 'Webhook secret not configured' };
    }

    try {
        const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);

        console.info('[Payment Service] Webhook received:', event.type);

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await updateTransactionStatus(paymentIntent.id, 'SUCCESS');

                // If there's a policy, activate it
                if (paymentIntent.metadata.policyId) {
                    await prisma.policy.update({
                        where: { id: paymentIntent.metadata.policyId },
                        data: { status: 'ACTIVE' },
                    });
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await updateTransactionStatus(paymentIntent.id, 'FAILED');
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge;
                if (charge.payment_intent) {
                    await updateTransactionStatus(charge.payment_intent as string, 'REFUNDED');
                }
                break;
            }

            default:
                console.info('[Payment Service] Unhandled event type:', event.type);
        }

        return { success: true, eventType: event.type };
    } catch (err) {
        console.error('[Payment Service] Webhook error:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Webhook processing failed',
        };
    }
}

/**
 * Helper to update transaction status
 */
async function updateTransactionStatus(providerTxId: string, status: TransactionStatus): Promise<void> {
    try {
        await prisma.transaction.updateMany({
            where: { providerTxId },
            data: { status },
        });
        console.info('[Payment Service] Transaction updated:', { providerTxId, status });
    } catch (err) {
        console.error('[Payment Service] Failed to update transaction:', err);
    }
}

/**
 * Create a refund for a transaction
 */
export async function refundPayment(
    paymentIntentId: string,
    amount?: number // Partial refund amount in TRY, omit for full refund
): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!stripe) {
        return { success: false, error: 'Payment service not configured' };
    }

    try {
        const refundParams: Stripe.RefundCreateParams = {
            payment_intent: paymentIntentId,
        };

        if (amount !== undefined) {
            refundParams.amount = Math.round(amount * 100);
        }

        const refund = await stripe.refunds.create(refundParams);

        // Update transaction status
        await updateTransactionStatus(paymentIntentId, 'REFUNDED');

        console.info('[Payment Service] Refund created:', refund.id);

        return { success: true, refundId: refund.id };
    } catch (err) {
        console.error('[Payment Service] Refund error:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Refund failed',
        };
    }
}
