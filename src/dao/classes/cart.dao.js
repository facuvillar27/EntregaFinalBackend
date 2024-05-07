import cartsModel from "../models/carts.model.js";

class CartsDao {
    getAll = async () =>{
        try {
            let carts = await cartsModel.find().lean();
            return carts;
        } catch (error) {
            console.error('Error getting carts:', error);
        }
    }

    getById = async(id) =>{
        try {
            let cart = await cartsModel.findById(id).lean();
            return cart;
        } catch (error) {
            console.error('Error getting cart by id:', error);
        }
    }

    createCart = async cart =>{
        try {
            let result = await cartsModel.create(cart);
            return result;
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    updateCart = async (id, cart) =>{
        try {
            let result = await cartsModel.updateOne({ _id: id }, cart);
            return result;
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    }

    emptyCart = async (id, cart) =>{
        try {
            let result = await cartsModel.updateOne({ _id: id }, cart);
            return result;
        } catch (error) {
            console.error('Error emptying cart:', error);
        }
    }

    populateCart = async (id, cart) =>{
        try {
            let result = await cartsModel.findById(id).populate('products.product');
            return result;
        } catch (error) {
            console.error('Error populating cart:', error);
        }
    }
}

export default CartsDao;