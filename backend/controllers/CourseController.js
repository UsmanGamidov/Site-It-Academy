import CourseModel from "../models/Course.js"


export const create = async (req, res) => {
    try {
        const doc = new CourseModel({
            title: req.body.title,
            description: req.body.description,
            courseTime: req.body.courseTime,
            grade: req.body.grade,
            popular: req.body.popular,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            reviews: req.body.reviews,

        })

        const course = await doc.save()

        res.json(course)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Не создан новый курс",
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const course = await CourseModel.find()

        res.json(course)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const courseId = req.params.id

        const course = await CourseModel.findById(courseId).lean().exec();

        if (!course) {
            return res.status(404).json({
                message: "Направление не найдено"
            });
        }

        res.json(course)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const remove = async (req, res) => {
    try {
        const courseId = req.params.id;

        const deletedCourse = await CourseModel.findByIdAndDelete(courseId)


        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Статья не найдена"
            });
        }

        res.json({
            success: true,
            message: "Статья успешно удалена",
            data: deletedCourse,
        });

    } catch (error) {
        console.error('Ошибка при удалении направления:', error);
        res.status(500).json({
            success: false,
            message: "Не удалось удалить статью",
        });
    }
};

export const update = async (req, res) => {
    try {
        const courseId = req.params.id;

        await CourseModel.updateOne({
            _id: courseId
        }, {
            title: req.body.title,
            description: req.body.description,
            courseTime: req.body.courseTime,
            grade: req.body.grade,
            popular: req.body.popular,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            reviews: req.body.reviews,
        })

        res.json({ message: true })
    } catch (error) {
        console.error('Ошибка при удалении направления:', error);
        res.status(500).json({
            success: false,
            message: "Не удалось удалить статью",
        });
    }
}