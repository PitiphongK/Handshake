import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Button } from "@heroui/react";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="signInPage">
      <HelmetProvider>
        <Helmet>
          <title>Sign In | Handshake</title>
        </Helmet>
      </HelmetProvider>
      <section className="container h-50">
        <div className="flex flex-col justify-center items-center w-full p-16">
            <h1 className="title">Welcome to Handshake!</h1>
            <hr className="divider" />
            <div className='flex gap-2 w-60'>
              <Button color="primary" className='w-full' onPress={() => navigate("/signin")}>Sign In</Button>
              <Button color="primary" className='w-full' onPress={() => navigate("/signup")}>Sign Up</Button>
            </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;