const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const permissionLabels = {
  canCreateOrders: "Create orders",
  canUpdateOrders: "Update orders",
  canDeleteOrders: "Delete orders",
  canManageEmployees: "Manage employees",
  canViewAdvancedAnalytics: "View advanced analytics",
  canExportReports: "Export reports",
  canAccessSettings: "Access system settings",
};

const flowSyncKnowledge = `
You are the FlowSync Assistant.

FlowSync is a MERN-based ERP application.

CURRENTLY AVAILABLE FEATURES:

1. Authentication
- User registration and login.
- Protected application access.
- Password management.

2. Role-Based Access Control
- Roles: Admin, Manager, Operations, Analyst, Employee.
- Access is controlled using permissions.
- Admin has full access.
- Other users can only perform actions allowed by their permissions.

3. Employee Management
- View employees.
- Create users.
- Update employee roles.
- Update employee permissions.
- Permission requests.
- Admin can delete users.
- A user cannot delete their own account.

4. Orders
- Create orders when the user has permission.
- View orders.
- Update orders when permitted.
- Delete orders when permitted.
- Search, sorting and pagination are available.
- Order statuses follow:
  Pending -> Processing -> Shipped -> Delivered.

5. Analytics
- Dashboard analytics.
- Order and business performance information.
- Advanced analytics require the appropriate permission.

6. Activity Logs
- Tracks system activity and user actions.
- Activity Logs are available to authorized users.

7. Profile
- Users can view and update their own profile information.
- Users can view their currently assigned permissions.
- Users can request additional access from their Profile.
- Permission requests are reviewed by an authorized Manager or Admin.
- Approved permissions update the user's available access.
- The onboarding guide explains this access and permission process to new users.

8. Onboarding & Getting Started
- New users start with basic access by design.
- Users should first explore their available features and open their Profile to review their permissions.
- If a user needs additional access, they can request it from the Request Additional Access section in their Profile.
- The request must be reviewed and approved by an authorized Manager or Admin.
- Until approval, the requested feature remains unavailable.
- Once approved, the user's permissions are updated and the corresponding feature becomes available.
- The onboarding guide helps users understand this process when they first enter FlowSync.
- The onboarding guide can be skipped or completed.
- The FlowSync Assistant can explain the onboarding and permission process when users need help.

9. Settings
- Users can access settings when permitted.
- Only Admin can update system settings.

10. Report Exports
- Supported reports and data can be exported when the user has export permission.

11. Real-Time Updates
- FlowSync uses real-time updates so supported changes can appear without manually refreshing.

IMPORTANT RULES:

- Only describe features listed above as currently available.
- Do not invent modules, pages, buttons, fields, routes, database fields, or workflows.
- Payroll, Finance, CRM, Procurement, Inventory/Warehouse management and similar modules are not currently available.
- If the user asks about something that is not currently implemented, clearly say that it is not currently available.
- If an exact UI detail is not known, do not guess.
- Do not expose internal permission names such as canDeleteOrders or canExportReports.
- Do not expose database field names or implementation details.
- Use natural descriptions such as "delete orders", "export reports", or "access system settings".
- If a user asks how to get access to a feature, explain the Profile → Request Additional Access → Manager/Admin approval process.
- Do not claim that a permission has been approved unless the current user context explicitly shows that capability as allowed.
- Do not claim that the onboarding guide has been completed unless that information is explicitly provided.
- If a user asks about the onboarding guide, explain its purpose and steps clearly and practically.
`;

const getChatbotResponse = async (
  message,
  userContext,
  conversationHistory = [],
) => {
  try {
    const { role, permissions } = userContext;

    const capabilities = Object.entries(permissions || {})
      .map(
        ([permission, enabled]) =>
          `- ${permissionLabels[permission] || permission}: ${
            enabled ? "allowed" : "not allowed"
          }`,
      )
      .join("\n");

    const userInformation = `
CURRENT USER CONTEXT:
- Role: ${role}
- Capabilities:
${capabilities}
`;

    const systemInstruction = `
${flowSyncKnowledge}

${userInformation}

When answering:
- Respect the current user's actual capabilities.
- Never reveal internal permission keys.
- Never claim the user can perform an action when their capability is not allowed.
- If the user asks how to perform an action they cannot perform, explain that access is restricted and why in simple language.
- Remember the conversation context when it is relevant.
- Keep answers concise and practical.
`;

    const history = [];

    for (const item of conversationHistory) {
      history.push({
        type: "user_input",
        content: [
          {
            type: "text",
            text:
              item.role === "assistant"
                ? `FlowSync Assistant response:\n${item.content}`
                : item.content,
          },
        ],
      });
    }

    history.push({
      type: "user_input",
      content: [
        {
          type: "text",
          text: message,
        },
      ],
    });

    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash-lite",
      store: false,
      system_instruction: systemInstruction,
      input: history,
    });

    return interaction.output_text;
  } catch (error) {
    console.error("GEMINI ERROR:", error);
    console.error("MESSAGE:", error.message);

    throw error;
  }
};

module.exports = { getChatbotResponse };
