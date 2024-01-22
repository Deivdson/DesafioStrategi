"use client";
import { Form, Input, Checkbox, Button, Alert,  } from "antd";
import { useCallback, useState } from "react";
import styles from './index.module.css'
import { api } from "@/api";
import { useRouter } from "next/navigation";
import { signIn, useSession, getSession } from "next-auth/react";
import { setCookie, destroyCookie } from "nookies";
import { defineAxiosHeaderWithToken } from "@/api";

export default function Login(){
    const router = useRouter();    

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const session = useSession();

    const onFinish = useCallback(async(data) => {
        setLoading(true)

        let email = data.email
        let password = data.password
        const resp = await api.login(data);        
        
        if (resp?.status !== 200) {

            alert('Não foi possível realizar o login');

        } else {

            const resp2 = await signIn(
                'credentials',
                {
                    email,
                    password,
                    redirect:false
                }
            );
            
            const token = resp?.data?.token;
            console.log("resp de login: ", resp, "resp signin: ", resp2,'\n\n', api.defaults.headers)
            // defineAxiosHeaderWithToken(token)
            // setCookie(null, 'token', token, {
            //     maxAge: 60 * 60 * 24 * 30,
            //     path: '/'
            // });

            router.replace('/home')
                    
        }        
        
        return; 
    }, [])

    return (
        <div className={styles.container}>    
                

            <h1>Gestão de Grupos de Heróis</h1>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                loading={loading}
                
            >
                {/* <label className={styles.label} for='email'>Email</label> */}
                <Form.Item                    
                    name={'email'}>
                    <Input placeholder="E-mail" />
                </Form.Item>
                {/* <label className={styles.label} for='password'>Password</label> */}
                <Form.Item                    
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Por favor, insira sua senha!',
                    },
                    ]}
                >
                    <Input.Password placeholder="Senha" />
                </Form.Item>
                <Button type="primary"  htmlType="submit">
                    Entrar
                </Button>
            </Form>

        </div>
    );
}