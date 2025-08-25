import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { loginUser, registerUser } from "../authSlice";
import { useEffect, useState } from "react";

const loginSchema = z.object({
    email_id: z.string().email("invalid email"),
    password: z.string().min(8, "Password should contain 8 characters"),
});

function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();



    const { isAuthenticated, loading, error, } = useSelector(
        (state) => state.auth
    );





    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(loginSchema) });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate])




    const onSubmit = (data) => {
        dispatch(loginUser(data));
    };


    // --- NO CHANGES ABOVE THIS LINE ---

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] flex flex-col justify-center items-center p-4 font-sans">
            <div className="relative z-10 w-full max-w-4xl animate-[fadeIn_0.5s_ease-in-out]">

                <div className="card w-full bg-white shadow-2xl border border-gray-200/60 rounded-2xl flex flex-col md:flex-row overflow-hidden">

                    {/* Left side with Illustration - Hidden on mobile */}
                    <div className="hidden md:flex w-1/2 bg-gray-50 p-10 items-center justify-center">
                        <svg className="w-full h-auto max-w-sm" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z" fill="#EFF6FF" />
                            <path d="M348.697 218.473V181.72C348.697 131.026 307.67 90 256.977 90C206.283 90 165.256 131.026 165.256 181.72V218.473H139.909V363.091H374.045V218.473H348.697ZM201.909 181.72C201.909 150.686 226.595 126.001 256.977 126.001C287.358 126.001 312.044 150.686 312.044 181.72V218.473H201.909V181.72Z" fill="#BFDBFE" />
                            <path d="M256.977 326.445C274.634 326.445 288.932 312.147 288.932 294.49C288.932 276.833 274.634 262.535 256.977 262.535C239.32 262.535 225.022 276.833 225.022 294.49C225.022 312.147 239.32 326.445 256.977 326.445Z" fill="#4C51BF" />
                            <path d="M304.545 422H209.409C198.136 422 189 412.864 189 401.591V382.727C189 362.433 205.433 346 225.727 346H288.227C308.521 346 324.955 362.433 324.955 382.727V401.591C324.955 412.864 315.818 422 304.545 422Z" fill="#A3BFFA" />
                        </svg>
                    </div>

                    {/* Right side with Form - Your exact code is here */}
                    <div className="w-full md:w-1/2">
                        <div className="h-full flex flex-col justify-center"> {/* This ensures vertical centering */}
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="card-body p-8 sm:p-10"
                                noValidate
                            >
                                <h1 className="text-3xl font-bold text-center mb-1 text-gray-800">
                                    Welcome Back
                                </h1>
                                <p className="text-center text-gray-500 mb-6">Login to continue to Codex.</p>

                                <div className="form-control w-full">
                                    <label className="label">
                                        <span className="label-text text-black">Email Address</span>
                                    </label>
                                    <input
                                        {...register("email_id")}
                                        type="email"
                                        placeholder="your.email@example.com"
                                        autoComplete="email"
                                        className={`input input-bordered w-full h-12 bg-gray-100 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 ${errors.email_id
                                            ? 'input-error border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : ''}`}
                                    />
                                    {errors.email_id && (
                                        <label className="label pt-1">
                                            <span className="label-text-alt text-red-600 font-medium">{errors.email_id.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control w-full mt-4">
                                    <label className="label">
                                        <span className="label-text text-gray-600">Password</span>
                                    </label>
                                    <div className="relative w-full">
                                        <input
                                            {...register("password")}
                                            placeholder="Enter Password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            className={`input input-bordered w-full h-12 pr-12 bg-gray-100 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 ${errors.password
                                                ? 'input-error border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-gray-800"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-10-7-10-7a17.57 17.57 0 014.4-5.4M19.769 14.769C20.932 13.376 22 12 22 12s-3-7-10-7c-.897 0-1.757.106-2.57.3" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <label className="label pt-1">
                                            <span className="label-text-alt text-red-600 font-medium">{errors.password.message}</span>
                                        </label>
                                    )}
                                </div>

                                <div className="form-control mt-8 w-full text-center">
                                    <button type="submit" className="btn bg-gray-800 text-white hover:bg-red-500 border-0 h-12 text-base active:scale-[0.98] transition-transform duration-200 ease-in-out px-10">
                                        {loading ? <span className="loading loading-spinner"></span> : "Login"}
                                    </button>
                                </div>

                                <div className="divider text-sm my-4 text-gray-400">OR</div>

                                <p className="text-center text-sm text-gray-600">
                                    Don't have an account?
                                    <Link to="/signup" className="link link-hover text-gray-800 font-medium ml-1 transition-colors duration-200 hover:text-gray-900 hover:underline">
                                        Sign up now
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
}

export default Login;