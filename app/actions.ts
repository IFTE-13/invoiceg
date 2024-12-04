"use server"

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "./utils/hooks"
import { onBoradingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";

export async function onboardUser(prevStat: any, formData: FormData) {
    const session  = await requireUser();

    const submission = parseWithZod(formData, {
        schema: onBoradingSchema
    })

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