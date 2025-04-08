import typia from "typia";
export type Request<T> = T;
export type Response<T> = {
    code: ResponseCode 
    message: ResponseMessage;
    techMessage: ResponseTechMessage;
    data: T;
}

export type ResponseCode = 
    string
    & (typia.tags.Pattern<"^[1][0-9]{4}$"> & 
    typia.tags.MinLength<5> & 
    typia.tags.MaxLength<5>);
export type ResponseMessage = string;
export type ResponseTechMessage = string;
