import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth()
    const { storeId } = params
    const body = await req.json()
    const { name, value } = body

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 })
    if (!name) return new NextResponse('Name is required', { status: 400 })
    if (!value) return new NextResponse('Value is required', { status: 400 })

    const storeByUserId = await prismadb.store.findUnique({
      where: { userId, id: storeId },
    })

    if (!storeByUserId) {
      if (!userId) return new NextResponse('Unauthorized', { status: 403 })
    }

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: storeId,
      },
    })

    return NextResponse.json(color)
  } catch (e) {
    console.error('[COLORS_POST]', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params

    if (!params) {
      return new NextResponse('Store id is required', { status: 400 })
    }

    const colors = await prismadb.color.findMany({
      where: { storeId },
    })

    return NextResponse.json(colors)
  } catch (e) {
    console.error('[COLORS_GET]', e)
    return new NextResponse('Internal error', { status: 500 })
  }
}