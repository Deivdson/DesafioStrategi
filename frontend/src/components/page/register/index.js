"use client"
import { api } from "@/api";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Form, Input, Button, Alert } from "antd";
import styles from './index.module.css'

export default function Register(){
    const router = useRouter();

    const [form] = Form.useForm();

    const onFinish = async(data) => {
        
        await delete data.confirmPassword
        
        const resp = await api.register(data);

        console.log(resp, 'reps: <-')

        if (resp?.data?.status == 'success'){
            router.push('login')
        }else{
            alert(resp.message)
            return
        }
        form.resetFields()
    }

    const validatePassword = ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('As senhas não coincidem.'));
        },
    });


    return (
        <div className={styles.container}>

            <h1>Registro de usuário</h1>

            <Form
                form={form}
                onFinish={onFinish}
            >
                <label className={styles.label} for='username'>Username:</label>
                <Form.Item
                    name={'username'}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira seu nome de usuário!',
                        },
                        ]}
                >
                    <Input placeholder="Nome de usuário" />
                </Form.Item>

                <label className={styles.label} for='name'>Nome:</label>
                <Form.Item
                    name={'name'}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira seu Nome!',
                        },
                        ]}
                >
                    <Input placeholder="Seu nome" />
                </Form.Item>

                <label className={styles.label} for='email'>E-mail:</label>
                <Form.Item
                    name={'email'}
                    rules={[
                        {
                            required: true,
                            message: 'Por favor, insira seu E-mail!',
                        },
                        ]}
                >
                    <Input placeholder="Seu E-mail" />
                </Form.Item>

                <label className={styles.label} for='password'>Senha</label>
                <Form.Item
                    name="password"
                    rules={[
                    { required: true, message: 'Por favor, insira sua senha.' },
                    { min: 8, message: 'A senha deve ter pelo menos 8 caracteres.' },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <label className={styles.label} for='confirmPassword'>Confirma senha</label>
                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                    { required: true, message: 'Por favor, confirme sua senha.' },
                    validatePassword,
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Button type="primary"  htmlType="submit">
                    Cadastrar dados
                </Button>
            </Form>

        </div>
    )

}