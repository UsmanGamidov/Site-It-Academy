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

    const adminMailOptions = {
        from: `"Сайт Курсов IT-Acadremy" <osmangamidov026@gmail.com>`,
        to: 'osmangamidov025@gmail.com',
        subject: `Новая заявка на курс: ${title}`,
        text: `ФИО: ${fullName}\nEmail: ${email}\nТелефон: ${phone}\nКурс: ${title}`
    };

    const userMailOptions = {
        from: `"Сайт Курсов IT-Acadremy" <osmangamidov026@gmail.com>`,
        to: email, // отправка на почту пользователя
        subject: `Вы записались на курс: ${title}`,
        text: `Здравствуйте, ${fullName}!\n\nВы успешно подали заявку на курс "${title}". Мы скоро с вами свяжемся.\n\nСпасибо!\n\nВаш телефон: ${phone}`
    };

    try {
        // Отправляем админу
        await transporter.sendMail(adminMailOptions);

        // Отправляем пользователю
        await transporter.sendMail(userMailOptions);

        res.status(200).json({ message: 'Заявка отправлена успешно' });
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        res.status(500).json({ message: 'Ошибка сервера при отправке письма' });
    }
};
