import axios from "axios";
import nookies from "nookies";
import { setCookie, destroyCookie } from "nookies";
import { signOut } from 'next-auth/react';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    redirect: "follow",
});

api.defaults.headers["Access-Control-Allow-Origin"] = "*";
api.defaults.headers["Access-Control-Allow-Credentials"] = true;

api.interceptors.request.use((config) => {
    const token = nookies.get().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export function defineAxiosHeaderWithToken(token) {        
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
}

export const login = async (data) => {      
    try{
        const resp = await api.post("/auth/", data);        
        const token = resp.data.token;   
        
        defineAxiosHeaderWithToken(token)

        setCookie(null, 'token', token, {
            maxAge: 60 * 60 * 24,
            path: '/' 
        });
        data = {
            data: resp.data,
            status: resp.status
        }     
        return {...data}

    } catch (error) {
        if (error.response?.status == 400) {
            throw error.response.data;
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}

api.login = login


export async function logout(redirect = true) {
    console.log("logout")
    await delete api.defaults.headers.common.Authorization;

    destroyCookie(null, 'token', {
        path: '/'
    });

    await signOut({
        redirect: redirect,
        callbackUrl: '/'
    });
}

api.logout = logout

export const register = async (data) => {
    try{
        const resp = await api.post(`/auth/register/`, data)
        return resp

    } catch (error) {
        if (error.response?.status == 400) {            
            return error.response.data
        } else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.register = register

export const heros = async (hero_id) => {
    try{
        const resp = await api.get(`/herois/` + (hero_id? `${hero_id}/`: '')+'?SEM_GRUPO')        
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
        const resp = await api.post(`/herois/`, data)
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
            const resp = await api.put(`/herois/${hero_id}/`, data)
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
            const resp = await api.patch(`/herois/${hero_id}/`, data)
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
        const resp = await api.get(`/grupos/` + (group_id? `${group_id}/`: ''))
        console.log(resp.data)
        return resp.data

    } catch (error){
        if (error.response?.status == 400) {            
            throw error.response.data;
        }else{
            console.error( "Erro ao acessar servidor", error)
        }
    }
}
api.grupos = grupos

export const post_grupo = async (data) => {    
    try{        
        const resp = await api.post("/grupos/", data)
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
            const resp = await api.put(`/grupos/${group_id}/`, data)
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
            const resp = await api.patch(`/grupos/${group_id}/`, data)
            return resp.data
        }
        
    } catch (error){
        console.log("ERRO DO PATCH ", error)
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
            const resp = await api.delete(`/grupos/${group_id}/`)
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