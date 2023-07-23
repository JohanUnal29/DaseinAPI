import { Router } from "express";
import OrderManager from "../DAO/dbManagers/orders.js";

const router = Router();
const manager = new OrderManager();


router.get("/", async (req, res) => {
    const orders = await manager.getOrders();

    if (!orders) {
        return res
            .status(404)
            .send({ status: "Error", error: "orders was not found" });
    }
    return res.send({
        status: "sucess",
        message: "order found",
        payload: orders,
    });
});

router.get("/id/:pid", async (req, res) => {
    const orderId = req.params.pid;
    const order = await manager.getOrderById(orderId);
    if (!order) {
        return res
            .status(404)
            .send({ status: "Error", error: "order was not found" });
    }
    return res.send({
        status: "sucess",
        message: "order found",
        payload: order,
    });
});

router.get("/status/:status", async (req, res) => {
    const ordersStatus = req.params.status;
    const orders = await manager.getOrdersByStatus(ordersStatus);

    if (!orders) {
        return res
            .status(404)
            .send({ status: "Error", error: "order was not found" });
    }
    return res.send({
        status: "sucess",
        message: "order found",
        payload: orders,
    });
});

router.post("/addorder", async (req, res) => {
    const { name, email, phone, message, cart, totalPrice } = req.body;

    if (!name || !email || !phone || !cart || !totalPrice) {
        return res.status(400).send({
            status: "Error",
            error: "Error, missing required fields for the order",
        });
    }

    const order = {
        name,
        email,
        phone,
        message,
        cart: cart.map(item => ({
            _id: item._id,
            title: item.title,
            code: item.code,
            thumbnails: item.thumbnails,
            quantity: item.cantidad,
            price: item.price,
        })),
        totalPrice,
    };

    try {
        await manager.addOrder(order);
        return res.send({ status: "OK", message: "Order successfully added" });
    } catch (error) {
        return res.status(500).send({
            status: "Error",
            error: "Error, failed to add the order",
        });
    }
});


router.delete("/:pid", async (req, res) => {
    const orderId = req.params.pid;
    const deletedOrder = await manager.deleteOrder(orderId);

    if (!deletedOrder) {
        return res
            .status(404)
            .send({ status: "Error", error: "Order does not exist" });
    }
    return res.send({ status: "OK", message: "Order deleted successfully" });
});

router.put("/:pid", async (req, res) => {
    const orderId = req.params.pid;
    const changes = req.body;

    const updatedOrder = await manager.updateOrder(orderId, changes);

    if (!updatedOrder) {
        return res
            .status(404)
            .send({ status: "Error", error: "Order was not found" });
    }
    return res.send({
        status: "OK",
        message: "Order succesfully updated",
    });
});

export default router;