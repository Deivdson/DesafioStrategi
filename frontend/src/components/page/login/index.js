"use client";
import { Form, Input, Button, Alert,  } from "antd";
import { useCallback, useState } from "react";
import styles from './index.module.css'
import { api } from "@/api";
import { useRouter } from "next/navigation";
import { signIn, useSession, getSession } from "next-auth/react";
import Link from "next/link";

export default function Login(){
    const router = useRouter();    

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)    

    const onFinish = useCallback(async(data) => {
        setLoading(true)

        let email = data.email
        let password = data.password
        
        const resp = await api.login(data);
        
        if (resp?.status !== 200) {
            alert('Não foi possível realizar o login');
        } else {
            console.log('else ', resp.status)
            const resp2 = await signIn(
                'credentials',
                {
                    email,
                    password,
                    redirect:false
                }
            );
            console.log('Resp 2 ', resp2)


            setLoading(false)

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
            >                
                <Form.Item                    
                    name={'email'}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira seu E-mail!',
                        },
                        ]}
                    >
                    <Input placeholder="E-mail" />
                </Form.Item>
               
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

            <div className={styles.register}>Ainda não possui uma conta? 
                <Link href="/register" style={{color:'rgb(180, 220, 255)'}}>
                    Registre-se aqui.
                </Link>
            </div>

        </div>
    );
}