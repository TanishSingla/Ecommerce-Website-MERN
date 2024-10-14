import { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react'
import { motion } from 'framer-motion';



const InputFields = ({ label, Logo, id, type, value, onChange, placeholder }) => {
    return (
        <>
            <div className='mt-2 '>
                <label htmlFor="name" className='block text-sm font-medium text-gray-300'>
                    {label}
                </label>
                <div className='mt-1 relative rounded-md shadow-sm'>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Logo className='h-5 w-5 text-gray-400' aria-hidden='true' />
                    </div>
                    <input
                        id={id}
                        type={type}
                        required
                        value={value}
                        onChange={onChange}
                        className='block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                        placeholder={placeholder}
                    />
                </div>
            </div>
        </>
    )
}

export default InputFields
