// Google Apps Script for Meeting Request Form Integration

/**
 * This script handles form submissions from the Tazayed Investment Platform
 * and performs the following actions:
 * 1. Saves the submission data to a Google Sheet
 * 2. Sends an email notification with the submission details
 * 
 * To set up:
 * 1. Create a new Google Sheet with the following columns:
 *    - Timestamp
 *    - Name
 *    - Email
 *    - Phone
 *    - Organization
 *    - Company
 *    - Message
 * 2. Create a new Google Apps Script project from the Sheet
 * 3. Copy this code into the project
 * 4. Deploy as a web app (Execute as: Me, Who has access: Anyone)
 * 5. Copy the web app URL and update the scriptURL variable in main.js
 */

// Configuration
const EMAIL_RECIPIENT = "mohamed.elberbawi@gmail.com";
const SHEET_NAME = "Meeting Requests";

/**
 * Process the web app request
 */
function doPost(e) {
  try {
    // Parse the request data
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data
    console.log("Received form submission:", data);
    
    // Save to spreadsheet
    const result = saveToSheet(data);
    
    // Send email notification
    sendEmailNotification(data);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Form submission processed successfully"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log the error
    console.error("Error processing form submission:", error);
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Save the form data to the Google Sheet
 */
function saveToSheet(data) {
  // Get the active spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  
  // Check if headers exist, if not add them
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp", 
      "Name", 
      "Email", 
      "Phone", 
      "Organization", 
      "Company", 
      "Message"
    ]);
  }
  
  // Append the new row with form data
  sheet.appendRow([
    new Date(), 
    data.name || "", 
    data.email || "", 
    data.phone || "", 
    data.organization || "", 
    data.company || "", 
    data.message || ""
  ]);
  
  return true;
}

/**
 * Send an email notification with the form data
 */
function sendEmailNotification(data) {
  // Create email subject
  const subject = `New Meeting Request: ${data.name} for ${data.company}`;
  
  // Create email body
  const body = `
    A new meeting request has been submitted on the Tazayed Investment Platform.
    
    Details:
    -----------------------
    Name: ${data.name}
    Email: ${data.email}
    Phone: ${data.phone}
    Organization: ${data.organization}
    Company of Interest: ${data.company}
    
    Message:
    ${data.message || "No message provided."}
    
    -----------------------
    This email was automatically generated from the Tazayed Investment Platform.
  `;
  
  // Send the email
  MailApp.sendEmail({
    to: EMAIL_RECIPIENT,
    subject: subject,
    body: body
  });
  
  return true;
}

/**
 * Test function to verify the script is working
 */
function testScript() {
  const testData = {
    name: "Test User",
    email: "test@example.com",
    phone: "+971501234567",
    organization: "Test Organization",
    company: "NeuraTech",
    message: "This is a test message."
  };
  
  saveToSheet(testData);
  sendEmailNotification(testData);
  
  return "Test completed successfully!";
}

/**
 * Handle GET requests - useful for testing if the web app is deployed correctly
 */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "The Tazayed Investment Platform API is running. Use POST to submit form data."
  })).setMimeType(ContentService.MimeType.JSON);
}
