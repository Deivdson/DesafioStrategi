import axios from "axios";
import nookies from "nookies";
import { setCookie, parseCookies } from "nookies";

const api = axios.create({
    baseURL: 'http://localhost:5000',
    redirect: "follow",
});

api.defaults.headers["Access-Control-Allow-Origin"] = "*, localhost:3000";
api.defaults.headers["Access-Control-Allow-Credentials"] = true;

api.interceptors.request.use((config) => {
    // const token = nookies.get().token;
    const {'nextauth.token': token} = parseCookies()
    
    console.log("TOKEN API ", token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        api.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export function defineAxiosHeaderWithToken(token) {
    const {'nextauth.token': tokens} = parseCookies()
    console.log(`Bearer ${token}`, tokens)

    if(token) {
        api.defaults.headers['Authorization'] = `Bearer ${tokens}`;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    console.log("Headers: ", api.defaults.headers)
    
}

export async function logout(redirect = true) {
    await delete api.defaults.headers.common.Authorization;

    destroyCookie(null, 'login_attempt', {
        path: '/'
    });

    await signOut({
        redirect: redirect,
        callbackUrl: '/login?logout=true'
    });
}

export const login = async (data) => {     
    try{
        const resp = await api.post("/auth/", data);
        defineAxiosHeaderWithToken(resp.data.token)
        setCookie(null, 'token', resp.data.token, {
            maxAge: 68400 * 7,
            path: '/' 
        });     
        return resp

    } catch (error) {
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}

api.login = login

export const register = async (data) => {
    try{
        const resp = await api.post("/auth/register", data)
        return resp.data

    } catch (error) {
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.register = register

export const heros = async (hero_id) => {
    try{
        const resp = await api.get(`/hero/` + (hero_id? `${hero_id}`: '')+'?SEM_GRUPO')        
        return resp.data
        
    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.heros = heros

export const post_hero = async (data) => {
    try{
        const resp = await api.post(`/hero/`, data)
        return resp.data

    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.post_heros = post_hero

export const put_hero = async (data, hero_id) => {
    try{
        if(hero_id){
            const resp = await api.put(`/hero/${hero_id}`, data)
            return resp.data
        }

    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.put_hero = put_hero

export const patch_hero = async (data, hero_id) => {
    try{
        if(hero_id){
            const resp = await api.patch(`/hero/${hero_id}`, data)
            return resp.data
        }

    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.patch_hero = patch_hero

export const grupos = async (group_id) => {
    try{
        const resp = await api.get(`/group/` + (group_id? `${group_id}`: ''))
        console.log(resp.data)
        return resp.data

    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.grupos = grupos

export const post_grupo = async (data) => {    
    try{        
        const resp = await api.post("/group/", data)
        return resp.data
        
    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.post_grupo = post_grupo

export const put_grupo = async (data, group_id) => {
    try{
        if(group_id){
            const resp = await api.put(`/group/${group_id}`, data)
            return resp
        }
        
    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.put_grupo = put_grupo

export const patch_grupo = async (data, group_id) => {
    try{
        if(group_id){
            const resp = await api.patch(`/group/${group_id}`, data)
            return resp.data
        }
        
    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.patch_grupo = patch_grupo

export const delete_grupo = async (group_id) => {
    try{
        if(group_id){
            const resp = await api.delete(`/group/${group_id}`)
            return resp.data
        }
        
    } catch (error){
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.delete_grupo = delete_grupo

export {api};