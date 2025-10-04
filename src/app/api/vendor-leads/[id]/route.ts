import { NextRequest, NextResponse } from 'next/server';

interface VendorLead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  whatsapp: string;
  email: string;
  mappedMonthlyPrice?: number;
  subscriptionPriceDhs?: number;
}

// Mock storage for development - in production, this would be a database
const vendorLeads: VendorLead[] = [];

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
