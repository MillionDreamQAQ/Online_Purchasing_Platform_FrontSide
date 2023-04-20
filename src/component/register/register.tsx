import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { registerUser } from '@/request/userRequest';
import scssStyle from './register.scss';

export const Register: FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleUserNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handlePasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(event.target.value);
    };

    const handleRegister = async e => {
        e.preventDefault();

        if (username === '' || password === '' || confirmPassword === '') {
            message.error({
                content: '用户名或密码不能为空',
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
            return;
        }

        if (username.length <= 5 || password.length <= 5 || confirmPassword.length <= 5) {
            message.error({
                content: '用户名或密码的长度必须大于等于6',
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
            return;
        }

        if (password !== confirmPassword) {
            message.error({
                content: '两次输入的密码不一致',
                duration: 1,
                style: {
                    marginTop: '50px'
                }
            });
            return;
        }

        const res = await registerUser(username, password);

        if (res.code === 200) {
            message.success({
                content: res.msg,
                duration: 1,
                style: {
                    marginTop: '50px'
                },
                onClose: () => {
                    navigate('/');
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

    return (
        <div className={scssStyle.register}>
            <div className={scssStyle.title}>在线采购系统注册</div>
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
                <label>
                    确认密码:
                    <input
                        className={scssStyle.input}
                        type='password'
                        name='confirmPassword'
                        value={confirmPassword}
                        onChange={handleConfirmPasswordInputChange}
                    />
                </label>
                <button onClick={handleRegister} className={scssStyle.button}>
                    注册
                </button>
            </form>
        </div>
    );
};
