import { z } from "zod";
export const userRegisterSchema = z.object({
    userName: z.string().max(20, "userName cannot be more than 20 character").min(3, "userName must be of atleast 3 character"),
    email: z.string().email(),
    password: z.string().min(6, "userName must be of atleast 6 character"),
    gender: z.enum(['male', 'female', 'other'], {
        required_error: "Gender is required",
        invalid_type_error: "Gender must be one of 'male', 'female', or 'other'"
    })
});
