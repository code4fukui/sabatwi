# sabatwi

## to run

```
deno run -A sabatwi.js 8080
```
access https://localhost:8080/

## API

### add

http://[::]:8080/api/tweet/add?{"post":"test","user":"a"}

### list

http://[::]:8080/api/tweet/list

## setup the server

### login

```sh
ssh -i secretkey ubuntu@160.248.79.66
```

### update

```sh
sudo apt update
sudo apt upgrade
sudo reboot now
```
### nginx

```sh
sudo apt install nginx
sudo apt install certbot python3-certbot-nginx
```

- get a domain: sabatwi.com
- set DNS record: a @ 160.248.79.66

```sh
sudo vi /etc/nginx/conf.d/sabatwi_com.conf
server {
  listen 80;
  server_name sabatwi.com;
  location / {
    proxy_pass http://localhost:8080/;
  }
}
```

### stop Apatch

```sh
sudo systemctl stop apache2
```

### start nginx

```sh
sudo service nginx start
```

### set Let's encript

```sh
sudo certbot
```

- check https://sabatwi.com/

### if edit *.conf

```sh
sudo nginx -s reload
```

### install deno

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

### test

```sh
mkdir temp
cd temp
mkdir static
echo test > static/index.html
deno run -A https://code4fukui.github.io/wsutil/demo4.js 8080
```
- access https://sabatwi.com/
