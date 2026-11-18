import { LoginClient } from '@/components/LoginClient';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string; mode?: string; slug?: string }>;
}) {
  const { notice, mode, slug } = await searchParams;
  return (
    <LoginClient
      notice={notice}
      initialMode={mode === 'signup' ? 'signup' : 'signin'}
      initialSlug={slug}
    />
  );
}
