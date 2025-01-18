# Configuration Guide

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| BLUESKY_IDENTIFIER | Your Bluesky handle | Yes |
| BLUESKY_PASSWORD | Your Bluesky app password | Yes |
| GELBOORU_API_KEY | Gelbooru API key | No |
| GELBOORU_USER_ID | Gelbooru user ID | No |
| PORT | Server port | No (default: 3000) |

## Content Filtering

The bot uses a content filter to block certain terms. The filter is defined in the [`block_list.json`](../src/resources/block_list.json). Each entry contains:

- `term`: The term to block.
- `category`: The category of the term.
- `severity`: The severity of the term.
- `description`: A description of the term.


## Provider Configuration

Providers can be configured in their respective classes:

- [`Gelbooru`](../src/services/providers/gelbooru.ts)
- [`Rule34`](../src/services/providers/rule34.ts)

