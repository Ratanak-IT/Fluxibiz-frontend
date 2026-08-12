import { NextResponse } from "next/server";
import { getOpenBanners } from "@/lib/banner/bannerStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banners = getOpenBanners();
    return NextResponse.json({
      status: 200,
      message: "Open banners retrieved successfully",
      data: banners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
