# さばつい (sabatwi)

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple, lightweight, Twitter-like microblogging platform built with Deno. It features real-time updates via Web Push notifications and persists data using Deno KV.

- **Live Demo:** [sabatwi.com](https://sabatwi.com/)
- **Issues/Feedback:** [GitHub Issues](../../issues)

## Features

- Post and view short messages (tweets)
- Like and reply to posts
- Real-time Web Push notifications for new activity
- Persistent storage using Deno KV (SQLite backend)
- Simple, dependency-free frontend
- Includes a server setup guide for Nginx with Let's Encrypt SSL

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) 1.x

### Local Development

1.  Clone the repository:
    ```sh
    git clone https://github.com/code4fukui/sabatwi.git
    cd sabatwi
    ```

2.  Start the server:
    ```sh
    deno run -A --unstable --watch sabatwi.js 8080
    ```

3.  Open your browser and navigate to [http://localhost:8080](http://localhost:8080).

### Server Deployment

For instructions on deploying to a production server using Nginx, Certbot, and running the application as a service, see the [Server Setup Guide](README-server.md).

## API Reference

The API expects a single URL-encoded JSON object as a query parameter for GET requests, or a JSON body for POST requests.

### Tweets

-   **List Tweets**
    -   `GET /api/tweet/list`
    -   Returns a JSON array of all tweet objects.

-   **Add a Tweet, Reply, or Like**
    -   `GET /api/tweet/add`
    -   **Query Parameter:** A URL-encoded JSON object.
    -   **Payload:**
        -   `{ "user": "username", "tweet": "message" }` - To post a new tweet.
        -   `{ "user": "username", "tweet": "comment", "replyid": "tweet_id" }` - To reply.
        -   `{ "user": "username", "likeid": "tweet_id" }` - To like a tweet.
    -   **Example:** `/api/tweet/add?{%22tweet%22:%22Hello%20world!%22,%22user%22:%22deno_fan%22}`

### Web Push Notifications

-   **Subscribe**
    -   `POST /api/subscribe`
    -   **Body:** A standard `PushSubscription` JSON object from the browser's Push API.
    -   Returns a `{ "uuid": "..." }` to identify the subscription.

-   **Unsubscribe**
    -   `POST /api/unsubscribe`
    -   **Body:** `{ "uuid": "subscription_uuid" }`
    -   Removes the specified subscription.

### Health Check

-   **Check Status**
    -   `GET /api/health`
    -   Returns `"ok"` if the server is running.

## Credits

-   **Source Code:** [sabatwi on GitHub](https://github.com/code4fukui/sabatwi/)
-   **Logo:** by [山田ちあり](https://www.instagram.com/charlie.marguerite/)
-   **Icons:** by [Google Material design icons](https://github.com/code4fukui/material-design-icons)

## License

This project is available under the MIT License.