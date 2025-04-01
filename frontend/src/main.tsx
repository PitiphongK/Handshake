import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <HeroUIProvider>
        <ToastProvider placement={"top-center"} toastOffset={80}/>
        <Provider store={store}>
          <App />
        </Provider>
      </HeroUIProvider>
    </BrowserRouter>
  </StrictMode>,
)
