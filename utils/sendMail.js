const nodeMailer=require('nodemailer');

const sendMail= async (email,subject,text)=>{

    var transporter= nodeMailer.createTransport({
        service:process.env.SMTP_SERVICE,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
    });

    const option={
        from:process.env.SMTP_USER,
        to:email,
        subject,
        text

    }

    await transporter.sendMail(option);

}

module.exports=sendMail;