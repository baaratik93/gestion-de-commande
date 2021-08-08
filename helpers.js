const jwt = require('jsonwebtoken')
const { Product } = require('./models')
exports.generateToken = (res, user) => {

    const key = jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        process.env.SECRET,
        {
            expiresIn: '1h'
        }
    )
    return key;
}

exports.FoundProduct = async (ProductProps) => {
    const type = Number(ProductProps)
    try {
        const isFound = type == NaN ? await Product.findOne({ where: { name: ProductProps } }) : await Product.findOne({ where: { id: ProductProps } })
        console.log(isFound)
        return isFound;
    } catch (error) {
        throw error
    }
}

exports.generateError = e => {
    for (let i of e.errors) {
        return i.message;
    }
}