import { NextResponse, type NextRequest } from "next/server";
import { deleteBanner, getAllBanners, updateBanner } from "@/lib/banner/bannerStore";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const banners = getAllBanners();
    const banner = banners.find((b) => b.id === id);

    if (!banner) {
      return NextResponse.json(
        { status: 404, error: "Not Found", message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: 200, data: banner });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, context);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(req, context);
}

async function handleUpdate(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updated = updateBanner(id, body);
    if (!updated) {
      return NextResponse.json(
        { status: 404, error: "Not Found", message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Banner updated successfully",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const success = deleteBanner(id);

    if (!success) {
      return NextResponse.json(
        { status: 404, error: "Not Found", message: "Banner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 200,
      message: "Banner deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
