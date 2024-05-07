import mongoose from 'mongoose';

const orderCollection = 'orders';

const orderSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        default: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true
    }
});

const orderModel = mongoose.model(orderCollection, orderSchema);

export default orderModel;
