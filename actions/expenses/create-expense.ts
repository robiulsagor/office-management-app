    "use server";

    import { auth } from "@/auth";
    import { prisma } from "@/lib/prisma";

    type CreateExpenseData = {
    date: string;
    categoryId: string;
    amount: number;
    description?: string;
    };

    export async function createExpense(data: CreateExpenseData) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
        return {
            success: false,
            message: "You must be logged in to create an expense.",
        };
        }

        if (!data.date) {
        return {
            success: false,
            message: "Expense date is required.",
        };
        }

        if (!data.categoryId) {
        return {
            success: false,
            message: "Expense category is required.",
        };
        }

        if (data.amount < 0) {
        return {
            success: false,
            message: "Expense amount cannot be negative.",
        };
        }

        const category = await prisma.expenseCategory.findFirst({
        where: {
            id: data.categoryId,
            isActive: true,
        },
        });

        if (!category) {
        return {
            success: false,
            message: "Invalid or inactive expense category.",
        };
        }

        await prisma.expense.create({
        data: {
            date: new Date(`${data.date}T12:00:00`),
            categoryId: data.categoryId,
            amount: data.amount,
            description: data.description?.trim() || null,
            createdById: session.user.id,
        },
        });

        return {
        success: true,
        message: "Expense created successfully.",
        };
    } catch (error) {
        console.error("Create expense error:", error);

        return {
        success: false,
        message: "Something went wrong while creating the expense.",
        };
    }
    }
