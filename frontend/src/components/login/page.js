"use client";
import { Form, Input, Checkbox, Button,  } from "antd";
import { useState } from "react";
import formData from '@/forms/utils';
import styles from './index.module.css'
import { api } from "@/api";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";

export default function Login(){
    const router = useRouter();    

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    const onFinish = (data) => {
        setLoading(true) 
        const resp = api.login(data)
        if (resp){      
            setLoading(false)      
            router.push('/home')     
            form.resetFields();
        }
    }

    return (
        <div className={styles.container}>
            <h1>Gestão de Grupos de Heróis</h1>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                loading={loading}
                
            >
                <Form.Item                    
                    label="Email"
                    name={'email'}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                    {
                        required: true,
                        message: 'Please input your password!',
                    },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Button type="primary"  htmlType="submit">
                    Entrar
                </Button>
            </Form>

        </div>
    );
}