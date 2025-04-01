import { HelmetProvider, Helmet } from 'react-helmet-async';
import Navbar from '../../components/Navbar/Navbar'
import { CircleCheck } from 'lucide-react';
import { Button } from '@heroui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';


const Verify = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    useEffect(() => {
        const verifyEmail = async () => {
            const verifyToken = searchParams.get("token") || "";
            const response = await axios.get(`/api/doorway/verify-email/${verifyToken}/`);
            if (response.status === 200) {
                console.log("Email verified");
                const { token, user_id } = response.data as { token: string; user_id: string };
                console.log(token, " ",  user_id);
                localStorage.setItem('authToken', token); // Store token in localStorage
                localStorage.setItem('user_id', user_id);
            }
        }
        verifyEmail();
    }, [searchParams]);
    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Email Verification | Handshake</title>
                </Helmet>
            </HelmetProvider>
            <Navbar />
            <div className='flex w-screen h-60 flex-col justify-center items-center gap-5'>
                <div className='flex gap-2'><CircleCheck color="#41bf30" size={30} /><p className='font-semibold text-green-500'>Your email has been verified</p></div>
                <Button color='default' variant='bordered' onPress={() => navigate("/")}>Go to Home</Button>
            </div>
        </>
    )
}

export default Verify