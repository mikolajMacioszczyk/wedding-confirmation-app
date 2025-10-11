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

# Create directories for certbot with proper permissions
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
mkdir -p ./certbot/logs

# Set proper permissions
chmod -R 755 ./certbot

echo "Created certbot directories"

# Update nginx.conf with the actual domain
if [ -f "./frontend/nginx.conf" ]; then
    cp "./frontend/nginx.conf" "./frontend/nginx.conf.backup"
    sed -i.bak "s/your-domain\.com/$DOMAIN/g" ./frontend/nginx.conf
    echo "Updated nginx.conf with domain: $DOMAIN"
fi

# Create a temporary nginx config for initial certificate request
cat > ./frontend/nginx.conf.temp << 'EOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        try_files $uri $uri/ =404;
    }
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://api:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Replace domain placeholder
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" ./frontend/nginx.conf.temp

echo "Starting services with temporary HTTP-only configuration..."

# Create temporary docker-compose file with temp nginx config
cp docker-compose.yaml docker-compose.temp.yaml
sed -i 's|./frontend/nginx.conf:/etc/nginx/conf.d/default.conf|./frontend/nginx.conf.temp:/etc/nginx/conf.d/default.conf|' docker-compose.temp.yaml

# Stop any running services
docker compose down

# Start services with temporary config
docker compose -f docker-compose.temp.yaml up -d nginx

echo "Waiting for nginx to start..."
sleep 15

# Check if nginx is running
if ! docker compose -f docker-compose.temp.yaml ps nginx | grep -q "Up"; then
    echo "Error: nginx failed to start"
    exit 1
fi

# Set staging flag
STAGING_FLAG=""
if [ "$STAGING" = "--staging" ]; then
    STAGING_FLAG="--test-cert"
    echo "Using Let's Encrypt staging environment"
fi

echo "Requesting SSL certificate..."
echo "Domain: $DOMAIN"
echo "Email: $EMAIL"
echo "Staging: $STAGING"

# Test if domain is accessible
echo "Testing domain accessibility..."
curl -I "http://$DOMAIN/.well-known/acme-challenge/test" || echo "Domain test failed - this is expected"

# Create a test file to verify nginx is serving the challenge directory
echo "Creating test file for validation..."
docker compose -f docker-compose.temp.yaml exec nginx mkdir -p /var/www/certbot/.well-known/acme-challenge
docker compose -f docker-compose.temp.yaml exec nginx sh -c 'echo "test" > /var/www/certbot/.well-known/acme-challenge/test'

# Test if we can access the test file
echo "Testing challenge directory accessibility..."
curl "http://$DOMAIN/.well-known/acme-challenge/test" || echo "Challenge directory test failed"

# Create the certificate using the official Docker approach
docker run -it --rm --name certbot \
    -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/certbot/www:/var/www/certbot" \
    -v "$(pwd)/certbot/logs:/var/log/letsencrypt" \
    certbot/certbot \
    certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --expand \
    --verbose \
    $STAGING_FLAG \
    -d $DOMAIN \
    -d www.$DOMAIN

CERT_EXIT_CODE=$?

if [ $CERT_EXIT_CODE -eq 0 ]; then
    echo "SSL certificate obtained successfully!"
    
    # Verify certificate files exist
    if [ -d "./certbot/conf/live/$DOMAIN" ]; then
        echo "Certificate files found for $DOMAIN"
        ls -la "./certbot/conf/live/$DOMAIN/"
    else
        echo "Warning: Certificate directory not found"
    fi
    
    # Restore original nginx config and restart services
    if [ -f "./frontend/nginx.conf.backup" ]; then
        mv ./frontend/nginx.conf.backup ./frontend/nginx.conf
    fi
    rm -f ./frontend/nginx.conf.temp
    rm -f docker-compose.temp.yaml
    
    echo "Restarting services with SSL configuration..."
    docker compose down
    docker compose up -d
    
    echo "Setup complete! Your site should now be available at https://$DOMAIN"
    echo "Certificate will auto-renew via the certbot container."
    
    # Show certificate info
    echo "Certificate information:"
    docker run --rm \
        -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
        certbot/certbot certificates
        
else
    echo "Certificate request failed with exit code: $CERT_EXIT_CODE"
    echo "Check the output above for errors."
    echo "Common issues:"
    echo "- Domain doesn't point to this server"
    echo "- Ports 80/443 are not accessible from internet"
    echo "- DNS propagation not complete"
    
    # Restore original files
    if [ -f "./frontend/nginx.conf.backup" ]; then
        mv ./frontend/nginx.conf.backup ./frontend/nginx.conf
    fi
    rm -f ./frontend/nginx.conf.temp
    rm -f docker-compose.temp.yaml
    
    exit 1
fi
