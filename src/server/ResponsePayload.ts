export class ResponsePayload {
    code: number;
    payload: any;

    constructor(code: number, payload: any) {
        this.code = code;
        this.payload = payload;
    }
}
