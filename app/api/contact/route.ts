import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Salesforce parameters
    const SALESFORCE_URL = "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
    const OLD_ID = "00D280000015pSQ";
    const RECORD_TYPE = "0125j0000016M9";

    // Prepare form data for Salesforce
    const formData = new URLSearchParams();
    formData.append('oid', OLD_ID);
    formData.append('retURL', body.retURL || 'http://localhost:3000/thanks'); // Fallback, though not used for redirection here
    formData.append('recordType', RECORD_TYPE);

    // Map standard fields
    if (body.company) formData.append('company', body.company);
    if (body.last_name) formData.append('last_name', body.last_name);
    if (body.first_name) formData.append('first_name', body.first_name);
    if (body.email) formData.append('email', body.email);
    if (body.tel) formData.append('phone', body.tel); // Note: Salesforce often uses 'phone' or 'mobile'
    if (body.city) formData.append('city', body.city);
    if (body.state) formData.append('state', body.state);

    // Custom Description
    if (body.description) formData.append('description', body.description);

    // Optional debug params (if provided in body, but usually strictly controlled server-side)
    // if (body.debug) formData.append('debug', body.debug);

    // Send to Salesforce
    const response = await fetch(SALESFORCE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    // Salesforce Web-to-Lead returns a redirect (302) or HTML (200) usually.
    // Since we are proxying, we just care if it didn't crash network-wise.
    // Ideally we check response.ok, but Web-to-Lead often returns 200 even on error (printed in HTML).
    // For this implementation, we assume if we sent it, it's good, unless we get a 4xx/5xx.

    if (!response.ok) {
      console.error("Salesforce Error:", response.status, response.statusText);
      return NextResponse.json({ success: false, message: "Failed to submit to Salesforce" }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
