import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { AuthContext } from "../context/authContext";


export default function Login() {

    const navigate = useNavigate();

    const {setAccessToken} = useContext(AuthContext);

    const [formData, setFormData]  = useState({
        email: '', 
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log('Submitted:', formData);

        try {
            const response = await authService.login(formData);
            if(response.status === 201 && response.data.accesstoken){
//          Navigate to home page on success;
                console.log(response);
                setAccessToken(response.data.accesstoken);
                navigate('/');
            }

            
        } catch (error) {
            setFormData({email: '', password: ''});
            // If a bad request
            if(error.response){
                setErrorMessage(error.response.data.message);
                console.log(`Registration error: `, error.response);
            }
            // else a network error
            else{
                setErrorMessage('Network error, Try again later');
                console.log("Network error or no response");
            }
            
        }


    };
        
    return(
       <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="w-full max-w-md p-8 shadow-xl bg-base-100 rounded-2xl">
            <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

            <form className="flex flex-col justify-between items-center" onSubmit={handleSubmit}>

            <label className="input validator mb-4">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                </svg>
                <input type="email" placeholder="mail@site.com" name="email" value={formData.email} onChange={handleChange} required />
            </label>

            <label className="input validator mb-6">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="2.5"
                    fill="none"
                    stroke="currentColor"
                    >
                    <path
                        d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                    ></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                </svg>
                <input
                    type="password"
                    required
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
                />
            </label>
            

            <button type="submit" className="btn btn-primary w-full">
                Login
            </button>
            </form>

            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <p className="text-center mt-4 text-sm">
            New user? {' '}
            <Link to="/register" className="text-blue-500 underline hover:text-blue-700">Register here</Link>
            </p>

        </div>
        </div>

    );

}