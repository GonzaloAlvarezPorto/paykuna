'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className='sctnPnl'>
      <div className='pnlCol'>
        <Link className='link pending' href={"/admin/clients"}>💃 Panel de clientes NO TIENE --{'>'} PAGE+SASS NI PAGEID+SASS</Link>
        <Link className='link pending' href={"/admin/orders"}>🛒 Panel de pedidos NO TIENE --{'>'} PAGE+SASS NI PAGEID+SASS</Link>
        <Link className='link done' href={"/admin/shipping"}>🚚 Panel de tarifas de envío</Link>
        <Link className='link pending' href={"/admin/announcements"}>📰 Panel de novedades NO TIENE --{'>'} PAGE+SASS NI PAGEID+SASS</Link>
        <Link className='link pending' href={"/admin/socials"}>🐦 Panel de redes sociales NO TIENE --{'>'} PAGE+SASS NI PAGEID+SASS</Link>
        <Link className='link pending' href={"/admin/products"}>📦 Panel de productos NO TIENE --{'>'} PAGE+SASS NI PAGEID+SASS</Link>
        <Link className='link done' href={"/admin/aboutus"}>🤗 Panel de mensaje de bienvenida</Link>
      </div>
      <button className='boxBtnA' onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}
