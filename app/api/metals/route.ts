import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const currency = searchParams.get("currency")?.toLowerCase() || "usd";

  try {
    const res = await fetch(`https://latest.currency-api.pages.dev/v1/currencies/${currency}.json`, {
      next: { revalidate: 3600 * 12 }, // Cache for 12 hours
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch rates: ${res.statusText}`);
    }

    const data = await res.json();
    const rates = data[currency];

    if (!rates || !rates.xau || !rates.xag) {
      throw new Error("Metals data not found in response");
    }

    // Rates from API are 1 USD = X XAU (troy ounces).
    // To get price of 1 troy ounce in USD: 1 / XAU.
    // 1 troy ounce = 31.1034768 grams.
    // Price of 1 gram = (1 / XAU) / 31.1034768.

    const troyOunceToGrams = 31.1034768;
    const goldPerGram = (1 / rates.xau) / troyOunceToGrams;
    const silverPerGram = (1 / rates.xag) / troyOunceToGrams;

    return NextResponse.json({
      currency: currency.toUpperCase(),
      goldPerGram: parseFloat(goldPerGram.toFixed(2)),
      silverPerGram: parseFloat(silverPerGram.toFixed(3)),
      timestamp: data.date,
    });
  } catch (error) {
    console.error("Metals API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch live rates" },
      { status: 500 }
    );
  }
}
