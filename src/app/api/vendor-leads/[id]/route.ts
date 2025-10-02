import { NextRequest, NextResponse } from 'next/server';

// Mock storage for development - in production, this would be a database
let vendorLeads: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Find the lead by ID
  const lead = vendorLeads.find(l => l.id === id);

  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  // Return only safe fields for the success page
  const safeLead = {
    id: lead.id,
    businessName: lead.businessName,
    category: lead.category,
    city: lead.city,
    whatsapp: lead.whatsapp,
    email: lead.email,
    mappedMonthlyPrice: lead.subscriptionPriceDhs
  };

  return NextResponse.json(safeLead);
}
