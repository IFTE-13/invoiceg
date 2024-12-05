import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    {
      params,
    }: {
      params: Promise<{ invoiceId: string }>;
    }
  ) {
    try {
        const session = await requireUser();

        const {invoiceId} = await params;

        const invoiceData = await prisma.invoice.findUnique({
            where: {
                id: invoiceId,
                userId: session.user?.id
            }
        });

        if(!invoiceData) return NextResponse.json({error: "Invoice not found"}, {status: 404});

        const sender = {
            email: "hello@demomailtrap.com",
            name: "InvoiceG",
        };

        emailClient.send({
            from: sender,
            to: [{email: 'ifte.phoenix@gmail.com'}],
            template_uuid: "f7fc78fc-e9c9-4d31-b768-5e2a0083fb0b",
            template_variables: {
              "first_name": invoiceData.clientName,
              "company_info_name": "InvoiceG",
              "company_info_address": "Dhanmondi",
              "company_info_city": "Dhaka",
              "company_info_zip_code": "2100",
              "company_info_country": "Bangladesh"
            }
    })

        return NextResponse.json({success: true})
    } catch (error) {
        return NextResponse.json({error: "Failed to send reminder"}, {status: 500})
    }
}