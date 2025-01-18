# AHE Bot

A TypeScript-based bot that automatically posts anime images to Bluesky. The bot fetches images from popular anime image boards (Gelbooru and Rule34), processes them to meet Bluesky's requirements, and posts them with relevant tags.

## 🌟 Features

- Automatic image fetching from multiple providers (Gelbooru, Rule34)
- Smart image processing and resizing
- Automatic posting to Bluesky
- Content filtering system
- Built-in caching for improved performance
- CORS-enabled API endpoints
- Configurable posting schedule

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Bluesky account
- (Optional) Gelbooru API credentials

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/chocoOnEstrogen/ahe-bot.git
cd ahe-bot
```

2. Install dependencies:

```bash
npm install
```


3. Create a `.env` file with the following variables:

```bash
BLUESKY_IDENTIFIER=your.bluesky.handle
BLUESKY_PASSWORD=your-app-password
GELBOORU_API_KEY=your-api-key
GELBOORU_USER_ID=your-user-id
PORT=3000
```

4. Run the bot:

```bash
npm run dev # Development mode
npm run serve # API server only
npm start # Production mode
```


## 🛠️ Configuration

The bot can be configured through various files:

- `src/resources/block_list.json`: Content filtering rules
- Environment variables (see `.env.example`)
- Posting schedule in `src/index.ts`
- Provider settings in respective provider classes

## 📚 Documentation

Detailed documentation is available in the [docs](./docs) directory:

- [API Documentation](./docs/API.md)
- [Configuration Guide](./docs/Configuration.md)
- [Development Guide](./docs/Development.md)
- [Deployment Guide](./docs/Deployment.md)

## 🔒 Security

This bot includes several security features:

- Content filtering system
- Rate limiting
- CORS protection
- Environment variable protection

## 📝 License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./.github/CONTRIBUTING.md) for details.