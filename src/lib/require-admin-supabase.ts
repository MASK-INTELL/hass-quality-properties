import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const adminEmails = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (adminEmails.length > 0) {
      const userEmail = session.user.email?.toLowerCase();
      if (!userEmail || !adminEmails.includes(userEmail)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
  } catch (error) {
    console.error('require-admin error:', error);
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}

export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
