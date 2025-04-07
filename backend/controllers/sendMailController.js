import nodemailer from 'nodemailer';

export const sendMail = async (req, res) => {
    const { fullName, email, phone, title } = req.body; // добавили courseTitle

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "osmangamidov026@gmail.com", // твой email
            pass: "jkra cjsu njhk hcjl",
        }
    });

    const mailOptions = {
        from: `"Сайт Курсов" <yourgmail@gmail.com>`,
        to: 'osmangamidov025@gmail.com',
        subject: `Новая заявка на курс: ${title}`,
        text: `ФИО: ${fullName}\nEmail: ${email}\nТелефон: ${phone}\nКурс: ${title}`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Заявка отправлена успешно' });
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        res.status(500).json({ message: 'Ошибка сервера при отправке письма' });
    }
};
