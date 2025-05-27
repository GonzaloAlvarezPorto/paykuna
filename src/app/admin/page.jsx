'use client';
import Link from 'next/link';

export default function AdminPage() {

  return (
    <div className='admin_dashboard'>
      <Link href={"/admin/clients"}>Clientes</Link>
      <Link href={"/admin/orders"}>Pedidos</Link>
      <Link href={"/admin/shipping"}>Editar tarifas de envío</Link>
      <Link href={"/admin/announcements"}>Editor de novedades</Link>
      <Link href={"/admin/socials"}>Editar redes sociales</Link>
      <Link href={"/admin/products"}>Editar productos</Link>
      <Link href={"/admin/aboutus"}>Editar mensaje de bienvenida</Link>
    </div>
  );
}
