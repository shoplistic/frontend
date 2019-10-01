interface ServiceVersion {
    version: string;
    updated: number;
}

export interface VersionResponse {
    backend: ServiceVersion;
    frontend: ServiceVersion;
}

export class ServiceInfo {

    updated: string;
    version: string;

    constructor(_sv: ServiceVersion) {
        this.version = _sv.version;
        this.updated = new Date(_sv.updated).toLocaleString();
    }

}