import axios from 'axios';
import inquirer from 'inquirer';
import { promises as fs } from 'fs';
import config from './config.mjs'; // Importing configuration from config.mjs

// Function to send a message to the webhook
async function sendMessageToWebhook(message, options = {}) {
  try {
    const payload = {
      content: message,
      embeds: options.embeds || [], // Default empty array for embeds
      files: options.files || [] // Default empty array for attachments
      // Add more options as needed
    };

    const response = await axios.post(config.webhookUrl, payload); // Sending message to webhook URL from config
    console.log('\x1b[33m%s\x1b[0m', '\nMessage successfully sent to Discord!');
    console.log('\x1b[33m%s\x1b[0m', '------------------------------------\n');

  } catch (error) {
    console.error('\x1b[33m%s\x1b[0m', '\nError sending message to Discord webhook:\n', error.response.data);
    logError(error);
  }
}

// Function to log errors to a file
async function logError(error) {
  const errorMessage = `${new Date().toISOString()} - Error: ${error.message}\n`;
  try {
    await fs.appendFile(config.logFilePath, errorMessage);
    console.log('\x1b[33m%s\x1b[0m', '\nError logged to error.log\n');
  } catch (err) {
    console.error('\x1b[33m%s\x1b[0m', '\nError writing to error log:\n', err);
  }
}

// Function to prompt for configuration options
async function promptForConfig() {
  const { webhookUrl, logFilePath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'webhookUrl',
      message: 'Enter Discord webhook URL:',
      default: config.webhookUrl,
    },
    {
      type: 'input',
      name: 'logFilePath',
      message: 'Enter error log file path:',
      default: config.logFilePath,
    },
  ]);
  config.webhookUrl = webhookUrl;
  config.logFilePath = logFilePath;
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

// Function to prompt the user for embed details
async function promptForEmbed() {
  const embedFields = [
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the embed:',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Enter the description of the embed:',
    },
    {
      type: 'input',
      name: 'color',
      message: 'Enter the color of the embed:',
      default: '#FFFF00', // Default color (yellow)
    },
    {
      type: 'confirm',
      name: 'addFields',
      message: 'Do you want to add fields to the embed?',
      default: false,
    },
  ];

  const { title, description, color, addFields } = await inquirer.prompt(embedFields);
  let embed = {
    title,
    description,
    color: parseInt(color.replace('#', ''), 16),
    fields: [],
  };

  if (addFields) {
    while (true) {
      const { name, value, inline, addAnother } = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter the name of the field:',
        },
        {
          type: 'input',
          name: 'value',
          message: 'Enter the value of the field:',
        },
        {
          type: 'confirm',
          name: 'inline',
          message: 'Do you want this field to be inline?',
          default: false,
        },
        {
          type: 'confirm',
          name: 'addAnother',
          message: 'Do you want to add another field?',
          default: false,
        },
      ]);
      embed.fields.push({ name, value, inline });
      if (!addAnother) break;
    }
  }

  return embed;
}

// Function to prompt the user for message content and type
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
    const embed = await promptForEmbed();
    sendMessageToWebhook('', { embeds: [embed] });
    // Confirm after sending the message
    promptForAnotherMessage();
  }
}

// Function to prompt for configuration options before starting the interaction
async function startScript() {
  if (!config.webhookUrl) {
    await promptForConfig();
  }
  promptUser();
}

// Call the startScript function to start the interaction
startScript();
