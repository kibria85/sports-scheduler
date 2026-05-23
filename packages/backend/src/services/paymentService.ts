import pool from '../config/database';
import { Payment, Sponsor } from '../types/models';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export class PaymentService {
  async createPayment(paymentData: Partial<Payment>): Promise<Payment> {
    const { user_id, event_id, amount, payment_method, status = 'pending' } = paymentData;

    if (!amount) throw new Error('Amount is required');

    const result = await pool.query(
      `INSERT INTO payments (user_id, event_id, amount, payment_method, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, event_id, amount, payment_method, status]
    );

    return result.rows[0];
  }

  async createPaymentIntent(amount: number, email: string): Promise<string> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      receipt_email: email,
    });

    return paymentIntent.client_secret || '';
  }

  async completePayment(paymentId: string, stripePaymentId: string): Promise<Payment> {
    const result = await pool.query(
      `UPDATE payments
       SET status = 'completed', stripe_payment_id = $1, paid_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [stripePaymentId, paymentId]
    );

    if (!result.rows[0]) throw new Error('Payment not found');
    return result.rows[0];
  }

  async getPendingPayments(userId: string): Promise<Payment[]> {
    const result = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 AND status = $2',
      [userId, 'pending']
    );
    return result.rows;
  }

  async addSponsor(sponsorData: Partial<Sponsor>): Promise<Sponsor> {
    const { sport_event_id, user_id, name, email, phone, amount_due, is_anonymous } = sponsorData;

    if (!sport_event_id || !amount_due) throw new Error('Missing required fields');

    const result = await pool.query(
      `INSERT INTO sponsors (sport_event_id, user_id, name, email, phone, amount_due, is_anonymous)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [sport_event_id, user_id, name, email, phone, amount_due, is_anonymous || false]
    );

    return result.rows[0];
  }

  async getEventSponsors(eventId: string): Promise<Sponsor[]> {
    const result = await pool.query(
      'SELECT * FROM sponsors WHERE sport_event_id = $1',
      [eventId]
    );
    return result.rows;
  }

  async completeSponsorPayment(sponsorId: string, stripePaymentId: string): Promise<Sponsor> {
    const result = await pool.query(
      `UPDATE sponsors
       SET payment_status = 'done'
       WHERE id = $1
       RETURNING *`,
      [sponsorId]
    );

    if (!result.rows[0]) throw new Error('Sponsor not found');
    return result.rows[0];
  }
}

export const paymentService = new PaymentService();
