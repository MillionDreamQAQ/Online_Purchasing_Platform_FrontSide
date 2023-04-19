import { Route, Routes, BrowserRouter } from 'react-router-dom';
import React from 'react';
import { Home } from './component/home/home';

export class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route index element={<Home />} />
                </Routes>
            </BrowserRouter>
        );
    }
}
