import { connectDB } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server'


connectDB();

export async function GET(request: NextRequest) {
    // extract data from token
    const userid = await getDataFromToken(request);
    const user = await User.findOne({ _id: userid }).select("-password")
    // check if there is a user
    return NextResponse.json({
        message: "user found",
        data: user
    })
}