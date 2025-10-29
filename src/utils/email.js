const nodemailer = require('nodemailer');
const config = require('../config/config'); 

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure, // true for 465, false for other ports
  auth: {
    user: config.email.user, // generated ethereal user
    pass: config.email.pass,  // generated ethereal password
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: config.email.from, // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
    console.log('Email sent successfully!');
    console.log('Message ID: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

const generateVerificationTemplate = (verificationLink) => {
  return `
    <html>
    <head>
      <title>Verify Your Account</title>
    </head>
    <body>
      <p>Please click this link to verify your account:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    </body>
    </html>
  `;
};

// 1. OTP Verification
const generateOtpTemplate = (otp) => `
  <html>
    <head><title>Verify Your Account</title></head>
    <body>
      <h2>Your OTP Code</h2>
      <p>Please use the following OTP to verify your account:</p>
      <h3>${otp}</h3>
    </body>
  </html>
`;

// 2. Owner Created
const generateOwnerCreatedTemplate = (ownerName) => `
  <html>
    <body>
      <h2>Welcome, ${ownerName}!</h2>
      <p>Your owner account has been created successfully.</p>
    </body>
  </html>
`;

// 3. Owner Login Notification
const generateLoginNotificationTemplate = (ownerName, time) => `
  <html>
    <body>
      <h2>Hello ${ownerName},</h2>
      <p>You successfully logged in at ${time}.</p>
    </body>
  </html>
`;

// 4. Forgot Password
const generateForgotPasswordTemplate = (resetLink) => `
  <html>
    <body>
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
    </body>
  </html>
`;

// 5. Password Changed
const generatePasswordChangedTemplate = (ownerName) => `
  <html>
    <body>
      <h2>Hello ${ownerName},</h2>
      <p>Your password has been successfully updated.</p>
    </body>
  </html>
`;

// 6. Feedback Thank You
const generateFeedbackTemplate = (userName) => `
  <html>
    <body>
      <h2>Thank you, ${userName}!</h2>
      <p>We appreciate your feedback. It helps us improve.</p>
    </body>
  </html>
`;

// 7. Property Created / Updated
const generatePropertyTemplate = (ownerName, propertyName, action) => `
  <html>
    <body>
      <h2>Hello ${ownerName},</h2>
      <p>Your property <strong>${propertyName}</strong> has been successfully ${action}.</p>
    </body>
  </html>
`;

// 8. Financial Report
const generateFinancialReportTemplate = (ownerName, reportLink) => `
  <html>
    <body>
      <h2>Financial Report</h2>
      <p>Hello ${ownerName}, your financial report is ready:</p>
      <a href="${reportLink}">Download Report</a>
    </body>
  </html>
`;

// 9. Tenant Created / Updated / Deleted
const generateTenantTemplate = (tenantName, action) => `
  <html>
    <body>
      <h2>Hello ${tenantName},</h2>
      <p>Your tenant record has been ${action} successfully.</p>
    </body>
  </html>
`;

// 10. Tenant Transaction
const generateTenantTransactionTemplate = (tenantName, amount, status) => `
  <html>
    <body>
      <h2>Hello ${tenantName},</h2>
      <p>Your transaction of <strong>₹${amount}</strong> has been ${status}.</p>
    </body>
  </html>
`;

// 11. Owner Profile Update
const generateOwnerProfileUpdatedTemplate = (ownerName) => `
  <html>
    <body>
      <h2>Hello ${ownerName},</h2>
      <p>Your profile has been updated successfully.</p>
    </body>
  </html>
`;

// 12. Generic Notification
const generateNotificationTemplate = (title, message) => `
  <html>
    <body>
      <h2>${title}</h2>
      <p>${message}</p>
    </body>
  </html>
`;

// 13. Generic Tenant Update
const generateGenericTenantTemplate = (tenantName, message) => `
  <html>
    <body>
      <h2>Hello ${tenantName},</h2>
      <p>${message}</p>
    </body>
  </html>
`;


module.exports = {
  sendEmail,
  generateVerificationTemplate,
  generateOtpTemplate,
  generateOwnerCreatedTemplate,
  generateLoginNotificationTemplate,
  generateForgotPasswordTemplate,
  generatePasswordChangedTemplate,
  generateFeedbackTemplate,
  generatePropertyTemplate,
  generateFinancialReportTemplate,
  generateTenantTemplate,
  generateTenantTransactionTemplate,
  generateOwnerProfileUpdatedTemplate,
  generateNotificationTemplate,
  generateGenericTenantTemplate
};