import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // todo: configure email for usage
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, { $set: { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 } })
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, { $set: { forgotPasswordToken: hashedToken, forgotPasswordExpiry: Date.now() + 3600000 } })
        }

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.EMAILER_AUTH_USER,
                pass: process.env.EMAILER_AUTH_PASS
            }
        });
        const verifyEmailBody = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
        const resetPasswordBody = `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
            </p>`
        const mailOptions = {
            from: 'harsh.sajla2001@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? 'Verify Email' : 'Reset Password',
            html: emailType === 'VERIFY' ? verifyEmailBody : resetPasswordBody,
        }

        const mailRespone = await transport.sendMail(mailOptions)
        return mailRespone
    } catch (error: any) {
        throw new Error(error.message)
    }
}