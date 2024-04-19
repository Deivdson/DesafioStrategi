import { Modal, Form, Input, Select, Space, Button } from "antd";
import { useState, useEffect } from "react";
import { api } from "@/api";
import styles from "./index.module.css";

export default function ModalGroup({ open, onClose }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (data) => {
    setLoading(true);
    const new_data = {
      name: data.name,
      description: data.description,
      integrantes: [],
    };

    const resp = api.post_grupo(new_data);

    if (resp) {
      setLoading(false);
      form.resetFields();
      alert("Grupo Cadastrado!");
    }
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open, form]);

  return (
    <Modal
      footer={null}
      className={styles.container}
      open={open}
      onCancel={onClose}
    >
      <h1>Adicionar Grupo</h1>
      <Space direction="vertical">
        <Form
          form={form}
          onFinish={onFinish}
          loading={loading}
          className={styles.form}
        >
          <label className={styles.label} htmlFor="name">
            Nome
          </label>
          <Form.Item name={"name"}>
            <Input />
          </Form.Item>

          <label className={styles.label} htmlFor="description">
            Descrição
          </label>
          <Form.Item name={"description"}>
            <Input />
          </Form.Item>
          <Button htmlType="submit" className={styles.btn}>
            Adicionar
          </Button>
        </Form>
      </Space>
    </Modal>
  );
}
