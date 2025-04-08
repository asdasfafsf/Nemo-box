import typia from "typia";
export type NemoRequest<T> = T;
export type NemoResponse<T> = {
    code: NemoResponseCode 
    message: NemoResponseMessage;
    techMessage: NemoResponseTechMessage;
    data: T;
}

export type NemoResponseCode = 
    string
    & (typia.tags.Pattern<"^[1][0-9]{4}$"> & 
    typia.tags.MinLength<5> & 
    typia.tags.MaxLength<5>);
export type NemoResponseMessage = string;
export type NemoResponseTechMessage = string;
