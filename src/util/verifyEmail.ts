import dns from "dns";
import net from "net";

const SMTP_PORT = 25;

enum SMTPResponse {
  CONNECTED,
  HELO,
  MAIL_FROM,
  RCPT_TO,
}

function getDomain(email: string) {
  return email.split("@")[1];
}

function getMXName(email: string): Promise<string | null> {
  return new Promise((resolve) => {
    const domain = getDomain(email);

    dns.resolveMx(domain, (err, addresses) => {
      if (err) return resolve(null);
      const sorted = addresses.sort((a, b) => a.priority - b.priority);
      return resolve(sorted[0]?.exchange ?? null);
    });
  });
}

function verifyEmailWithSMTP(MXName: string, email: string) {
  return new Promise((resolve) => {
    const socket = net.createConnection(SMTP_PORT, MXName);
    let responses = 0;

    socket.on("data", (data) => {
      const response = data.toString();

      switch (responses) {
        case SMTPResponse.CONNECTED: {
          if (response.startsWith("220")) {
            socket.write(`HELO ${getDomain(email)}\r\n`);
          } else {
            socket.end();
            resolve(false);
          }

          break;
        }

        case SMTPResponse.HELO: {
          if (response.startsWith("250")) {
            socket.write(`MAIL FROM: <${email}>\r\n`);
          } else {
            socket.end();
            resolve(false);
          }

          break;
        }

        case SMTPResponse.MAIL_FROM: {
          if (response.startsWith("250")) {
            socket.write(`RCPT TO: <${email}>\r\n`);
          } else {
            socket.end();
            resolve(false);
          }

          break;
        }

        case SMTPResponse.RCPT_TO: {
          if (response.startsWith("250")) {
            socket.once("end", () => resolve(true));
            socket.write("QUIT\r\n");
            socket.end();
          } else {
            socket.end();
            resolve(false);
          }

          break;
        }
      }

      responses++;
    });

    socket.once("error", () => {
      socket.end();
      resolve(false);
    });
  });
}

export default async function verifyEmail(email: string) {
  const MXName = await getMXName(email);
  if (!MXName) return false;
  return verifyEmailWithSMTP(MXName, email);
}
