import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (adminEmails.length > 0) {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase();
    if (!email || !adminEmails.includes(email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }
}
