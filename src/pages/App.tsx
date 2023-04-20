import { Route, Routes, BrowserRouter } from 'react-router-dom';
import React from 'react';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';

export class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='*' element={<div>404</div>} />
                </Routes>
            </BrowserRouter>
        );
    }
}
