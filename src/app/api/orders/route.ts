import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} from '@/lib/email'

// Verify reCAPTCHA token
async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured')
    return true // Allow if not configured
  }

  if (!token) {
    return false
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    // Consider score > 0.5 as valid (v3 returns score from 0 to 1)
    return data.success && data.score > 0.5
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error)
    return false
  }
}

// POST /api/orders - Utwórz nowe zamówienie
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const body = await request.json()

    const {
      slot_id,
      customer_name,
      phone,
      email,
      address,
      notes,
      eggs_quantity,
      rodo_accepted,
      recaptchaToken,
    } = body

    // Verify reCAPTCHA token
    const isValidCaptcha = await verifyRecaptchaToken(recaptchaToken)
    if (!isValidCaptcha) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (
      !slot_id ||
      !customer_name ||
      !phone ||
      !email ||
      !address ||
      !eggs_quantity ||
      !rodo_accepted
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate eggs_quantity is a positive number
    if (typeof eggs_quantity !== 'number' || eggs_quantity <= 0 || !Number.isInteger(eggs_quantity)) {
      return NextResponse.json(
        { error: 'Invalid eggs quantity - must be a positive integer' },
        { status: 400 }
      )
    }

    // Validate eggs_quantity is not too large
    if (eggs_quantity > 10000) {
      return NextResponse.json(
        { error: 'Eggs quantity is too large' },
        { status: 400 }
      )
    }

    // Get delivery slot
    const { data: slot, error: slotError } = await supabase
      .from('delivery_slots')
      .select('*')
      .eq('id', slot_id)
      .single()

    if (slotError || !slot) {
      return NextResponse.json(
        { error: 'Invalid delivery slot' },
        { status: 400 }
      )
    }

    // Check if slot is still available
    const availableEggs = slot.egg_limit - slot.eggs_reserved
    if (availableEggs < eggs_quantity) {
      return NextResponse.json(
        { error: 'Not enough eggs available for this slot' },
        { status: 400 }
      )
    }

    // Check deadline
    if (new Date(slot.order_deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Order deadline has passed' },
        { status: 400 }
      )
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        slot_id,
        customer_name,
        phone,
        email,
        address,
        notes: notes || null,
        eggs_quantity,
        status: 'new',
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Update slot - increase reserved eggs
    const { error: updateError } = await supabase
      .from('delivery_slots')
      .update({
        eggs_reserved: slot.eggs_reserved + eggs_quantity,
      })
      .eq('id', slot_id)

    if (updateError) throw updateError

    // Send emails
    const orderNumber = order.id.substring(0, 8).toUpperCase()

    await sendOrderConfirmationEmail(email, {
      orderNumber,
      customerName: customer_name,
      eggQuantity: eggs_quantity,
      deliveryDate: new Date(slot.delivery_date).toLocaleDateString('pl-PL'),
      address,
    })

    await sendAdminNotificationEmail({
      orderNumber,
      customerName: customer_name,
      phone,
      eggQuantity: eggs_quantity,
      deliveryDate: new Date(slot.delivery_date).toLocaleDateString('pl-PL'),
      address,
      notes,
    })

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber,
          status: order.status,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Pobierz zamówienia (admin) z filtrowaniem
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const slot_id = searchParams.get('slot_id')
    const status = searchParams.get('status')
    const email = searchParams.get('email')
    const format = searchParams.get('format') // 'csv' dla eksportu

    let query = supabase.from('orders').select('*')

    // Filters
    if (slot_id) {
      query = query.eq('slot_id', slot_id)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (email) {
      query = query.ilike('email', `%${email}%`)
    }

    const { data: orders, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    // CSV Export
    if (format === 'csv') {
      const csv = generateOrdersCSV(orders || [])
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="orders.csv"',
        },
      })
    }

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// Helper function to generate CSV
function generateOrdersCSV(orders: any[]): string {
  const headers = [
    'ID',
    'Imię i nazwisko',
    'Email',
    'Telefon',
    'Adres',
    'Ilość jajek',
    'Status',
    'Data zamówienia',
  ]

  const rows = orders.map((order) => [
    order.id,
    order.customer_name,
    order.email,
    order.phone,
    order.address,
    order.eggs_quantity,
    order.status,
    new Date(order.created_at).toLocaleDateString('pl-PL'),
  ])

  const csv = [
    headers.map((h) => `"${h}"`).join(','),
    ...rows.map((r) => r.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csv
}
