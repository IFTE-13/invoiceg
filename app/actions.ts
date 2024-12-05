"use server"

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "./utils/hooks"
import { invoiceSchema, onBoradingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";

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

    const sender = {
        email: "hello@demomailtrap.com",
        name: "InvoiceG",
    };

    emailClient.send({
        from: sender,
        to: [{email: 'ifte.phoenix@gmail.com'}],
        template_uuid: "f34e5bd2-6a79-48cf-8835-369ed8ae74cc",
        template_variables: {
            "clientName": submission.value.clientName,
            "invoiceNumber": submission.value.invoiceName,
            "dueDate": new Intl.DateTimeFormat("en-US", {
                dateStyle: "long"
            }).format(new Date(submission.value.dueDate)),
            "totalAmount": formatCurrency({
                amount: submission.value.total,
                currency: submission.value.currency as any
            }),
            "invoiceLink": `http://localhost:3000/api/invoice/${data.id}`
        }
    })

    return redirect("/dashboard/invoices")
}

export async function editInvoice(prevState: any, formData: FormData) {
    const session = await requireUser();

    const submission = parseWithZod(formData, {
        schema: invoiceSchema
    });

    if(submission.status !== "success") return submission.reply();

    const data = await prisma.invoice.update({
        where: {
            id: formData.get("id") as string,
            userId: session.user?.id
        },
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
        }
    });

    const sender = {
        email: "hello@demomailtrap.com",
        name: "InvoiceG",
    };

    emailClient.send({
        from: sender,
        to: [{email: 'ifte.phoenix@gmail.com'}],
        template_uuid: "1d069c9b-fe09-40ba-a0a6-0e33819701f2",
        template_variables: {
            "clientName": submission.value.clientName,
            "invoiceNumber": submission.value.invoiceName,
            "dueDate": new Intl.DateTimeFormat("en-US", {
                dateStyle: "long"
            }).format(new Date(submission.value.dueDate)),
            "totalAmount": formatCurrency({
                amount: submission.value.total,
                currency: submission.value.currency as any
            }),
            "invoiceLink": `http://localhost:3000/api/invoice/${data.id}`
        }
    })

    return redirect("/dashboard/invoices")
}