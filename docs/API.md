# API Documentation

## Endpoints

### GET /api/providers
Returns a list of available image providers.

**Response:** 

```json
{
"success": true,
"data": ["gelbooru", "rule34"]
}
```

### GET /api/search
Search for images across providers.

**Parameters:**
- `provider` (string): Provider name (default: "gelbooru")
- `query` (string): Search query
- `page` (number): Page number (default: 1)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "id": number,
            "file_url": string,
            "tags": string,
            // ... other properties
        }
    ]
}
```