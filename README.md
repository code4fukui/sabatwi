# さばつい sabatwi

## to run

```sh
deno run -A --unstable --watch sabatwi.js 8080
```
access https://localhost:8080/

## API

### add

http://[::]:8080/api/tweet/add?{"post":"test","user":"a"}

### list

http://[::]:8080/api/tweet/list

## test

```sh
deno test -A --unstable
```

## links

- [ご意見、ご要望](../../issues)
- [How to setup the server](README-server.md)
