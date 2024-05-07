import mongoose from 'mongoose';

const cartCollection = 'carts';

const CartSchema = new mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: {
                    type: Number,
                },
            },
        ],
        default: [],
    },
});

CartSchema.pre('find', function() {
    this.populate('products.product');
});

const cartsModel = mongoose.model(cartCollection, CartSchema);

export default cartsModel;