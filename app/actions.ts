"use server"

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "./utils/hooks"
import { invoiceSchema, onBoradingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";

export async function onboardUser(prevStat: any, formData: FormData) {
    const session  = await requireUser();

    const submission = parseWithZod(formData, {
        schema: onBoradingSchema
    });

    if(submission.status !== "success") return submission.reply();

    const data = await prisma.user.update({
        where: {
            id: session.user?.id,
        },
        data: {
            firstName: submission.value.firstName,
            lastName: submission.value.lastName,
            address: submission.value.address,
        }
    })

    return redirect("/dashboard")
}


export async function createInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema
    });

    if(submission.status !== "success") return submission.reply();

    const data = await prisma.invoice.create({
        data: {
            clientAddress: submission.value.clientAddress,
            clientEmail: submission.value.clientEmail,
            clientName: submission.value.clientName,
            currency: submission.value.currency,
            date: submission.value.date,
            dueDate: submission.value.dueDate,
            fromAddress: submission.value.fromAddress,
            fromEmail: submission.value.fromEmail,
            fromName: submission.value.fromName,
            invoiceItemDescription: submission.value.invoiceItemDescription,
            invoiceItemQuantity: submission.value.invoiceItemQuantity,
            invoiceItemRate: submission.value.invoiceItemRate,
            invoiceName: submission.value.invoiceName,
            invoiceNumber: submission.value.invoiceNumber,
            status: submission.value.status,
            total: submission.value.total,
            note: submission.value.note,
            userId: session.user?.id
        }
    });

    return redirect("/dashboard/invoices")
}