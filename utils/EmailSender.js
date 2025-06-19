const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
   
   try{
    // const transporter = nodemailer.createTransport({
    //     host:process.env.SMTP_HOST,
    //     port:parseInt(process.env.SMTP_PORT,10),
    //     secure:true,
    //     auth: {
    //         user: process.env.SMTP_USER, 
    //         pass: process.env.SMTP_PASSWORD, 
    //     },
    // });
    const transporter = nodemailer.createTransport({
        service: 'Gmail',  
        auth: {
            user: process.env.EMAIL_USERNAME, 
            pass: process.env.EMAIL_PASSWORD, 
        },
    });
    const mailOptions = {
        from: 'ILearner <info@ILearner.edu>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    const info=await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
   }catch(error){
    console.log('Error sending email:', error.message);
   }
};

module.exports = sendEmail;
