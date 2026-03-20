import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  const notifications = await Notification
    .find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json(notifications);
};


export const markAsRead = async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    isRead: true
  });

  res.json({ message: "Notification marked as read" });
};


export const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { userId: req.user.id, isRead: false },
    { isRead: true }
  );

  res.json({ message: "All notifications marked as read" });
};

export const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    userId: req.user.id,
    isRead: false
  });

  res.json({ count });
};