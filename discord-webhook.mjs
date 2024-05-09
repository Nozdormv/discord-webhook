import axios from 'axios';
import inquirer from 'inquirer';

// Define the webhook URL
const webhookUrl = 'YOUR_WEBHOOK_URL';

// Function to send a message to the webhook
async function sendMessageToWebhook(message, options = {}) {
  try {
    const payload = {
      content: message,
      embeds: options.embeds || [], // Default empty array for embeds
      files: options.files || [] // Default empty array for attachments
      // Add more options as needed
    };

    const response = await axios.post(webhookUrl, payload);
    console.log('\x1b[33m%s\x1b[0m', '\nMessage successfully sent to Discord!');
    console.log('\x1b[33m%s\x1b[0m', '------------------------------------\n');

  } catch (error) {
    console.error('Error sending message to Discord webhook:', error.response.data);
    logError(error);
  }
}

// Function to log errors to a file
async function logError(error) {
  const errorMessage = `${new Date().toISOString()} - Error: ${error.message}\n`;
  try {
    await fs.appendFile('error.log', errorMessage);
    console.log('Error logged to error.log');
  } catch (err) {
    console.error('Error writing to error log:', err);
  }
}

// Function to prompt the user if they want to send another message
async function promptForAnotherMessage() {
  const { anotherMessage } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'anotherMessage',
      message: 'Do you want to send another message?',
      default: false,
    },
  ]);

  if (anotherMessage) {
    // If user wants to send another message, restart the script
    promptUser();
  } else {
    // If user doesn't want to send another message, exit the script
    console.log('\x1b[33m%s\x1b[0m', '\nExiting...\n');
    process.exit();
  }
}

// Prompt the user for message content and type
async function promptUser() {
  const { messageType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'messageType',
      message: 'Select message type:',
      choices: ['Text', 'Embed'],
    },
  ]);

  if (messageType === 'Text') {
    const { message } = await inquirer.prompt([
      {
        type: 'input',
        name: 'message',
        message: 'Enter your message:',
      },
    ]);
    sendMessageToWebhook(message);
    // Confirm after sending the message
    promptForAnotherMessage();
  } else if (messageType === 'Embed') {
    // The existing embed logic goes here...
  }
}

// Call the promptUser function to start the interaction
promptUser();
