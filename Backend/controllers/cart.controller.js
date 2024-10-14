import Product from "../models/product.model.js";
export const addToCart = async (req, resp) => {

    try {
        const { productId } = req.body;
        const user = req.user;

        const exisintItem = user.cartItems.find(item => item.id === productId);

        if (exisintItem) {
            exisintItem.quantity++;
        } else {
            user.cartItems.push(productId);
        }
        await user.save();

        return resp.status(200).json(user.cartItems);
    } catch (error) {
        console.log(`Error in adding items to the cart ${error}`);
        resp.status(500).json({
            message: `Erorr in adding items to the cart error:${error.message}`,
            error: error.message
        });
    }
}

export const removeAllFromCart = async (req, resp) => {

    try {
        const { productId } = req.body;
        const user = req.user;
        if (user && productId) {
            user.cartItems = user.cartItems.filter((item) => item.id !== productId)
            await user.save();
            return resp.status(200).json({ message: "Cart emptied successfully" });
        }
        resp.status(500).json({
            message: "Error in emptying cart, (try login again)"
        })
    } catch (error) {
        return resp.status(500).json({
            message: `Error in emptying cart, ${error.message}`,
        })
    }

}

export const updateQuantity = async (req, resp) => {

    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find((item) => item.id === productId);

        if (existingItem) {
            if (quantity === 0) {
                //when the user decrese any car item quantity to 0, it should be removed from the cart
                user.cartItems = user.cartItems.filter((item) => item.id !== productId);
                await user.save();
                return resp.status(200).json(user.cartItems);
            }
            existingItem.quantity = quantity;
            await user.save();
            return resp.status(200).json(user.cartItems);
        } else {
            resp.status(400).json({
                message: `Item not found in the cart`
            })
        }
    } catch (error) {
        console.log(`Error in updating quantity ${error}`);
        return resp.status(500).json({
            message: `Error in updating quantity ${error.message}`,
        })
    }

}

export const getCartProducts = async (req, resp) => {

    try {
        const products = await Product.find({ _id: { $in: req.user.cartItems } });

        //add quantity for each item
        const cartItems = products.map(product => {
            const item = req.user.cartItems.find(cartItem => cartItem.id === product.id);
            return { ...product.toJSON(), quantity: item?.quantity };
        })
        resp.json(cartItems);
    } catch (error) {
        console.log(`Error in getting cart products ${error}`);
        return resp.status(500).json({
            message: `Error in getting cart products ${error.message}`,
        });
    }

}