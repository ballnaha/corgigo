import { Metadata } from 'next';
import NoSSR from '../components/NoSSR';
import ClientPage from './ClientPage';

export const metadata: Metadata = {
  title: 'CorgiGo - บริการส่งอาหารที่เร็วที่สุด',
  description: 'สั่งอาหารจากร้านโปรดของคุณ ส่งตรงถึงบ้าน รวดเร็ว ปลอดภัย',
};

export default function Page() {
  return (
    <NoSSR fallback={null}>
      <ClientPage />
    </NoSSR>
  );
}
