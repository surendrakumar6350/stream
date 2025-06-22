import PayU from "payu-websdk";

const isProduction = process.env.NODE_ENV_STREAM == "production";

const payuClient = new PayU(
  {
    key: isProduction ? process.env.PAYU_PROD_KEY : process.env.PAYU_TEST_KEY,
    salt: isProduction ? process.env.PAYU_PROD_SALT : process.env.PAYU_TEST_SALT,
  },
  isProduction ? "PROD" : "TEST"
);

export default payuClient;

export const generateHtml = (message: any) => {
  return `
      <html>
        <head>
          <meta http-equiv="refresh" content="20;url=/" />
          <style>
            body {
              font-family: sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background-color: #f8f8f8;
              text-align: center;
            }
            .card {
              background: white;
              padding: 2rem;
              border-radius: 12px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>${message}</h1>
            <p>You will be redirected to the stream in 20 seconds...</p>
            <p>If not, <a href="/">click here</a>.</p>
          </div>
        </body>
      </html>
    `;
}