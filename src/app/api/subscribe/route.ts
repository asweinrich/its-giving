import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;

  if (!email || !apiKey || !formId) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        email,
      }),
    });

    if (!res.ok) {
      throw new Error(`ConvertKit API error: ${res.statusText}`);
    }

    return NextResponse.json({ message: 'Email added successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add email' }, { status: 500 });
  }
}
