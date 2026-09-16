// ORDER EVENTS
const emitOrderCreated = (io, order) => {
  io.to("orders").emit("order-created", order);

  io.to("orders").emit("notification", {
    id: `order-created-${order._id}`,
    type: "order",
    title: "New Order",
    message: `${order.orderNumber} was created.`,
  });
};

const emitOrderUpdated = (io, order) => {
  io.to("orders").emit("order-updated", order);

  io.to("orders").emit("notification", {
    id: `order-updated-${order._id}-${order.updatedAt}`,
    type: "order",
    title: "Order Updated",
    message: `${order.orderNumber} was updated.`,
  });
};

const emitOrderDeleted = (io, orderId, orderNumber) => {
  io.to("orders").emit("order-deleted", orderId);

  io.to("orders").emit("notification", {
    id: `order-deleted-${orderId}`,
    type: "order",
    title: "Order Deleted",
    message: `${orderNumber} was deleted.`,
  });
};

// EMPLOYEE EVENTS
const emitEmployeeCreated = (io, employee, actorId) => {
  io.to("employees").emit("employee-created", employee);

  io.to("employees")
    .except(`user:${actorId}`)
    .emit("notification", {
      id: `employee-created-${employee._id}`,
      type: "employee",
      title: "Employee Added",
      message: `${employee.name} was added to the organization.`,
    });
};

const emitEmployeeRoleChanged = (io, employee, oldRole, actorId) => {
  io.to("employees").emit("employee-role-changed", employee);

  io.to("admins")
    .except(`user:${actorId}`)
    .emit("notification", {
      id: `employee-role-${employee._id}-${employee.updatedAt}`,
      type: "employee",
      title: "Role Updated",
      message: `${employee.name}'s role changed from ${oldRole} to ${employee.role}.`,
    });

  io.to(`user:${employee._id}`).emit("user-updated", employee);

  if (employee._id.toString() !== actorId) {
    io.to(`user:${employee._id}`).emit("notification", {
      id: `personal-role-${employee._id}-${employee.updatedAt}`,
      type: "account",
      title: "Role Updated",
      message: `Your role has been changed to ${employee.role}.`,
    });
  }
};

const emitEmployeePermissionsChanged = (io, employee) => {
  io.to("employees").emit("employee-permissions-changed", employee);
  io.to(`user:${employee._id}`).emit("user-updated", employee);
};
const emitEmployeePermissionsNotification = (io, employee, actorId) => {
  io.to("admins")
    .except(`user:${actorId}`)
    .emit("notification", {
      id: `employee-permissions-${employee._id}-${employee.updatedAt}`,
      type: "employee",
      title: "Permissions Updated",
      message: `${employee.name}'s permissions were updated.`,
    });

  if (employee._id.toString() !== actorId) {
    io.to(`user:${employee._id}`).emit("notification", {
      id: `personal-permissions-${employee._id}-${employee.updatedAt}`,
      type: "account",
      title: "Permissions Updated",
      message: "Your permissions have been updated.",
    });
  }
};

// PERMISSION REQUEST EVENTS
const emitPermissionRequestCreated = (io, request, employee) => {
  const requestData = {
    ...request.toObject(),
    employeeId: employee,
  };

  io.to("employees").emit("permission-request-created", requestData);

  io.to("employees")
    .except(`user:${employee._id}`)
    .emit("notification", {
      id: `permission-request-created-${request._id}`,
      type: "permission",
      title: "Permission Request",
      message: `${employee.name} submitted a permission request.`,
    });
};

const emitPermissionRequestApproved = (io, request, employee, actorId) => {
  const requestData = {
    ...request.toObject(),
    employeeId: employee,
  };

  io.to("employees").emit("permission-request-approved", requestData);

  io.to("employees")
    .except(`user:${actorId}`)
    .except(`user:${employee._id}`)
    .emit("notification", {
      id: `permission-request-approved-${request._id}`,
      type: "permission",
      title: "Permission Request Approved",
      message: `${employee.name}'s permission request was approved.`,
    });

  io.to(`user:${employee._id}`).emit("notification", {
    id: `personal-request-approved-${request._id}`,
    type: "permission",
    title: "Permission Request Approved",
    message: "Your permission request was approved.",
  });
};

const emitPermissionRequestRejected = (io, request, employee, actorId) => {
  const requestData = {
    ...request.toObject(),
    employeeId: employee,
  };

  io.to("employees").emit("permission-request-rejected", requestData);

  io.to("employees")
    .except(`user:${actorId}`)
    .except(`user:${employee._id}`)
    .emit("notification", {
      id: `permission-request-rejected-${request._id}`,
      type: "permission",
      title: "Permission Request Rejected",
      message: `${employee.name}'s permission request was rejected.`,
    });

  io.to(`user:${employee._id}`).emit("notification", {
    id: `personal-request-rejected-${request._id}`,
    type: "permission",
    title: "Permission Request Rejected",
    message: "Your permission request was rejected.",
  });
};

module.exports = {
  emitOrderCreated,
  emitOrderUpdated,
  emitOrderDeleted,
  emitEmployeeCreated,
  emitEmployeeRoleChanged,
  emitEmployeePermissionsChanged,
  emitEmployeePermissionsNotification,
  emitPermissionRequestCreated,
  emitPermissionRequestApproved,
  emitPermissionRequestRejected,
};
