import { NextResponse } from "next/server";
import { productDB } from "@/app/lib/database";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/authOptions";

export async function GET(
  req: Request,
  { params }: { params: { product_id: string } }
) {
  try {
    const { product_id } = params; // Extract product ID from URL

    if (!product_id) {
      return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
    }

    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch product from database using the ID
    const product = await productDB.getProductById(product_id, session.user?.image);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

