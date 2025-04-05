import DirectionModel from "../models/Direction.js"


export const create = async (req, res) => {
    try {
        const doc = new DirectionModel({
            title: req.body.title,
            tags: req.body.tags,
        })

        const direction = await doc.save()

        res.json(direction)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Не создана новая запись",
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const directions = await DirectionModel.find()

        res.json(directions)
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: "Не удалось получить статьи",
        })
    }
}

// export const getOne = async (req, res) => {
//     try {
//         const directionId = req.params.id

//         const direction = await DirectionModel.findById(directionId).lean().exec();

//         if (!direction) {
//             return res.status(404).json({
//                 message: "Направление не найдено"
//             });
//         }

//         res.json(direction)
//     } catch (error) {
//         console.log(error)
//         res.status(404).json({
//             message: "Не удалось получить статьи",
//         })
//     }
// }

// export const remove = async (req, res) => {
//     try {
//         const directionId = req.params.id;

//         const deletedDirection = await DirectionModel.findByIdAndDelete(directionId)


//         if (!deletedDirection) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Статья не найдена"
//             });
//         }

//         res.json({
//             success: true,
//             message: "Статья успешно удалена",
//             data: deletedDirection
//         });

//     } catch (error) {
//         console.error('Ошибка при удалении направления:', error);
//         res.status(500).json({
//             success: false,
//             message: "Не удалось удалить статью",
//         });
//     }
// };

// export const update = async (req, res) => {
//     try {
//         const directionId = req.params.id;

//         await DirectionModel.updateOne({
//             _id: directionId
//         }, {
//             title: req.body.title,
//             text: req.body.text,
//             tags: req.body.tags,
//             imageUrl: req.body.imageUrl,
//         })

//         res.json({ message: true })
//     } catch (error) {
//         console.error('Ошибка при удалении направления:', error);
//         res.status(500).json({
//             success: false,
//             message: "Не удалось удалить статью",
//         });
//     }
// }