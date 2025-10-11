#!/bin/bash

# Let's Encrypt SSL Certificate Initialization Script
# This script helps set up SSL certificates for your wedding confirmation app

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <domain> <email> [--staging]"
    echo "Example: $0 yourdomain.com admin@yourdomain.com"
    echo "Use --staging flag for testing (Let's Encrypt staging environment)"
    exit 1
fi

DOMAIN=$1
EMAIL=$2
STAGING=${3:-""}

echo "Initializing Let's Encrypt SSL certificates for domain: $DOMAIN"

# Create directories for certbot
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

echo "Created certbot directories"

# Update nginx.conf with the actual domain
if [ -f "./frontend/nginx.conf" ]; then
    sed -i.backup "s/your-domain\.com/$DOMAIN/g" ./frontend/nginx.conf
    echo "Updated nginx.conf with domain: $DOMAIN"
fi

# Create a temporary nginx config for initial certificate request
cat > ./frontend/nginx.conf.temp << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://api:8080/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

echo "Starting services with temporary HTTP-only configuration..."

# Create temporary docker-compose file with temp nginx config
cp docker-compose.yaml docker-compose.temp.yaml
sed -i 's/nginx\.conf:/nginx.conf.temp:/' docker-compose.temp.yaml

# Start services with temporary config
docker compose down
docker compose -f docker-compose.temp.yaml up -d nginx

echo "Waiting for nginx to start..."
sleep 10

# Request SSL certificate
STAGING_FLAG=""
if [ "$STAGING" = "--staging" ]; then
    STAGING_FLAG="--staging"
fi

echo "Requesting SSL certificate..."
docker compose -f docker-compose.temp.yaml run --rm certbot \
    certonly --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    $STAGING_FLAG \
    -d $DOMAIN \
    -d www.$DOMAIN

if [ $? -eq 0 ]; then
    echo "SSL certificate obtained successfully!"
    
    # Restore original nginx config and restart services
    mv ./frontend/nginx.conf.backup ./frontend/nginx.conf
    rm -f ./frontend/nginx.conf.temp
    rm -f docker-compose.temp.yaml
    
    echo "Restarting services with SSL configuration..."
    docker compose down
    docker compose up -d
    
    echo "Setup complete! Your site should now be available at https://$DOMAIN"
    echo "Certificate will auto-renew via the certbot container."
else
    echo "Certificate request failed. Check the output above for errors."
    echo "Make sure your domain points to this server and ports 80/443 are open."
    
    # Restore original files
    mv ./frontend/nginx.conf.backup ./frontend/nginx.conf 2>/dev/null || true
    rm -f ./frontend/nginx.conf.temp
    rm -f docker-compose.temp.yaml
fi
