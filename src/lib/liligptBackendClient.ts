class LiliGPTBackendClient {
  private url: string;

  constructor() {
    this.url = process.env.NEXT_PUBLIC_LILIGPT_BACKEND_URL!;
  }

  async sendAuthToVscode(payload: ISendAuthToVscode) {
    // TODO: add authentication
    const response = await fetch(`${this.url}/vscode/send-auth-to-vscode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Failed to send auth to vscode', response);
      throw new Error("Failed to send auth to vscode");
    }
  }
}

export interface ISendAuthToVscode {
  nonce: string;
  accessToken: string;
  refreshToken: string;
}

export const liligptBackendClient = new LiliGPTBackendClient();
