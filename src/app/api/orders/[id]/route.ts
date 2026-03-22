import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// PUT /api/orders/[id] - Zaktualizuj zamówienie (zmiana statusu)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['new', 'confirmed', 'completed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status' },
        { status: 400 }
      )
    }

    // Get current order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Zamówienie nie znalezione' },
        { status: 404 }
      )
    }

    // Update order
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Nie udało się zaktualizować zamówienia' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - Usuń zamówienie (anuluj)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    // Get order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Zamówienie nie znalezione' },
        { status: 404 }
      )
    }

    // If order status is 'completed' or 'cancelled', prevent deletion
    if (['completed', 'cancelled'].includes(order.status)) {
      return NextResponse.json(
        { error: 'Nie można usunąć ukończonego lub anulowanego zamówienia' },
        { status: 400 }
      )
    }

    // Get delivery slot to update eggs_reserved
    const { data: slot, error: slotError } = await supabase
      .from('delivery_slots')
      .select('*')
      .eq('id', order.slot_id)
      .single()

    if (slotError || !slot) {
      return NextResponse.json(
        { error: 'Termin dostawy nie znaleziony' },
        { status: 404 }
      )
    }

    // Update slot - decrease reserved eggs
    const { error: updateSlotError } = await supabase
      .from('delivery_slots')
      .update({
        eggs_reserved: Math.max(0, slot.eggs_reserved - order.eggs_quantity),
      })
      .eq('id', order.slot_id)

    if (updateSlotError) throw updateSlotError

    // Delete order
    const { error: deleteError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error deleting order:', error)
    return NextResponse.json(
      { error: 'Nie udało się usunąć zamówienia' },
      { status: 500 }
    )
  }
}
