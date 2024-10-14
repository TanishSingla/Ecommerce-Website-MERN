import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';




const useProductsStore = create((set) => ({

    products: [],
    loading: false,
    setProducts: (products) => set({ products }),
    createProduct: async (prodData) => {
        set({ loading: true });
        try {
            const res = await axios.post('/products', prodData);
            set((prevstate) => ({
                products: [...prevstate.products, res.data],
                loading: false
            }))
        } catch (error) {
            toast.error(error.res.data.error);
            set({ loading: false });
        }

    },
    deleteProduct: async (id) => {
        set({ loading: true })
        try {
            await axios.delete(`/products/${id}`)
            set((prevstate) => ({
                products: prevstate.products.filter((product) => product._id !== id),
                loading: false
            }))
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error(error.res.data.error)
            set({ loading: false });
            toast.error(`Error in deleting the product,${error.message}`);
        }
    },
    toggleFeatured: async (productId) => {
        set({ loading: true })
        try {
            const response = await axios.patch(`/products/${productId}`);
            console.log(response)
            set((prevstate) => ({
                products: prevstate.products.map((product) =>
                    product._id === productId
                        ? { ...product, isFeatured: response.data.isFeatured }
                        : product
                ),
                loading: false
            }))
            toast.success('Product updated successfully');
        } catch (error) {
            toast.error({ loading: false });
            console.log(`Error in toggling featured, ${error}`);
            set({ loading: false })
            toast.error(`Error while updating the product ${error.message}`);
        }
    },
    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get('/products');
            set({ products: response.data.products, loading: false });
        } catch (error) {
            toast.error(error.message || 'Failed to fetch all products');
            set({ loading: false });
            console.log(`Error in fetching all products, ${error}`)
        }
    },
    fetchProductByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${category}`);

            set({ products: response.data.products, loading: false });
        } catch (error) {
            toast.error(error.message || 'Failed to fetch products by category');
            set({ loading: false });
            console.log(`Error in fetching products by category, ${error}`)
        }
    },
    fetchFeaturedProducts: async () => {
        try {
            set({ loading: true });
            const resp = await axios.get('/products/featured');
            set({ products: resp.data });
        } catch (error) {
            console.log(error);
            toast.error('Error in fetching featured products');
        } finally {
            set({ loading: false });
        }
    }
}));

export default useProductsStore;
