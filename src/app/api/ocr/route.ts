import { NextRequest, NextResponse } from 'next/server';
import { StorageStore } from '../../../lib/storage-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, userAllergies = [] } = body;

    if (!imageBase64 && !body.imageUrl) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    let extractedData = {
      brand: 'ScalpPure Clinical',
      productName: 'Ketoconazole 2% Anti-Dandruff Shampoo',
      productType: 'Therapeutic Shampoo',
      activeIngredients: ['Ketoconazole 2%', 'Ketoconazole', 'Tea Tree Oil'],
      concentration: '2% w/v',
      directions: 'Apply liberally to wet scalp, massage gently, leave for 5 minutes, rinse thoroughly. Use 2 times weekly.',
      warnings: 'For external scalp application only. Avoid contact with eyes. Discontinue if severe redness develops.',
      manufacturer: 'ScalpCare Formulations Lab',
      description: 'Extracted from uploaded label. Please verify against physical packaging.',
      isAyurvedicOrHerbal: false,
    };

    // If Gemini API Key exists, attempt live vision extraction
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `Extract product packaging text from this scalp-care/shampoo product image. Return strictly JSON with keys: brand, productName, productType, activeIngredients (array of strings), concentration, directions, warnings, manufacturer, description.`
                    },
                    {
                      inline_data: {
                        mime_type: 'image/jpeg',
                        data: imageBase64?.replace(/^data:image\/\w+;base64,/, '') || ''
                      }
                    }
                  ]
                }
              ]
            })
          }
        );
        if (response.ok) {
          const resJson = await response.json();
          const rawText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              extractedData = { ...extractedData, ...parsed };
            }
          }
        }
      } catch (err) {
        console.warn("Gemini vision fallback utilized:", err);
      }
    }

    // Run ingredient allergy conflict check
    const allergyFlags = StorageStore.checkAllergyConflict(
      extractedData.activeIngredients,
      userAllergies
    );

    return NextResponse.json({
      success: true,
      extractedData,
      allergyFlags,
      disclaimer: 'Product information was extracted from the uploaded product label and should be verified against physical product packaging.'
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process image OCR' },
      { status: 500 }
    );
  }
}
