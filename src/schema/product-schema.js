import Mongoose from '../../db.js';

const productSchema = new Mongoose.Schema(
    {
        name: String,
        description: String,
        price: Number,
        summary: String,
        stock: Number,
        filename: String
    },
    {
        collection: 'product',
        timestamps: true
    }
)

export default Mongoose.model('product', productSchema, 'product')