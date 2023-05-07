upstream website_upstream {
    server website:8080;
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





}

