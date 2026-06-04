import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllAgents, createAgent } from '@/lib/repositories/agents';

export async function GET() {
  const agents = await getAllAgents();
  return NextResponse.json(agents);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agent = await createAgent(body);
    revalidatePath('/about');
    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}
