import ordersModel from '../models/orders.model.js';

export default class OrderManager {
    addOrder = async (order) => {
        try {
            const createdOrder = await ordersModel.create(order);
            return createdOrder;
        } catch (error) {
            console.log(error);
        }
    };

    getOrders = async () => {
        try {
            const orders = await ordersModel.find().lean();
            return orders;
        } catch (error) {
            console.log(error);
        }
    };

    getOrderById = async (id) => {
        try {
            const order = await ordersModel.findOne({ _id: id }).lean();
            return order;
        } catch (error) {
            console.log(error);
        }
    };

    deleteOrder = async (id) => {
        try {
            const deletedOrder = await ordersModel.deleteOne({ _id: id });
            return deletedOrder;
        } catch (error) {
            console.log(error);
        }
    };

    updateOrder = async (id, changes) => {
        try {
            const updatedOrder = await ordersModel.updateOne(
                { _id: id },
                changes
            );
            return updatedOrder;
        } catch (error) {
            console.log(error);
        }
    };

    getOrdersByStatus = async (status) => {
        try {
            const orders = await ordersModel.find({ status: status }).lean();
            return orders;
        } catch (error) {
            console.log(error);
        }
    };

}