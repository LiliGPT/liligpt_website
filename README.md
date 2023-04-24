# LiliGPT Website

This is the website for LiliGPT. This project also acts as the authenticator provider for vscode.

## Login from VSCode

From vscode, open an external url to `/vscode/authenticate?nonce={nonce}`.

This will redirect the user to Keycloak.

After user logs in, the user will be redirected to `/vscode/callback?--todo--`.

When this happens, this project will make a POST request to `https://liligpt-backend.giovannefeitosa.com/vscode/send-auth-to-vscode`.

This will send the user's access token to vscode.
