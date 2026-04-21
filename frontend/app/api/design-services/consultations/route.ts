import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    const formData = await request.formData();

    const response = await fetch(
      `${API_URL}/api/v1/design-requests/consultation`,
      {
        method: "POST",
        headers: authHeader ? { Authorization: authHeader } : undefined,
        body: formData,
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Submit consultation request error:", error);
    return NextResponse.json(
      { error: "Failed to submit consultation request" },
      { status: 500 }
    );
  }
}
