import { Router } from "express";
import ProductManager from "../DAO/dbManagers/products.js";

const router = Router();
const manager = new ProductManager();

router.get("/", async (req, res) => {
    const products = await manager.getProducts();

    if (!products) {
        return res
            .status(404)
            .send({ status: "Error", error: "products was not found" });
    }
    return res.send({
        status: "sucess",
        message: "product found",
        payload: products,
    });
});

router.get("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const product = await manager.getProductById(productId);

    if (!product) {
        return res
            .status(404)
            .send({ status: "Error", error: "product was not found" });
    }
    return res.send({
        status: "sucess",
        message: "product found",
        payload: product,
    });
});

router.put("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const changes = req.body;

    const updatedProduct = await manager.updateProduct(productId, changes);

    if (!updatedProduct) {
        return res
            .status(404)
            .send({ status: "Error", error: "product was not found" });
    }
    return res.send({
        status: "OK",
        message: "Product succesfully updated",
    });
});

router.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const deletedProduct = await manager.deleteProduct(productId);

    if (!deletedProduct) {
        return res
            .status(404)
            .send({ status: "Error", error: "Product does not exist" });
    }
    return res.send({ status: "OK", message: "Product deleted successfully" });
});

export default router;