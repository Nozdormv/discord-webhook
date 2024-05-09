# Discord Webhook Script

This script allows you to send messages and embeds to a Discord channel using a webhook. It provides a simple command-line interface for sending messages directly from your terminal.

## How to Use

1. **Clone the Repository**: 
   ```
   [git clone](https://github.com/Nozdormv/discord-webhook.git)
   ```

2. **Navigate to the Directory**:
   ```
   cd discord-webhook-script
   ```

3. **Install Dependencies**:
   ```
   npm install
   ```

4. **Configure the Webhook URL**:  
   Before using the script, you need to provide your Discord webhook URL. Edit the `config.mjs` file and set the `webhookUrl` property to your webhook URL.

5. **Run the Script**:
   ```
   discord-webhook.bat
   ```

6. **Follow the Prompts**:
   - Select the message type (Text or Embed).
   - Enter your message or embed details as prompted.
   - Confirm the message or embed details.
   - Optionally, send another message after confirmation.

## Features

- Send text messages and embeds to a Discord channel.
- Customize embeds with titles, descriptions, colors, and fields.
- Error logging to track failed message deliveries.
- Simple command-line interface for easy usage.

## Dependencies

- axios: ^0.24.0
- inquirer: ^8.1.2

## Configuration

You can configure the following options in the `config.mjs` file:

- `webhookUrl`: The URL of your Discord webhook.
- `logFilePath`: The file path for error logging.

## Contributing

Contributions are welcome! If you have any suggestions, feature requests, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](https://github.com/Nozdormv/discord-webhook/blob/main/LICENSE).
