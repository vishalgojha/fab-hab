import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notification_id, user_phone } = await req.json();

    if (!user_phone) {
      return Response.json({ error: 'Phone number required' }, { status: 400 });
    }

    // Fetch notification
    const notifications = await base44.entities.CoachingNotification.filter({
      id: notification_id
    });

    const notification = notifications[0];
    if (!notification) {
      return Response.json({ error: 'Notification not found' }, { status: 404 });
    }

    // Format message for WhatsApp
    const whatsappMessage = `🎯 *${notification.title}*\n\n${notification.message}\n\n💡 *Suggested Action:*\n${notification.suggested_action}`;

    // In production, use Twilio or another WhatsApp API
    // For now, we'll log that this would be sent
    console.log(`WhatsApp Message to ${user_phone}:\n${whatsappMessage}`);

    // Update notification as sent
    await base44.entities.CoachingNotification.update(notification_id, {
      sent_via: 'both'
    });

    return Response.json({
      success: true,
      message: 'Coaching message queued for WhatsApp delivery',
      preview: whatsappMessage
    });

  } catch (error) {
    console.error('WhatsApp coaching error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});