export function setXhrHeaders(formio: any, xhr: any): void;
export default XHR;
declare namespace XHR {
    function trim(text: any): any;
    function path(items: any): any;
    function upload(formio: any, type: any, xhrCallback: any, file: any, fileName: any, dir: any, progressCallback: any, groupPermissions: any, groupId: any, abortCallback: any, multipartOptions: any): Promise<any>;
    function makeXhrRequest(formio: any, xhrCallback: any, serverResponse: any, progressCallback: any, abortCallback: any): Promise<any>;
}
