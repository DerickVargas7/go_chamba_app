import prisma from "../../config/prismaClient.js";

export const getAllServices = async () => {
    return await prisma.oficio.findMany();

}