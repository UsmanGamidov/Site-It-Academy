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

