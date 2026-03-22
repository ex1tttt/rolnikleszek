import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { calculateAvailableEggs, isDeadlinePassed } from '@/lib/utils'

// GET /api/delivery-slots - Pobierz dostępne terminy dostawy
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: slots, error } = await supabase
      .from('delivery_slots')
      .select('*')
      .eq('active', true)
      .order('delivery_date', { ascending: true })

    if (error) throw error

    // Filter out expired slots and add available count
    const availableSlots = slots
      .filter((slot) => !isDeadlinePassed(slot.order_deadline))
      .map((slot) => ({
        ...slot,
        eggs_available: calculateAvailableEggs(slot.egg_limit, slot.eggs_reserved),
      }))
      .filter((slot) => slot.eggs_available > 0)

    return NextResponse.json(availableSlots)
  } catch (error) {
    console.error('Error fetching delivery slots:', error)
    return NextResponse.json(
      { error: 'Failed to fetch delivery slots' },
      { status: 500 }
    )
  }
}

// POST /api/delivery-slots - Utwórz nowy termin dostawy (admin)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { delivery_date, order_deadline, egg_limit, zone_description } = body

    if (!delivery_date || !order_deadline || !egg_limit) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('delivery_slots')
      .insert({
        delivery_date,
        order_deadline,
        egg_limit,
        eggs_reserved: 0,
        zone_description: zone_description || null,
        active: true,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating delivery slot:', error)
    return NextResponse.json(
      { error: 'Failed to create delivery slot' },
      { status: 500 }
    )
  }
}
