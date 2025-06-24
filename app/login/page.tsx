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

    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Validate Name
        if (!/^[A-Za-z ]{3,}$/.test(formData.name.trim())) {
            alert("Please enter your full name (only letters and spaces, min 3 characters).");
            setLoading(false);
            return;
        }

        // Validate Mobile
        if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            alert("Please enter a valid 10-digit Indian mobile number starting with 6-9.");
            setLoading(false);
            return;
        }

        // Validate UPI ID
        if (!/^[\w.-]+@[\w.-]+$/.test(formData.upi)) {
            alert("Please enter a valid UPI ID (e.g., name@bank).");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${BASE_URL}/api/register`, formData);
            if (response.data.success) {
                window.location.href = "/";
            } else {
                console.error("Registration failed:", response.data.message);
                alert("Join failed. Please try again.");
            }
        } catch (error: any) {
            console.error("API error:", error.response?.data || error.message);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex">
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <span className="ml-3 text-2xl font-bold text-white">Stream</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">Join the Contest</h2>
                        <p className="text-gray-400">Participate, get lucky, and win exciting cash rewards!</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Name
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
                                        inputMode="numeric"
                                        required
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter 10-digit mobile number"
                                    />
                                </div>
                            </div>

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
                                        placeholder="yourupi@bank"
                                    />
                                </div>
                                <p className="mt-1 text-xs text-gray-400">
                                    UPI used to enter the contest (e.g., name@paytm, number@upi)
                                </p>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${loading
                                    ? 'bg-green-700 cursor-not-allowed opacity-70'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900 transition-all duration-200 transform ${!loading ? 'hover:scale-[1.02] active:scale-[0.98]' : ''
                                    }`}
                            >
                                {loading ? "Joining..." : "Join Now"}
                            </button>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400">
                                By joining, you agree to our{' '}
                                <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
                                    Terms & Conditions
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
                                "Enter the contest with a small fee and stand a chance to win big! One lucky winner, chosen through a fair draw system, takes home the prize."
                            </blockquote>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">J</span>
                                </div>
                                <div className="ml-3">
                                    <div className="text-white font-medium">Joined Contestant</div>
                                    <div className="text-gray-400 text-sm">Excited to try my luck!</div>
                                </div>
                            </div>
                        </div>

                        <div className="absolute top-20 right-20 w-20 h-20 bg-green-500/20 rounded-full blur-xl"></div>
                        <div className="absolute bottom-20 left-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
