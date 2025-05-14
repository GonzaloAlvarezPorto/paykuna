'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            toast.success('Ingreso exitoso');
            router.push('/admin');
        } else {
            const data = await res.json().catch(() => ({}));
            toast.error(data.error || 'Credenciales incorrectas');
        }
    };

    return (
        <div className='login'>
            <form onSubmit={handleSubmit}>
                <p>Login Admin</p>
                <div>
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}
