const Product = require("../models/product.model.js");
const { redis } = require("../lib/redis.js");
const cloudinary = require("../lib/cloudinary.js");

const getAllProduct = async (req, resp) => {
    try {
        const products = await Product.find({});
        resp.status(200).json({
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        resp.status(500).json({
            message: `Server Error, While fetching products, error: ${error.message}`,
            success: false,
        });
    }
};

const getFeaturedProducts = async (req, resp) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return resp.status(200).json(
                JSON.parse(featuredProducts)
            );
        }

        // fetch from mongodb else
        //.lean() return js obj instead of mongodb document
        featuredProducts = await Product.find({ featured: true }).lean();

        if (!featuredProducts) {
            return resp.status(404).json({
                message: "No Featured Products found",
                success: false
            });
        }
        // store in redis
        await redis.set("featured_products", JSON.stringify(featuredProducts));
        resp.status(200).json({ featuredProducts });
    } catch (error) {
        console.log(`Error in fetching featured Products, ${error.message}`);
        resp.status(500).json({
            error: error.message
        });
    }
};

const createProduct = async (req, resp) => {
    const { name, description, price, image, category } = req.body;
    try {
        let cloudinaryResp = null;

        if (image) {
            cloudinaryResp = await cloudinary.uploader.upload(image, { folder: "ecom_products" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image: cloudinaryResp?.secure_url,
            category
        });

        resp.status(201).json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        resp.status(500).json({
            message: `Server Error, While creating product, error: ${error.message}`,
            success: false,
        });
    }
};

const deleteProduct = async (req, resp) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            return resp.status(404).json({
                message: "Product doesn't exist",
                success: false
            });
        }

        if (product.image) {
            // deleting image from cloudinary
            const publicId = product?.image?.split("/")?.pop()?.split(".")[0];
            try {
                await cloudinary.uploader.destroy(`ecom_products/${publicId}`);
                console.log("Deleted image from cloudinary successfully");
            } catch (error) {
                console.log("Error in deleting image from cloudinary", error);
            }
        }

        await Product.findByIdAndDelete(id);
        resp.status(200).json({
            message: "Product deleted successfully",
            success: true
        });
    } catch (error) {
        console.log("Error in deleting product", error);
        resp.status(500).json({
            message: `Error while deleting product in server ${error.message}`,
            success: false
        });
    }
};

const getRecommendedProducts = async (req, resp) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {
                    size: 4,
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                }
            }
        ]);
        resp.json({ products });
    } catch (error) {
        console.log("Error in getting recommended products", error);
        resp.status(500).json({
            message: `Error while getting recommended products in server ${error.message}`,
            success: false
        });
    }
};

const getProductsByCategory = async (req, resp) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        return resp.status(200).json({
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.log("Error in getting products by category", error);
        resp.status(500).json({
            message: `Error while getting products by category in server ${error.message}`,
            success: false
        });
    }
};

const toggleFeatureproducts = async (req, resp) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();

            // update in redis
            await updateFeaturedProductsCache();
            return resp.status(200).json({
                message: "Product updated successfully",
                product
            });
        } else {
            console.log("Product Not found");
            return resp.status(500).json({
                message: "Error in updating product",
                success: false
            });
        }
    } catch (error) {
        console.log("Error in updating product", error);
        resp.status(500).json({
            message: "Error in updating product",
            error: error.message
        });
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in updating featured products cache", error);
    }
}

module.exports = {
    getAllProduct,
    getFeaturedProducts,
    createProduct,
    deleteProduct,
    getRecommendedProducts,
    getProductsByCategory,
    toggleFeatureproducts
};
