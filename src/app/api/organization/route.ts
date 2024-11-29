import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Destructure the necessary fields from the request body
    const {
      type,
      orgOrPracId,
      username,
      name,
      ranking,
      photo,
      category,
      subCategory,
      rating,
      totalAppointments,
      zones,
      branches,
      areaOfPractice,
    } = body;

    // Create a new organization record
    const organization = await db.organization.create({
      data: {
        type,
        orgOrPracId,
        username,
        name,
        ranking,
        photo,
        category,
        subCategory,
        rating,
        totalAppointments,
        zones,
        branches,
        areaOfPractice,
      },
    });

    // Return a successful response with the created organization
    return new NextResponse(JSON.stringify(organization), { status: 201 });
  } catch (error) {
    console.log("Error occurred while creating organization:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const district = searchParams.get("district");
    const name = searchParams.get("name");

    const filters = [];
    if (name) filters.push({ name });
    if (district) filters.push({ zones: { has: district } });
    if (location) filters.push({ branches: { has: location } });
    console.log(filters);
    
    const orders = await db.organization.findMany({
    });
    console.log(orders);
    return NextResponse.json(orders);
  } catch (error) {
    console.log("Error coming from order route", error);
    return new NextResponse("Internal Error", { status: 501 });
  }
}
