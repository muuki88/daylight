import {Client} from "../Client";
import {ApiAiRequestError} from "../Errors";
import {IRequestOptions, IServerResponse, IStringMap} from "../Interfaces";
import XhrRequest from "../XhrRequest";

abstract class Request {

    private static handleSuccess(xhr: XMLHttpRequest): Promise<IServerResponse> {
        return Promise.resolve(JSON.parse(xhr.responseText));
    }

    private static handleError(xhr: XMLHttpRequest): Promise<IServerResponse> {

        let error = null;
        try {
            let serverResponse: IServerResponse = JSON.parse(xhr.responseText);
            if (serverResponse.status && serverResponse.status.errorDetails) {
                error = new ApiAiRequestError(serverResponse.status.errorDetails, serverResponse.status.code);
            } else {
                error = new ApiAiRequestError(xhr.statusText, xhr.status);
            }
        } catch (e) {
            error = new ApiAiRequestError(xhr.statusText, xhr.status);
        }
        return Promise.reject(error);
    }

    protected uri;
    protected requestMethod;
    protected headers;

    constructor (protected apiAiClient: Client, protected options: IRequestOptions) {

        this.uri = this.apiAiClient.getApiBaseUrl() + "query?v=" + this.apiAiClient.getApiVersion();
        this.requestMethod = XhrRequest.Method.POST;
        this.headers = {
            "Authorization": "Bearer " + this.apiAiClient.getAccessToken(),
        };

        this.options.lang = this.apiAiClient.getApiLang();
        this.options.sessionId = this.apiAiClient.getSessionId();

    }

    public perform (overrideOptions = null): Promise<IServerResponse> {

        let options = overrideOptions ? overrideOptions : this.options;

        return XhrRequest.ajax(this.requestMethod, this.uri, <IStringMap> options, this.headers)
        // return XhrRequest.post(this.uri, <IStringMap> this.options, this.headers)
            .then(Request.handleSuccess.bind(this))
            .catch(Request.handleError.bind(this));
    }
}

export default Request;
