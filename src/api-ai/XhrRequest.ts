import {IStringMap} from "./Interfaces";
/**
 * quick ts implementation of example from
 * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
 * with some minor improvements
 * @todo: test (?)
 * @todo: add node.js implementation with node's http inside. Just to make SDK cross-platform
 */
class XhrRequest {
    // Method that performs the ajax request
    public static ajax (
        method: XhrRequest.Method,
        url: string,
        args: IStringMap = null,
        headers: IStringMap = null,
        options: IStringMap = {}
    ): Promise<any> {

        // Creating a promise
        return new Promise(function (resolve, reject) {

            // Instantiates the XMLHttpRequest
            let client: XMLHttpRequest = XhrRequest.createXMLHTTPObject();
            let uri: string = url;
            let payload = null;

            // Add given payload to get request
            if (args && (method === XhrRequest.Method.GET)) {
                uri += "?";
                let argcount = 0;
                for (let key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (argcount++) {
                            uri += "&";
                        }
                        uri += encodeURIComponent(key) + "=" + encodeURIComponent(args[key]);
                    }
                }
            } else if (args) {
                if (!headers) {
                    headers = {};
                }
                headers["Content-Type"] = "application/json";
                payload = JSON.stringify(args);
            }

            for (let key in options) {
                if (key in client) {
                    client[key] = options[key];
                }
            }

            // hack: method[method] is somewhat like .toString for enum Method
            // should be made in normal way
            client.open(XhrRequest.Method[method], uri, true);
            // Add given headers

            if (headers) {
                for (let key in headers) {
                    if (headers.hasOwnProperty(key)) {
                        client.setRequestHeader(key, headers[key]);
                    }
                }
            }

            payload ? client.send(payload) : client.send();

            client.onload = function () {
                if (client.status >= 200 && client.status < 300) {
                    // Performs the function "resolve" when this.status is equal to 2xx
                    resolve(this);
                } else {
                    // Performs the function "reject" when this.status is different than 2xx
                    reject(this);
                }
            };
            client.onerror = function () {
                reject(this);
            };
        });

    }

    public static get (url, payload: IStringMap = null, headers: IStringMap = null, options = {}): Promise<any> {
        return XhrRequest.ajax(XhrRequest.Method.GET, url, payload, headers, options);
    }

    public static post (url: string, payload: IStringMap = null, headers: IStringMap = null,
                        options = {}): Promise<any> {
        return XhrRequest.ajax(XhrRequest.Method.POST, url, payload, headers, options);
    }

    public static put (url: string, payload: IStringMap = null, headers: IStringMap = null,
                       options = {}): Promise<any>  {
        return XhrRequest.ajax(XhrRequest.Method.PUT, url, payload, headers, options);
    }

    public static delete (url: string, payload: IStringMap = null, headers: IStringMap = null,
                          options = {}): Promise<any>  {
        return XhrRequest.ajax(XhrRequest.Method.DELETE, url, payload, headers, options);
    }

    private static XMLHttpFactories = [
        () => new XMLHttpRequest(),
        () => new ActiveXObject("Msxml2.XMLHTTP"),
        () => new ActiveXObject("Msxml3.XMLHTTP"),
        () => new ActiveXObject("Microsoft.XMLHTTP")
    ];

    private static createXMLHTTPObject(): XMLHttpRequest {
        let xmlhttp: XMLHttpRequest = null;
        for (let i = 0; i < XhrRequest.XMLHttpFactories.length; i++) {
            try {
                xmlhttp = XhrRequest.XMLHttpFactories[i]();
            } catch (e) {
                continue;
            }
            break;
        }
        return xmlhttp;
    }
}

namespace XhrRequest {
    export enum Method {
        GET = <any> "GET",
        POST = <any> "POST",
        PUT = <any> "PUT",
        DELETE = <any> "DELETE"
    }
}

export default XhrRequest;
