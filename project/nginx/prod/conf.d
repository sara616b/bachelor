upstream website_upstream {
    server 127.0.0.1:8080;
}

upstream cms_upstream {
    server 127.0.0.1:8000;
}

server {
    server_name sarahisabella.info;
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

    location /site/ {
        proxy_cookie_path / /site/;
        proxy_set_header Host $host;
        proxy_pass http://website_upstream;
    }
    location /cms/ {
        proxy_cookie_path / /cms/;
        proxy_set_header Host $host;
        proxy_pass http://cms_upstream;
    }
}

server {
    server_name www.sarahisabella.info;

    root /var/www/sarahisabella.info;
    index index.html;

    gzip on;
    gzip_comp_level 3;
    gzip_types text/plain text/css application/javascript image/*;

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