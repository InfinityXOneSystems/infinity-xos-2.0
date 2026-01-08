# Infinity Intelligence System - Deployment Guide

## Overview

This guide covers deploying the Infinity Intelligence System for 24/7 autonomous operation. The system is designed to run in Docker containers for easy deployment, scaling, and management.

## Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **System Requirements**:
  - CPU: 4+ cores recommended
  - RAM: 8GB minimum, 16GB recommended
  - Disk: 50GB+ for data storage
  - Network: Stable internet connection

## Quick Start

### 1. Clone and Navigate to Directory

```bash
cd /home/ubuntu/infinity-intelligence-system
```

### 2. Configure the System

Edit the configuration file:

```bash
nano config/orchestrator_config.json
```

Key configuration options:
- **Scrapers**: Enable/disable specific scrapers
- **Schedule**: Set scraping frequency for each source
- **Output**: Configure data export settings
- **LLM**: Enable/disable Ollama integration

### 3. Build and Start Services

```bash
# Build the Docker image
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f intelligence-system
```

### 4. Verify Operation

```bash
# Check running containers
docker-compose ps

# Check system logs
docker-compose logs intelligence-system | tail -50

# Check data output
ls -lh data/leads/
```

## Configuration

### Orchestrator Configuration

Location: `config/orchestrator_config.json`

```json
{
  "scrapers": {
    "government": {
      "enabled": true,
      "county": "St. Lucie",
      "state": "FL",
      "rate_limit_delay": 2.0
    },
    "social": {
      "enabled": true,
      "platforms": ["facebook", "reddit"],
      "rate_limit_delay": 3.0
    },
    "business": {
      "enabled": true,
      "state": "FL",
      "rate_limit_delay": 2.0
    }
  },
  "processor": {},
  "scorer": {
    "use_llm": true
  },
  "schedule": {
    "government": "0 */6 * * *",
    "social": "0 */4 * * *",
    "business": "0 */12 * * *"
  },
  "output": {
    "save_raw": true,
    "save_processed": true,
    "save_scored": true,
    "export_top_n": 100
  }
}
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
POSTGRES_DB=intelligence_db
POSTGRES_USER=intelligence_user
POSTGRES_PASSWORD=your_secure_password_here

# Redis
REDIS_URL=redis://redis:6379/0

# Ollama
OLLAMA_BASE_URL=http://ollama:11434
OLLAMA_MODEL=llama2

# System
TZ=America/New_York
LOG_LEVEL=INFO
```

## Connecting to Existing Ollama

If you already have Ollama running in Docker:

### Option 1: Use Existing Ollama Container

1. Remove the Ollama service from `docker-compose.yml`
2. Add your Ollama container to the same network:

```bash
docker network connect infinity-intelligence-system_intelligence-network your-ollama-container
```

3. Update the Ollama URL in your configuration:

```bash
export OLLAMA_BASE_URL=http://your-ollama-container:11434
```

### Option 2: Use Host Ollama

1. Remove the Ollama service from `docker-compose.yml`
2. Use host networking:

```yaml
# In docker-compose.yml, add to intelligence-system service:
extra_hosts:
  - "host.docker.internal:host-gateway"
```

3. Set Ollama URL to host:

```bash
export OLLAMA_BASE_URL=http://host.docker.internal:11434
```

## Scaling for Multiple Industries

To scale the system for all 12 industries:

### 1. Create Industry-Specific Configurations

```bash
mkdir -p config/industries
```

Create separate config files for each industry:
- `config/industries/real_estate.json`
- `config/industries/business_loans.json`
- `config/industries/insurance.json`
- etc.

### 2. Run Multiple Orchestrator Instances

```yaml
# In docker-compose.yml, add additional services:
intelligence-system-real-estate:
  build:
    context: .
    dockerfile: docker/Dockerfile
  environment:
    - CONFIG_FILE=/app/config/industries/real_estate.json
  volumes:
    - ./data/real_estate:/app/data
    - ./logs/real_estate:/app/logs

intelligence-system-business-loans:
  build:
    context: .
    dockerfile: docker/Dockerfile
  environment:
    - CONFIG_FILE=/app/config/industries/business_loans.json
  volumes:
    - ./data/business_loans:/app/data
    - ./logs/business_loans:/app/logs
```

### 3. Use Docker Swarm for Orchestration

For production-scale deployment across multiple servers:

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml intelligence-stack

# Scale services
docker service scale intelligence-stack_intelligence-system=5
```

## Data Management

### Data Directory Structure

```
data/
├── raw/              # Raw scraped data
├── processed/        # Normalized and enriched data
└── leads/            # Scored and prioritized leads
    ├── scored_leads_*.json
    ├── top_100_leads_*.json
    └── critical_leads_*.json
```

### Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/intelligence-system"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup data
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" data/

# Backup database
docker-compose exec -T postgres pg_dump -U intelligence_user intelligence_db > "$BACKUP_DIR/db_$DATE.sql"

# Keep only last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /home/ubuntu/infinity-intelligence-system/backup.sh
```

## Monitoring

### View Real-Time Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f intelligence-system

# With timestamps
docker-compose logs -f --timestamps intelligence-system
```

### Access Grafana Dashboard

1. Open browser: `http://your-server-ip:3000`
2. Login: admin / admin (change on first login)
3. Add Prometheus data source: `http://prometheus:9090`
4. Import dashboards for system metrics

### Check System Statistics

```bash
# View orchestrator statistics
cat logs/orchestrator_stats.json | jq .

# Count leads by priority
jq -r '.priority_tier' data/leads/scored_leads_*.json | sort | uniq -c
```

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs intelligence-system

# Check container status
docker-compose ps

# Restart service
docker-compose restart intelligence-system
```

### Database Connection Issues

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection
docker-compose exec intelligence-system python3 -c "import psycopg2; print('OK')"

# Reset database
docker-compose down -v
docker-compose up -d
```

### Scraper Failures

```bash
# Check error logs
grep ERROR logs/*.log

# Test specific scraper
docker-compose exec intelligence-system python3 src/scrapers/government_scraper.py

# Increase rate limits in config
# Edit config/orchestrator_config.json and increase rate_limit_delay values
```

### High Memory Usage

```bash
# Check resource usage
docker stats

# Limit container resources
# Add to docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 4G
      cpus: '2.0'
```

## Maintenance

### Update System

```bash
# Pull latest changes
git pull

# Rebuild containers
docker-compose build --no-cache

# Restart services
docker-compose down
docker-compose up -d
```

### Clean Up Old Data

```bash
# Remove data older than 30 days
find data/raw -name "*.json" -mtime +30 -delete
find data/processed -name "*.json" -mtime +30 -delete

# Keep only top leads
find data/leads -name "scored_leads_*.json" -mtime +7 -delete
```

### Rotate Logs

```bash
# Docker handles log rotation automatically
# Configure in docker-compose.yml:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## Production Deployment Checklist

- [ ] Change default passwords in `.env`
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS for external access
- [ ] Configure backup automation
- [ ] Set up monitoring alerts
- [ ] Test disaster recovery procedures
- [ ] Document custom configurations
- [ ] Set up log aggregation (ELK stack)
- [ ] Configure rate limits appropriately
- [ ] Review and comply with data privacy regulations
- [ ] Set up API authentication if exposing endpoints
- [ ] Configure proxy rotation if needed
- [ ] Test failover scenarios
- [ ] Document incident response procedures

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review documentation in `docs/` directory
3. Check GitHub issues
4. Contact system administrator

## License

Proprietary - All Rights Reserved
