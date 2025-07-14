import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 587,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!
  }
});

export const sendVerificationEmail = async (to: string, token: string) => {
    const verifyUrl = `http://localhost:5173/Verificacion?token=${token}`;

  await transporter.sendMail({
    from: '"GameStore" <20220109@aloe.ulima.edu.pe>', // ← este es el que debes usar
    to,
    subject: 'Verifica tu cuenta',
    html: `
      <h2>Bienvenido a GameStore</h2>
      <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `
  });  
};
