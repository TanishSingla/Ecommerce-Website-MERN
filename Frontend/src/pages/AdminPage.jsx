import React, { useEffect, useState } from 'react'
import { BarChart, PlusCircle, ShoppingBasket } from 'lucide-react'
import { motion } from 'framer-motion'
import AdminCreateProduct from '../components/AdminCreateProduct'
import AdminProductsList from '../components/AdminProductsList'
import AdminAnalytics from '../components/AdminAnalytics'
import useProductsStore from '../store/useProductsStore'

const tabs = [
    { id: 'create', label: 'Create Product', icon: PlusCircle },
    { id: 'products', label: 'Products', icon: ShoppingBasket },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
]
const AdminPage = () => {

    const { fetchAllProducts } = useProductsStore();

    useEffect(() => {
        try {
            fetchAllProducts();
        } catch (error) {
            console.log(error)
        }
    }, [fetchAllProducts]);

    const [activeTab, setActiveTab] = useState('create');
    return (
        <div className='min-h-screen  text-white relative overflow-hidden'>
            <div className="relative z-10 container mx-auto px-4 py-16">

                <motion.h1
                    className='text-4xl font-bold mb-8 text-emerald-400 text-center'
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Admin Dashboard
                </motion.h1>


                <div className="flex justify-center mb-8" >

                    {
                        tabs.map((tab) => (
                            <button key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center mx-2 transition-colors duration-200 px-4 py-2 rounded-md ${activeTab === tab.id ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {<tab.icon className='mr-2 h-5 w-5 ' />}
                                {tab.label}
                            </button>
                        ))
                    }
                </div>
                {activeTab === 'create' && <AdminCreateProduct />}
                {activeTab === 'products' && <AdminProductsList />}
                {activeTab === 'analytics' && <AdminAnalytics />}
            </div>
        </div>
    )
}

export default AdminPage
