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
    <div className='admin_dashboard'>
      <div>
        <Link href={"/admin/clients"}>💃 Panel de clientes (FALTA POR EDITAR)</Link>
        <Link href={"/admin/orders"}>🛒 Panel de pedidos (SALTA ERROR AL OBTENER LOS PEDIDOS)</Link>
        <Link href={"/admin/shipping"}>🚚 Panel de tarifas de envío ✔</Link>
        <Link href={"/admin/announcements"}>📰 Panel de novedades (NO HAY PAGINA SIQUIERA)</Link>
        <Link href={"/admin/socials"}>🐦 Panel de redes sociales (NO HAY PAGINA SIQUIERA)</Link>
        <Link href={"/admin/products"}>📦 Panel de productos (ALGO HAY)</Link>
        <Link href={"/admin/aboutus"}>🤗 Panel de mensaje de bienvenida (NO HAY PAGINA SIQUIERA)</Link>
      </div>
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>
        Cerrar sesión
      </button>
    </div>
  );
}
