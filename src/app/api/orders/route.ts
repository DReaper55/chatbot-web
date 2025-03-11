import { NextResponse } from "next/server";
import { orderDB } from "@/app/lib/database";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/authOptions";

export async function POST(req: Request) {
  const { order } = await req.json();

  try {
    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const res = await orderDB.createOrder(order, session.user?.image);
    return NextResponse.json(res, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const { userId } = await req.json();

  try {
    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await orderDB.getUserOrders(userId, session.user?.image);
    return NextResponse.json(products, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const { orderId } = await req.json();

  try {
    // Fetch session on the server
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const products = await orderDB.deleteOrder(orderId, session.user?.image);
    return NextResponse.json(products, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}