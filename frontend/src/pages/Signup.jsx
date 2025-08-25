import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { registerUser } from "../authSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router";

const signupSchema = z.object({
    first_name: z.string().min(3, "Name should contain atleast 3 char"), //error
    email_id: z.string().email("invalid email"),
    password: z.string().min(8, "Password should contain 8 characters"), //error
});
function Signup() {
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();



    const { isAuthenticated, loading, error
    } = useSelector((state) => state.auth);



    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: zodResolver(signupSchema) });




    useEffect(() => {
        if (isAuthenticated) {

            navigate('/');
        }
    }, [isAuthenticated, navigate])



    const onSubmit = (data) => {
        console.log("Form Data Submitted:", data);
        dispatch(registerUser(data));
    };



    return (
        <>
            { /* <form
        onSubmit={handleSubmit(submittedData)}
        className="min-h-screen flex flex-col justify-center items-center gap-y-2 max-w-xl ml-50"
      >
        <input {...register("first_Name")} placeholder="Enter Name" />
        {errors.first_Name && <span>{errors.first_Name.message}</span>}
        {/* pehla condition true hai toh dusra output me dedagaaaaaa.........
        aur agar pehla false hai toh vahi return aa jatab haiiiiiiiiiiiii simillarly (true ? return ):NULL */}

            {/* <input {...register("email_id")} placeholder="email" />
        <input
          {...register("password")}
          placeholder="enter password"
          type="password"
        />

        <button type="submit" className="btn btn-lg">
          Submit
        </button>
      </form>  */}
            <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] flex flex-col justify-center items-center p-4 font-sans">
                <div className="relative z-10 w-full max-w-4xl animate-[fadeIn_0.5s_ease-in-out]">

                    <div className="card w-full bg-white shadow-2xl border border-gray-200/60 rounded-2xl flex flex-col md:flex-row overflow-hidden">

                        {/* Left side with Illustration - Hidden on mobile */}
                        <div className="hidden md:flex w-1/2 bg-gray-50 p-10 items-center justify-center">
                            <svg className="w-full h-auto" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z" fill="#F0F9FF" />
                                <path d="M288.586 163.657C288.586 156.883 283.023 151.32 276.249 151.32H181.72C174.946 151.32 169.383 156.883 169.383 163.657V181.72C169.383 188.494 174.946 194.057 181.72 194.057H276.249C283.023 194.057 288.586 188.494 288.586 181.72V163.657Z" fill="#D1E9FF" />
                                <path d="M342.617 236.32C342.617 229.546 337.054 223.983 330.28 223.983H181.72C174.946 223.983 169.383 229.546 169.383 236.32V254.383C169.383 261.157 174.946 266.72 181.72 266.72H330.28C337.054 266.72 342.617 261.157 342.617 254.383V236.32Z" fill="#D1E9FF" />
                                <rect x="256" y="293" width="86" height="121" rx="12" fill="#4A5568" />
                                <rect x="169" y="323" width="86" height="91" rx="12" fill="#718096" />
                                <path d="M304 224C320.569 224 334 209.033 334 191C334 172.967 320.569 158 304 158C287.431 158 274 172.967 274 191C274 209.033 287.431 224 304 224Z" fill="#2D3748" />
                                <path d="M211 278C232.508 278 249 259.011 249 237.5C249 215.989 232.508 197 211 197C189.492 197 173 215.989 173 237.5C173 259.011 189.492 278 211 278Z" fill="#2D3748" />
                            </svg>
                        </div>

                        {/* Right side with Form */}
                        <div className="w-full md:w-1/2">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="card-body p-8 sm:p-10"
                                noValidate
                            >
                                <h1 className="text-3xl font-bold text-center mb-1 text-gray-800">
                                    Create an Account
                                </h1>
                                <p className="text-center text-gray-500 mb-6">Let's get you started!</p>

                                <div className="form-control w-full">
                                    <label className="label"><span className="label-text text-gray-600">Full Name</span></label>
                                    <input
                                        {...register("first_name")}
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        className={`input input-bordered w-full h-12 bg-gray-100 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 ${errors.first_name ? 'input-error border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                    {errors.first_name && <label className="label pt-1"><span className="label-text-alt text-red-600 font-medium">{errors.first_name.message}</span></label>}
                                </div>

                                <div className="form-control w-full mt-2">
                                    <label className="label"><span className="label-text text-gray-600">Email Address</span></label>
                                    <input
                                        {...register("email_id")}
                                        type="email"
                                        placeholder="your.email@example.com"
                                        autoComplete="email"
                                        className={`input input-bordered w-full h-12 bg-gray-100 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 ${errors.email_id ? 'input-error border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    />
                                    {errors.email_id && <label className="label pt-1"><span className="label-text-alt text-red-600 font-medium">{errors.email_id.message}</span></label>}
                                </div>

                                <div className="form-control w-full mt-2">
                                    <label className="label"><span className="label-text text-gray-600">Password</span></label>
                                    <div className="relative w-full">
                                        <input
                                            {...register("password")}
                                            placeholder="Create a strong password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            className={`input input-bordered w-full h-12 pr-12 bg-gray-100 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 ${errors.password ? 'input-error border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
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
                                    {errors.password && <label className="label pt-1"><span className="label-text-alt text-red-600 font-medium">{errors.password.message}</span></label>}
                                </div>

                                <div className="form-control mt-8 w-full text-center">
                                    <button type="submit" className="btn bg-gray-800 text-white hover:bg-red-500 border-0 h-12 text-base active:scale-[0.98] transition-transform duration-200 ease-in-out px-10">
                                        {loading ? <span className="loading loading-spinner"></span> : "Create Account"}
                                    </button>
                                </div>

                                <div className="divider text-sm my-4 text-gray-400">OR</div>

                                <p className="text-center text-sm text-gray-600">
                                    Already have an account?
                                    <Link to="/login" className="link link-hover text-gray-800 font-medium ml-1 transition-colors duration-200 hover:text-gray-900 hover:underline">
                                        Login now
                                    </Link>
                                </p>
                            </form>
                        </div>

                    </div>
                </div>
            </div>



        </>
    );
}

export default Signup;

/////37:44
// import { useEffect, useState } from "react";

// function Signup() {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();

//         console.log(name, email, password);
//         //validation
//         //  reenter password

//         //form ko submit kar denge

//         //backend submit
//     }
//     return (
//         <>
//             <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-3">
//                 <input type="text" value={name} placeholder="Enter Your Name" onChange={(e) => setName(e.target.value)}></input>
//                 <input type="email" value={email} placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)}></input>
//                 <input type="password" value={password} placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)}></input>
//                 <button type="submit">Submit</button>
//             </form>

//         </>
//     )
// }
