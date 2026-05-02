# How to setup the server

## prepare a server

replace followings to your server
- *IP Address*
- *domain name*

## login

```sh
ssh -i secretkey ubuntu@*IP Address*
```

## update OS

```sh
sudo apt update
sudo apt upgrade
sudo reboot now
```
## nginx

```sh
sudo apt install nginx
sudo apt install certbot python3-certbot-nginx
```

- get a domain: *domain name*
- set DNS record: a @ *IP Address*

```sh
sudo vi /etc/nginx/conf.d/*domain name*.conf
server {
  listen 80;
  server_name *domain name*;
  location / {
    proxy_pass http://localhost:8080/;
  }
}
```

## stop Apatch

```sh
sudo systemctl stop apache2
```

## start nginx

```sh
sudo service nginx start
```

## set Let's encript

```sh
sudo certbot
```

- check https://*domain name*/

## if edit *.conf

```sh
sudo nginx -s reload
```

## install deno

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

## test

```sh
mkdir temp
cd temp
mkdir static
echo test > static/index.html
deno run -A https://code4fukui.github.io/wsutil/demo4.js 8080
```
- access https://*domain name*/

## setup sabatwi

```sh
git clone https://github.com/code4fukui/sabatwi.git
cd sabatwi
nohup deno run --unstable --watch -A sabatwi.js 8080 &
```

## update sabatwi

```
cd sabatwi
git pull
```

### auto update sabatwi by every minute

```
nohup sh autoupdate.sh &
```
