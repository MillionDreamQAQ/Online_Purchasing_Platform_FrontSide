import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { loginUser } from '@/request/userRequest';
import scssStyle from './login.scss';

export const Login: FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleUserNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async e => {
        e.preventDefault();

        if (username === '' || password === '') {
            message.error({
                content: '用户名或密码不能为空',
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
            return;
        }

        const res = await loginUser(username, password);

        if (res.code === 200) {
            message.success({
                content: res.msg,
                duration: 1,
                style: {
                    marginTop: '50px'
                },
                onClose: () => {
                    navigate('/home');
                }
            });
        } else {
            message.error({
                content: res.msg,
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
        }
    };

    const handleRegister = async () => {
        navigate('/register');
    };

    return (
        <div className={scssStyle.login}>
            <div className={scssStyle.title}>在线采购系统登录</div>
            <form className={scssStyle.form}>
                <label>
                    用户名:
                    <input
                        className={scssStyle.input}
                        type='text'
                        name='username'
                        value={username}
                        onChange={handleUserNameInputChange}
                    />
                </label>
                <br />
                <label>
                    密码:
                    <input
                        className={scssStyle.input}
                        type='password'
                        name='password'
                        value={password}
                        onChange={handlePasswordInputChange}
                    />
                </label>
                <br />
                <button onClick={handleLogin} className={scssStyle.button}>
                    登录
                </button>
                <button onClick={handleRegister} className={scssStyle.button}>
                    注册
                </button>
            </form>
        </div>
    );
};
