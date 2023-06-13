upstream website_upstream {
    server 139.144.66.165:8080;
}

upstream cms_upstream {
    server 139.144.66.165:8000;
}

server {
    server_name sarahisabella.info www.sarahisabella.info;
    root           /var/www/sarahisabella.info;
    index          index.html;

    gzip             on;
    gzip_comp_level  3;
    gzip_types       text/plain text/css application/javascript image/*;

    location /static/ {
        alias /static/;
    }

    location /media/ {
        alias /media/;
    }

    location / {
        proxy_set_header Host $host;
        proxy_pass http://website_upstream;
    }
    location /cms/ {
        proxy_cookie_path / /cms/;
        proxy_set_header Host $host;
        proxy_pass http://cms_upstream;
    }
    
    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/sarahisabella.info/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/sarahisabella.info/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = sarahisabella.info) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    listen [::]:80;
    server_name sarahisabella.info;
    return 404; # managed by Certbot
}

server {
    if ($host = www.sarahisabella.info) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;
    listen [::]:80;
    server_name www.sarahisabella.info;
    return 404; # managed by Certbot
}