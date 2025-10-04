import { NextRequest, NextResponse } from 'next/server';

interface VendorLead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  profileStartingPrice: string;
  profileDescription: string;
  subscriptionCadence: string;
  subscriptionPriceDhs?: number;
  source: string;
  images: string[];
  submittedAt: string;
  status: string;
}

interface VendorLeadRequest {
  businessName: string;
  category: string;
  city: string;
  whatsapp: string;
  email: string;
  website: string;
  instagram: string;
  profileStartingPrice: string;
  profileDescription: string;
  subscriptionCadence: string;
  subscriptionPriceDhs: string;
  source: string;
  honeypot: string;
}

// Mock storage for development - in production, this would be a database
const vendorLeads: VendorLead[] = [];

export async function POST(request: NextRequest) {
  try {
    // Handle multipart/form-data (FormData)
    const formData = await request.formData();

    // Extract text fields
    const body: VendorLeadRequest = {
      businessName: formData.get('businessName') as string,
      category: formData.get('category') as string,
      city: formData.get('city') as string,
      whatsapp: formData.get('whatsapp') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string,
      instagram: formData.get('instagram') as string,
      profileStartingPrice: formData.get('profileStartingPrice') as string,
      profileDescription: formData.get('profileDescription') as string,
      subscriptionCadence: formData.get('subscriptionCadence') as string,
      subscriptionPriceDhs: formData.get('subscriptionPriceDhs') as string,
      source: formData.get('source') as string,
      honeypot: formData.get('honeypot') as string
    };

    // Handle images
    const images: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image_') && value instanceof File) {
        // In a real app, you'd upload these to cloud storage and get URLs
        // For now, we'll just store the filename
        images.push(value.name);
      }
    }

    // Validate required fields
    const requiredFields = [
      'businessName',
      'category',
      'city',
      'whatsapp',
      'email',
      'profileDescription',
      'subscriptionCadence',
      'subscriptionPriceDhs'
    ];

    for (const field of requiredFields) {
      if (!(body as unknown as Record<string, string>)[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check for honeypot spam
    if (body.honeypot) {
      return NextResponse.json(
        { message: 'Application submitted successfully' },
        { status: 200 }
      );
    }

    // Validate images (at least one required) - TEMPORARILY DISABLED FOR TESTING
    // if (images.length === 0) {
    //   return NextResponse.json(
    //     { error: 'At least one image is required' },
    //     { status: 400 }
    //   );
    // }

    // Create vendor lead object
    const vendorLead: VendorLead = {
      id: Date.now().toString(),
      businessName: body.businessName,
      category: body.category,
      city: body.city,
      whatsapp: body.whatsapp,
      email: body.email,
      website: body.website,
      instagram: body.instagram,
      profileStartingPrice: body.profileStartingPrice,
      profileDescription: body.profileDescription,
      subscriptionCadence: body.subscriptionCadence,
      subscriptionPriceDhs: parseFloat(body.subscriptionPriceDhs) || 0,
      source: body.source,
      images: images,
      submittedAt: new Date().toISOString(),
      status: 'pending_review'
    };

    // Store in mock database
    vendorLeads.push(vendorLead);

    // Simulate sending email notification (in production, integrate with email service)
    console.log('📧 Email notification sent to vendors@wervice.ma:', {
      subject: `New Vendor Application: ${vendorLead.businessName}`,
      content: `
New vendor application received:

Business: ${vendorLead.businessName}
Category: ${vendorLead.category}
City: ${vendorLead.city}
Contact: ${vendorLead.whatsapp} | ${vendorLead.email}
Website: ${vendorLead.website || 'Not provided'}
Instagram: ${vendorLead.instagram || 'Not provided'}

Subscription Plan: ${vendorLead.subscriptionCadence} (${vendorLead.subscriptionPriceDhs} DHS)
Profile Starting Price: ${vendorLead.profileStartingPrice || 'Not specified'} MAD

Description: ${vendorLead.profileDescription}

Images: ${vendorLead.images.length} uploaded

Please review and contact the vendor to activate their subscription.
      `
    });

    // Simulate Slack notification (in production, integrate with Slack API)
    console.log('💬 Slack notification sent to #vendor-leads:', {
      text: `🎉 New vendor application: ${vendorLead.businessName} (${vendorLead.category})`,
      fields: {
        business: vendorLead.businessName,
        category: vendorLead.category,
        city: vendorLead.city,
        contact: `${vendorLead.whatsapp} | ${vendorLead.email}`,
        plan: `${vendorLead.subscriptionCadence} (${vendorLead.subscriptionPriceDhs} DHS)`,
        profilePrice: vendorLead.profileStartingPrice ? `${vendorLead.profileStartingPrice} MAD` : 'Not specified'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Vendor application submitted successfully',
      leadId: vendorLead.id
    });

  } catch (error) {
    console.error('Error processing vendor lead:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all leads (for admin purposes)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const leadId = url.pathname.split('/').pop();

  // If we have a lead ID in the path, return that specific lead
  if (leadId && leadId !== 'route') {
    const lead = vendorLeads.find((l) => l.id === leadId);
    if (lead) {
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
    } else {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
  }

  // Otherwise return all leads for admin purposes
  return NextResponse.json({
    leads: vendorLeads,
    total: vendorLeads.length
  });
}
