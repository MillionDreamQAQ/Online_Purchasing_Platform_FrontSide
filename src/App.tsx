import { Route, Routes, BrowserRouter } from 'react-router-dom';
import React from 'react';
import { Home } from './component/home/home';
import { Login } from './component/login/login';
import { Register } from './component/register/register';

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
