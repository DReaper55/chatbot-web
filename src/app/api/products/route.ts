import { NextResponse } from "next/server";
import { productDB } from "@/app/lib/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await productDB.getProducts(session.user?.image);

    return NextResponse.json(products, { status: 201 });
  } catch (error: any) {
    if (error.message.includes("Token has expired")) {
      return NextResponse.json(
        { message: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 400 }
    );
  }
}
