import { Database } from "../../database.types";

export type Project = Database["public"]["Tables"]["projects"]["Row"]
export type Setting = Database["public"]["Tables"]["settings"]["Row"]