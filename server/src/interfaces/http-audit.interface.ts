interface IHttpAudit {
    user_agent: string
    ip_address: string
    browser: {
        name: string
        version: string
    },
    os: {
        name: string
        version: string
    },
    location: {
        country: string
        region: string
        city: string
    },
    device: {
        model: string
        d_type: string
        vendor: string
    },
    action_performed: string
    isDeleted: boolean
}

export {
    IHttpAudit
}
