import ApplicationModel from "../models/Application.js";

export const create = async (req, res) => {
    try {
        const doc = new ApplicationModel({
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            courseId: req.body.courseId,
            message: req.body.message,
            status: req.body.status,
            userId: req.body.userId,
        });

        const application = await doc.save();
        res.json(application);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Не удалось создать заявку",
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const applications = await ApplicationModel.find().populate('courseId').populate('userId');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Не удалось получить заявки",
        });
    }
};

export const getUserApplications = async (req, res) => {
    try {
        const userId = req.params.userId;
        const applications = await ApplicationModel.find({ userId }).populate('courseId');
        res.json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Не удалось получить заявки пользователя",
        });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        const result = await ApplicationModel.findByIdAndUpdate(applicationId, { status }, { new: true });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Не удалось обновить статус",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const applicationId = req.params.id;
        await ApplicationModel.findByIdAndDelete(applicationId);
        res.json({ message: "Заявка удалена" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Не удалось удалить заявку",
        });
    }
};
