import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, senderEmail, email, message } = await req.json();

    if (!name || !senderEmail || !email || !message) {
      return Response.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_SMTP_HOST,
      port: process.env.NEXT_PUBLIC_SMTP_PORT,
      secure: false, 
      auth: {
        user: process.env.NEXT_PUBLIC_SMTP_HOST,
        pass: process.env.NEXT_PUBLIC_SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: senderEmail,
      to: email,
      subject: `Message from ${name}`,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    return Response.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
