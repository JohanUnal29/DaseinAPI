import { Router } from "express";
import ProductManager from "../DAO/dbManagers/products.js";

const router = Router();
const manager = new ProductManager();

router.post("/addproduct", async (req, res) => {
    const { title, description, code, price, status, stock, category, subCategory, thumbnails } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category || !subCategory || !thumbnails) {
        return res.status(400).send({
            status: "Error",
            error: "Error, missing required fields for the order",
        });
    }

    const add = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        subCategory,
        thumbnails,
    };

    try {
        await manager.addProduct(add);
        return res.send({ status: "OK", message: "Order successfully added" });
    } catch (error) {
        return res.status(500).send({
            status: "Error",
            error: "Error, failed to add the add",
        });
    }
});

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

router.get("/:category", async (req, res) => {
    const productsCategory = req.params.category;
    const products = await manager.getProductsByCategory(productsCategory);

    if (!products) {
        return res
            .status(404)
            .send({ status: "Error", error: "product was not found" });
    }
    return res.send({
        status: "sucess",
        message: "product found",
        payload: products,
    });
});

router.get("/id/:pid", async (req, res) => {
    const productId = req.params.pid;
    const product = await manager.getProductById(productId);
    console.log(productId);
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