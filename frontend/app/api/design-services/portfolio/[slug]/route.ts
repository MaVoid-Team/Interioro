import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const response = await fetch(`${API_URL}/api/v1/portfolio/${slug}`, {
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Fetch portfolio project error:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio project" },
      { status: 500 }
    );
  }
}
