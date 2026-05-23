import express, { Router } from 'express';
import { paymentService } from '../services/paymentService';
import { authenticate } from '../middleware/auth';

const router: Router = express.Router();

// Get pending payments for user
router.get('/user/pending', authenticate, async (req, res) => {
  try {
    const payments = await paymentService.getPendingPayments((req as any).user.id);
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Create payment intent
router.post('/intent', authenticate, async (req, res) => {
  try {
    const { amount } = req.body;
    const clientSecret = await paymentService.createPaymentIntent(amount, (req as any).user.email);
    res.json({ clientSecret });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Complete payment
router.post('/complete', authenticate, async (req, res) => {
  try {
    const { payment_id, stripe_payment_id } = req.body;
    const payment = await paymentService.completePayment(payment_id, stripe_payment_id);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Add sponsor
router.post('/sponsor', async (req, res) => {
  try {
    const { sport_event_id, user_id, name, email, phone, amount_due, is_anonymous } = req.body;
    const sponsor = await paymentService.addSponsor({
      sport_event_id,
      user_id,
      name,
      email,
      phone,
      amount_due,
      is_anonymous,
    });
    res.status(201).json(sponsor);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get event sponsors
router.get('/event/:eventId/sponsors', async (req, res) => {
  try {
    const sponsors = await paymentService.getEventSponsors(req.params.eventId);
    res.json(sponsors);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Complete sponsor payment
router.post('/sponsor/:sponsorId/complete', async (req, res) => {
  try {
    const { stripe_payment_id } = req.body;
    const sponsor = await paymentService.completeSponsorPayment(
      req.params.sponsorId,
      stripe_payment_id
    );
    res.json(sponsor);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
