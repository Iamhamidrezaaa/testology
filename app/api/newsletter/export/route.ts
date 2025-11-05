import { NextResponse } from "next/server";
import { newsletterStorage } from "@/lib/newsletter-storage";

export async function GET() {
  try {
    // Get CSV content from storage
    const csvContent = newsletterStorage.exportToCSV();

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "خطا در export" },
      { status: 500 }
    );
  }
}
