# Let's Encrypt SSL Certificate Initialization Script
# This script helps set up SSL certificates for your wedding confirmation app

param(
    [Parameter(Mandatory=$true)]
    [string]$Domain,
    
    [Parameter(Mandatory=$true)]
    [string]$Email,
    
    [switch]$Staging = $false
)

Write-Host "Initializing Let's Encrypt SSL certificates for domain: $Domain" -ForegroundColor Green

# Create directories for certbot
$certbotPath = ".\certbot"
$confPath = "$certbotPath\conf"
$wwwPath = "$certbotPath\www"

if (!(Test-Path $certbotPath)) {
    New-Item -ItemType Directory -Path $certbotPath -Force
}
if (!(Test-Path $confPath)) {
    New-Item -ItemType Directory -Path $confPath -Force
}
if (!(Test-Path $wwwPath)) {
    New-Item -ItemType Directory -Path $wwwPath -Force
}

Write-Host "Created certbot directories" -ForegroundColor Yellow

# Update nginx.conf with the actual domain
$nginxConf = ".\frontend\nginx.conf"
if (Test-Path $nginxConf) {
    $content = Get-Content $nginxConf -Raw
    $content = $content -replace "your-domain\.com", $Domain
    Set-Content $nginxConf $content
    Write-Host "Updated nginx.conf with domain: $Domain" -ForegroundColor Yellow
}

# Create a temporary nginx config for initial certificate request
$tempNginxConf = @"
server {
    listen 80;
    server_name $Domain www.$Domain;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files `$uri `$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://api:8080/api/;
        proxy_set_header Host `$host;
        proxy_set_header X-Real-IP `$remote_addr;
        proxy_set_header X-Forwarded-For `$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto `$scheme;
    }
}
"@

# Backup original nginx.conf
Copy-Item $nginxConf "$nginxConf.backup"
Set-Content "$nginxConf.temp" $tempNginxConf

Write-Host "Starting services with temporary HTTP-only configuration..." -ForegroundColor Yellow

# Start services with temporary config
docker-compose down
$env:COMPOSE_FILE = "docker-compose.yaml"

# Temporarily update docker-compose to use temp nginx config
$dockerComposeContent = Get-Content "docker-compose.yaml" -Raw
$dockerComposeContent = $dockerComposeContent -replace "nginx\.conf:/etc/nginx/conf\.d/default\.conf", "nginx.conf.temp:/etc/nginx/conf.d/default.conf"
Set-Content "docker-compose.temp.yaml" $dockerComposeContent

$env:COMPOSE_FILE = "docker-compose.temp.yaml"
docker-compose up -d nginx

Write-Host "Waiting for nginx to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Request SSL certificate
$stagingFlag = if ($Staging) { "--staging" } else { "" }

Write-Host "Requesting SSL certificate..." -ForegroundColor Yellow
$certbotCommand = "docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email $Email --agree-tos --no-eff-email $stagingFlag -d $Domain -d www.$Domain"

Write-Host "Running: $certbotCommand" -ForegroundColor Gray
Invoke-Expression $certbotCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "SSL certificate obtained successfully!" -ForegroundColor Green
    
    # Restore original nginx config and restart services
    Move-Item "$nginxConf.backup" $nginxConf -Force
    Remove-Item "$nginxConf.temp" -Force
    Remove-Item "docker-compose.temp.yaml" -Force
    
    Write-Host "Restarting services with SSL configuration..." -ForegroundColor Yellow
    $env:COMPOSE_FILE = "docker-compose.yaml"
    docker-compose down
    docker-compose up -d
    
    Write-Host "Setup complete! Your site should now be available at https://$Domain" -ForegroundColor Green
    Write-Host "Certificate will auto-renew via the certbot container." -ForegroundColor Green
} else {
    Write-Host "Certificate request failed. Check the output above for errors." -ForegroundColor Red
    Write-Host "Make sure your domain points to this server and ports 80/443 are open." -ForegroundColor Red
    
    # Restore original files
    Move-Item "$nginxConf.backup" $nginxConf -Force
    Remove-Item "$nginxConf.temp" -Force -ErrorAction SilentlyContinue
    Remove-Item "docker-compose.temp.yaml" -Force -ErrorAction SilentlyContinue
}
