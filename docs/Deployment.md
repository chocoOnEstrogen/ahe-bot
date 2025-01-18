# Deployment Guide

## Standard Deployment

1. Build the project:
```bash
npm run build
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Start the application:
```bash
npm start
```

## Docker Deployment

### Using Docker Compose (Recommended)

1. Make sure Docker and Docker Compose are installed
2. Set up your environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Build and start the container:
```bash
docker-compose up -d
```

4. View logs:
```bash
docker-compose logs -f
```

### Using Docker Directly

1. Build the image:
```bash
./scripts/docker-build.sh
# or
docker build -t anime-image-bot .
```

2. Run the container:
```bash
./scripts/docker-run.sh
# or
docker run -d --name anime-image-bot -p 3000:3000 --env-file .env anime-image-bot
```

### Docker Configuration

The Docker setup includes:
- Node.js 20 Alpine base image for minimal size
- Multi-stage build for optimized image size
- Health checks for container monitoring
- Automatic restart policy
- Environment variable support
- Port mapping for the API

## Monitoring

### Health Checks

The application exposes a health check endpoint:
```
GET /api/providers
```

### Logging

Docker logs can be viewed using:
```bash
docker logs anime-image-bot
# or
docker-compose logs app
```

### Resource Usage

Monitor container resources:
```bash
docker stats anime-image-bot
```

## Production Considerations

1. **Security**
   - Use a reverse proxy (nginx/traefik)
   - Enable HTTPS
   - Set up proper firewall rules

2. **Performance**
   - Adjust Node.js memory limits if needed
   - Configure cache TTLs appropriately
   - Monitor API rate limits

3. **Maintenance**
   - Set up automated backups
   - Configure log rotation
   - Schedule regular updates

## Troubleshooting

Common issues and solutions:

1. **Container won't start**
   - Check logs: `docker logs anime-image-bot`
   - Verify environment variables
   - Ensure ports are available

2. **API errors**
   - Check provider status
   - Verify API credentials
   - Review rate limits

3. **Performance issues**
   - Monitor resource usage
   - Check cache hit rates
   - Review logging levels
