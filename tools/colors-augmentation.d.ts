import { Color } from "colors";

declare module "colors" {
    export const debug: Color;
    export const error: Color;
    export const important: Color;
    export const info: Color;
    export const prompt: Color;
    export const warn: Color;
}
