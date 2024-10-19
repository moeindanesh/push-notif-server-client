# Self Hosted Push Notification Service

This project allows you to set up your own push notification service using web-push technology.

## Prerequisites

- Bun installed on your system
- Basic knowledge of JavaScript and server-side programming

## Getting Started

1. Clone this repository to your local machine.

2. Install the dependencies by running:

   ```
   bun install
   ```

3. Generate VAPID keys:
   Open your terminal and enter this command in the project root:

   ```
   bun x web-push generate-vapid-keys
   ```

   This will generate a pair of public and private VAPID keys. Save these keys as you'll need them in the next step.

4. Set up environment variables:
   Create a `.env` file in the project root and add the following:

   ```
   vapid_public_key=your_public_key_here
   vapid_private_key=your_private_key_here
   ```

   Replace `your_public_key_here` and `your_private_key_here` with the keys generated in step 3.

5. Start the server:

   ```
   bun run src/index.ts
   ```

6. Open `client/index.html` in a web browser to test the push notification functionality.

## Project Structure

- `src/index.ts`: Main server file
- `client/`: Contains client-side files
  - `index.html`: Main HTML file
  - `client.js`: Client-side JavaScript
  - `worker.js`: Service Worker file
  - `manifest.json`: Web App Manifest file

## Usage

1. Click the "Subscribe to Push Notifications" button in the web interface.
2. Allow notifications when prompted by the browser.
3. You should now be subscribed to push notifications from your self-hosted service.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
