import axios from "axios";
import { NemoResponse } from '../../types/common'

export function nemo(): NemoResponse<any> {
    
    return {
        code: "10000",
        message: "",
        techMessage: "",
        data: {}
    }
}