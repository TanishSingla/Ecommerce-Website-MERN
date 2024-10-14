import { useState } from "react"
import { motion } from 'framer-motion'
import { Link, useNavigate } from "react-router-dom"
import { LogIn, Mail, Lock, ArrowRight, Loader } from "lucide-react"
import InputFields from "../components/InputFields"
import { useUserStore } from "../store/useUserStore"

const LoginPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login, user, loading, success } = useUserStore()
    const handleSubmit = (e) => {
        e.preventDefault();

        login(email, password);
        if (success) {

            console.log("boom", success);
            navigate("/");
        }
    }
    return (
        <>
            <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
                <motion.div
                    className='sm:mx-auto sm:w-full sm:mx-w-md'
                    initial={{ opacity: 0, y: -25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9 }}
                >
                    <h2 className='mt-6 text-center  text-3xl font-extrabold text-emerald-400'>
                        Login Here
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

                            {/* Email */}
                            <InputFields
                                label="Email"
                                Logo={Mail}
                                id="email"
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {/* password */}
                            < InputFields
                                label="Password"
                                Logo={Lock}
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                            <LogIn className='mr-2 h-5 w-5' aria-hidden='true' />
                                            Login
                                        </>
                                    )
                                }
                            </button>
                        </form>
                        <p className='mt-8 text-center text-sm text-gray-400'>
                            Don't have an account? {" "}
                            <Link to="/signup" className='font-medium text-emerald-400 hover:text-emerald-300' >
                                Signup now <ArrowRight className='inline h-4 w-4' />
                            </Link>
                        </p>

                    </div>
                </motion.div>

            </div>
        </>
    )
}

export default LoginPage
