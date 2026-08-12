import { NextResponse, type NextRequest } from "next/server";
import { createBanner, getAllBanners } from "@/lib/banner/bannerStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const banners = getAllBanners();
    return NextResponse.json({
      status: 200,
      message: "All admin banners retrieved successfully",
      data: banners,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, subtitle, imageUrl, linkUrl, badge, status, position } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { status: 400, error: "Bad Request", message: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    const banner = createBanner({
      title: title.trim(),
      subtitle: subtitle?.trim() || "",
      imageUrl: imageUrl.trim(),
      linkUrl: linkUrl?.trim() || "/store",
      badge: badge?.trim() || "PROMOTION",
      status: status === "CLOSED" ? "CLOSED" : "OPEN",
      position: typeof position === "number" ? position : 1,
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Banner created successfully",
        data: banner,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
