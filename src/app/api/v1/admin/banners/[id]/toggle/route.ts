import { NextResponse, type NextRequest } from "next/server";
import { toggleBannerStatus } from "@/lib/banner/bannerStore";

export const dynamic = "force-dynamic";

export async function PATCH(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const banner = toggleBannerStatus(id);

    if (!banner) {
      return NextResponse.json(
        { status: 404, error: "Not Found", message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: `Banner status changed to ${banner.status}`,
      data: banner,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
