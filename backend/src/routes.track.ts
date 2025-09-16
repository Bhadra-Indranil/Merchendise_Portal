import { Router } from 'express';
import { Order } from './models/Order';
import { authenticate } from './middleware/auth';

const router = Router();

router.get('/:id/track', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // @ts-ignore
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // For now, just return the tracking fields from the order.
    // Later, we can add more logic here to build the tracking history.
    const trackingInfo = {
      trackingId: order.trackingId,
      estimatedDelivery: order.estimatedDelivery,
      deliveryStatus: order.deliveryStatus,
      statusHistory: order.statusHistory,
    };

    return res.json(trackingInfo);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
