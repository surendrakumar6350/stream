"use client"

import React, { useState } from 'react';
import { User, Phone, CreditCard, Zap } from 'lucide-react';
import axios from "axios";
import { BASE_URL } from '@/constants';

function Login() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        upi: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BASE_URL}/api/register`, formData);
            if (response.data.success) {
                window.location.href = "/";
            } else {
                console.error("Registration failed:", response.data.message);
                alert("Login Failed");
            }
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            alert("Login Failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">
            {/* Left side - Signup Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo and Header */}
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-bold text-white">PayFlow</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
                        <p className="text-gray-400">Get started with your payment journey</p>
                    </div>

                    {/* Signup Form */}
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            {/* Mobile Field */}
                            <div>
                                <label htmlFor="mobile" className="block text-sm font-medium text-gray-300 mb-2">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="mobile"
                                        name="mobile"
                                        type="tel"
                                        required
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            {/* UPI Field */}
                            <div>
                                <label htmlFor="upi" className="block text-sm font-medium text-gray-300 mb-2">
                                    UPI ID
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="upi"
                                        name="upi"
                                        type="text"
                                        required
                                        value={formData.upi}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="yourname@paytm"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-400">
                                    Enter your UPI ID (e.g., 9876543210@paytm, user@gpay)
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Terms */}
                        <div className="text-center">
                            <p className="text-xs text-gray-400">
                                By creating an account, you agree to our{' '}
                                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Right side - Feature Highlight */}
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10"></div>
                <div className="relative h-full flex items-center justify-center p-12">
                    <div className="max-w-lg">
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-4">
                                    <div className="w-20 h-3 bg-gray-600 rounded-full mb-2"></div>
                                    <div className="w-16 h-2 bg-gray-700 rounded-full"></div>
                                </div>
                            </div>
                            <blockquote className="text-gray-300 text-lg leading-relaxed mb-6">
                                "Seamless payments with instant UPI integration. The fastest way to get started with digital transactions."
                            </blockquote>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">P</span>
                                </div>
                                <div className="ml-3">
                                    <div className="text-white font-medium">PayFlow User</div>
                                    <div className="text-gray-400 text-sm">Digital Payment Expert</div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative elements */}
                        <div className="absolute top-20 right-20 w-20 h-20 bg-green-500/20 rounded-full blur-xl"></div>
                        <div className="absolute bottom-20 left-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;