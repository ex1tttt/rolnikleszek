import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// PUT /api/delivery-slots/[id] - Aktualizuj termin dostawy
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const { delivery_date, order_deadline, egg_limit, zone_description, active } = body

    // Validate required fields
    if (!delivery_date || !order_deadline || egg_limit === undefined) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól' },
        { status: 400 }
      )
    }

    // Cannot reduce egg_limit below already reserved eggs
    const { data: currentSlot, error: slotError } = await supabase
      .from('delivery_slots')
      .select('eggs_reserved')
      .eq('id', id)
      .single()

    if (slotError || !currentSlot) {
      return NextResponse.json(
        { error: 'Termin nie znaleziony' },
        { status: 404 }
      )
    }

    if (egg_limit < currentSlot.eggs_reserved) {
      return NextResponse.json(
        { error: `Limit jest za mały. Zarezerwowano już ${currentSlot.eggs_reserved} jajek` },
        { status: 400 }
      )
    }

    // Update slot
    const { data, error } = await supabase
      .from('delivery_slots')
      .update({
        delivery_date,
        order_deadline,
        egg_limit,
        zone_description: zone_description || null,
        active: active !== undefined ? active : true,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating delivery slot:', error)
    return NextResponse.json(
      { error: 'Nie udało się zaktualizować terminu' },
      { status: 500 }
    )
  }
}

// DELETE /api/delivery-slots/[id] - Usuń termin dostawy
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    // Check if there are any orders for this slot
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .eq('slot_id', id)
      .limit(1)

    if (!ordersError && orders && orders.length > 0) {
      return NextResponse.json(
        { error: 'Nie można usunąć terminu, który ma przypisane zamówienia' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('delivery_slots')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting delivery slot:', error)
    return NextResponse.json(
      { error: 'Nie udało się usunąć terminu' },
      { status: 500 }
    )
  }
}
