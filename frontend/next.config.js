/** @type {import('next').NextConfig} */
const nextConfig = {

    env: {
        SESSION_TIME_MINUTE: '60',
        BASE_VALOR_HORA: '90',
        SYSTEM_VERSION: '1.0.0',        
    },
    eslint: {        
        ignoreDuringBuilds: true
    }

}

module.exports = nextConfig
