import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion';
import InputFields from '../components/InputFields';
import { useUserStore } from '../store/useUserStore';

const SignupPage = () => {


    // const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });


    const { signup, user, loading } = useUserStore()

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(formData);
    }

    return (
        <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <motion.div
                className='sm:mx-auto sm:w-full sm:mx-w-md'
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
            >
                <h2 className='mt-6 text-center  text-3xl font-extrabold text-emerald-400'>
                    Create Your Account
                </h2>
            </motion.div>

            <motion.div
                className='mt-8 sm:mx-auto sm:w-full sm:max-w-md    '
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
            >
                <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit} className='spance-y-6'>

                        {/* name */}
                        <InputFields
                            label="Full name"
                            Logo={User}
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {/* Email */}
                        <InputFields
                            label="Email"
                            Logo={Mail}
                            id="email"
                            type="email"
                            placeholder="example@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {/* password */}
                        <InputFields
                            label="Password"
                            Logo={Lock}
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        {/* confirm password */}
                        <InputFields
                            label="Confirm Password"
                            Logo={Lock}
                            id="confirmpassword"
                            type="password"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />

                        <button type='submit'

                            className='mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50'
                            disabled={loading}
                        >
                            {
                                loading ? (
                                    <>
                                        <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                                        Sign up
                                    </>
                                )
                            }
                        </button>
                    </form>
                    <p className='mt-8 text-center text-sm text-gray-400'>
                        Already have an account? {" "}
                        <Link to="/login" className='font-medium text-emerald-400 hover:text-emerald-300' >
                            Login here <ArrowRight className='inline h-4 w-4' />
                        </Link>
                    </p>

                </div>
            </motion.div>
        </div>
    )
}

export default SignupPage
