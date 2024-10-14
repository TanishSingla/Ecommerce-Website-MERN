import { create } from 'zustand';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    loading: false,
    isCouponApplied: false,

    getMyCoupon: async () => {
        try {
            const res = await axios.get('/coupons');
            set({ coupon: res.data });
        } catch (error) {
            console.log(`Error while fetching coupons ${error}`);
        }
    },

    applyCoupon: async (code) => {
        try {
            console.log(code);
            const response = await axios.post('/coupons/validate', { code });
            set({ coupon: response.data, isCouponApplied: true });
            get().calculateTotal();
            toast.success('Coupon applied successfully');
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid Coupon");
        }
    },

    removeCoupon: async () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotal();
        toast.success('Coupon removed');
    },
    getCartItems: async () => {
        try {
            const res = await axios.get('/cart');
            set({ cart: res.data });
            get().calculateTotal();  // Corrected: get() instead of get
        } catch (error) {
            set({ cart: [] });
            toast.error(error?.response?.data?.message || 'Error in getting Cart items');
        }
    },
    addToCart: async (product) => {
        try {

            const res = await axios.post('/cart', { productId: product._id });

            //basically what we are doing here is, if we already have the product
            //in cart then we will simply increment its counter,
            //else we will add it to the cart with 1 as the value.
            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            // Call calculateTotal after updating the cart
            get().calculateTotal();
            toast.success('Item added to cart');
        } catch (error) {
            toast.error(error.message || 'Error in adding item to cart');
        }
    },
    clearCart: async () => {
        set({ cart: [], coupon: null, total: 0, subtotal: 0 });
    },
    removeFromCart: async (productId) => {
        try {
            const res = await axios.delete(`/cart`, { data: { productId } });
            set(prevState => ({ cart: prevState.cart.filter(item => item._id !== productId) }));
            get().calculateTotal();
        } catch (error) {
            console.log('Error while removing items from cart', error);
        }
    },
    updateQuantity: async (productId, quantity) => {
        try {
            if (quantity == 0) {
                get().removeFromCart(productId);
                return;
            }
            const res = await axios.put(`/cart/${productId}`, { quantity });

            set((prevState) => ({
                cart: prevState.cart.map((item) =>
                    item._id === productId ? { ...item, quantity } : item
                ),
            }));
            get().calculateTotal();
        } catch (error) {

        }
    },
    calculateTotal: () => {
        const { cart, coupon } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        let total = subtotal;

        if (coupon) {
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({ subtotal, total });
    },
}));
