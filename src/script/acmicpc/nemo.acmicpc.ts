import { NemoResponse } from '../../types/common'

export async function nemo(): Promise<NemoResponse<any>> {
    
    return {
        code: "1000",
        message: "",
        techMessage: "",
        data: "Hello, World!"
    }
}