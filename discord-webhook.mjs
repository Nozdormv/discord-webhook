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
  } else if (messageType === 'Embed') {
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
    

    sendMessageToWebhook('', { embeds: [embed] });
  }
}

// Call the promptUser function to start the interaction
promptUser();