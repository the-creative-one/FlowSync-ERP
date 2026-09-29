const permissionLabels = {
  canCreateOrders: "CreateOrders",
  canUpdateOrders: "UpdateOrders",
  canDeleteOrders: "DeleteOrders",
  canManageEmployees: "ManageEmployees",
  canViewAdvancedAnalytics: "ViewAdvancedAnalytics",
  canExportReports: "ExportReports",
  canAccessSettings: "AccessSettings",
};

const permissionRequestEmailTemplate = ({
  employeeName,
  employeeEmail,
  permissionName,
}) => {
  const displayPermission = permissionLabels[permissionName] || permissionName;

  return `
    <!DOCTYPE html>
    <html>
      <body
        style="
          margin: 0;
          padding: 0;
          background-color: #F4F7FA;
          font-family: Arial, Helvetica, sans-serif;
          color: #0C2B4E;
        "
      >
        <div
          style="
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
          "
        >
          <div
            style="
              padding: 24px 32px;
              background-color: #0C2B4E;
              text-align: center;
            "
          >
            <img
           <img
              src="https://res.cloudinary.com/dsbwtn2lu/image/upload/v1781344316/White-Logo_vpyxsw.png"
              alt="FlowSync"
              style="
                display: block;
                width: 180px;
                max-width: 100%;
                height: auto;
                margin: 0 auto;
              "
            />

            <p
              style="
                margin: 12px 0 0;
                color: #ffffff;
                font-size: 14px;
              "
            >
              Permission Request
            </p>
          </div>

          <div style="padding: 32px;">

            <h2
              style="
                margin: 0 0 12px;
                color: #0C2B4E;
                font-size: 22px;
              "
            >
              New Permission Request
            </h2>

            <p
              style="
                margin: 0 0 24px;
                color: #4B5563;
                font-size: 15px;
                line-height: 1.6;
              "
            >
              A user has requested additional access in FlowSync.
            </p>

            <div
              style="
                padding: 20px;
                background-color: #F4F7FA;
                border-left: 4px solid #1D546C;
                border-radius: 8px;
              "
            >
              <p
                style="
                  margin: 8px 0;
                  color: #0C2B4E;
                  font-size: 14px;
                "
              >
                <strong>Name:</strong> ${employeeName}
              </p>

              <p
                style="
                  margin: 8px 0;
                  color: #0C2B4E;
                  font-size: 14px;
                "
              >
                <strong>Email:</strong> ${employeeEmail}
              </p>

              <p
                style="
                  margin: 8px 0;
                  color: #0C2B4E;
                  font-size: 14px;
                "
              >
                <strong>Requested Access:</strong> ${displayPermission}
              </p>
            </div>

            <p
              style="
                margin: 24px 0 0;
                color: #4B5563;
                font-size: 15px;
                line-height: 1.6;
              "
            >
              Please log in to FlowSync and review this permission request.
            </p>

          </div>

          <div
            style="
              padding: 20px 32px;
              background-color: #0C2B4E;
              text-align: center;
            "
          >
            <p
              style="
                margin: 0;
                color: #ffffff;
                font-size: 13px;
              "
            >
              This is an automated notification from FlowSync.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
};

module.exports = {
  permissionRequestEmailTemplate,
};
