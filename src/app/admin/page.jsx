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
    <div className='sctnPnlAdmin'>
      <div className="subPnl">
        <div className='pnlCol rightSpace'>
          <Link className='link pending' href={"/admin/clients"}>💃 Panel de clientes</Link>
          <Link className='link pending' href={"/admin/orders"}>🛒 Panel de pedidos</Link>
        </div>
        <div className='pnlCol rightSpace'>
        </div>
        <div className="pnlCol">
          <Link className='link done' href={"/admin/announcements"}>📰 Panel de novedades</Link>
          <Link className='link done' href={"/admin/products"}>📦 Panel de productos</Link>
          <Link className='link done' href={"/admin/shipping"}>🚚 Panel de tarifas de envío</Link>
          <Link className='link done' href={"/admin/aboutus"}>🤗 Panel de mensaje de bienvenida</Link>
          <Link className='link done' href={"/admin/socials"}>🐦 Panel de redes sociales</Link>
        </div>
      </div>
      <button className='boxBtnA' onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}
