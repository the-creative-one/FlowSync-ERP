const emitOrderCreated = (io, order) => {
  io.to("orders").emit("order-created", order);

  io.to("orders").emit("notification", {
    type: "order-created",
    title: "New Order",
    message: `${order.orderNumber} was created.`,
    orderId: order._id,
  });
};

const emitOrderUpdated = (io, order) => {
  io.to("orders").emit("order-updated", order);

  io.to("orders").emit("notification", {
    type: "order-updated",
    title: "Order Updated",
    message: `${order.orderNumber} was updated.`,
    orderId: order._id,
  });
};

const emitOrderDeleted = (io, orderId) => {
  io.to("orders").emit("order-deleted", orderId);

  io.to("orders").emit("notification", {
    type: "order-deleted",
    title: "Order Deleted",
    message: "An order was deleted.",
    orderId,
  });
};

module.exports = {
  emitOrderCreated,
  emitOrderUpdated,
  emitOrderDeleted,
};
