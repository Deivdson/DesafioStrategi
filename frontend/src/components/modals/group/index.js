import { Modal, Form, Input, Select, Space, Button } from "antd";
import { useState, useEffect } from "react";
import { api } from "@/api";
import styles from "./index.module.css"

export default function ModalGroup({open, onClose}) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)

    const onFinish = async(data) => {
      setLoading(true)      
      const new_data = {'name': data.name,
        'description': data.description,
        'heros':[]}
      
      const resp = api.post_grupo(new_data);
      
      if (resp) {
        setLoading(false)
        form.resetFields();
        alert("Grupo Cadastrado!");
      }
    }

    useEffect(() => {
      if(!open){
        form.resetFields();
      }
        
    }, [open, form]);

    return (
        <Modal footer={null} style={{backgroundColor:'#102732'}} className={styles.container} open={open} onCancel={onClose}>
            <h1>Adicionar Grupo</h1>
          <Space direction="vertical">
            <Form
              form={form}
              onFinish={onFinish}
              loading={loading}
              
            >
              <Form.Item
                name={'name'}
                label={'Nome'}
              >
                  <Input />
              </Form.Item>

              <Form.Item
                name={'description'}
                label={'Descrição'}
              >
                  <Input />
              </Form.Item>
              <Button htmlType="submit">
                Adicionar
              </Button>
            </Form>
          </Space>
        </Modal>
    );
}