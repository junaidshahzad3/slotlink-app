import { LoginClient } from '@/components/LoginClient';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams;
  return <LoginClient notice={notice} />;
}
