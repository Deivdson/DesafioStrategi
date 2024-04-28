"use client";
import { Transfer, Row, Col, Button, Select, Tooltip, List, Modal } from "antd";
import { useEffect, useState } from "react";
import { herosToData, groupsToData } from "@/forms/utils";
import ModalGroup from "../../modals/group";
import { api } from "@/api";
import styles from "./index.module.css";

export default function Home() {
  const [dataHeros, setDataHeros] = useState(null);
  const [dataGroups, setDataGroups] = useState(null);
  const [dataSource, setDataSource] = useState([]);

  const [currentGroup, setCurrentGroup] = useState(null);
  const [currentGHeros, setCurrentGHeros] = useState([]);

  const [targetKeys, setTargetKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const [openModalGroup, setOpenModalGroup] = useState(false);
  
  const loadHeros = async () => {
    const dataGroup = await api.grupos();
    const data = await api.heros();

    if (data && dataGroup) {
      let dheros = herosToData(data);
      let gheros = herosToData(dataGroup[0]?.integrantes || []);

      console.log("setdatasource: ", [...dheros, ...gheros]);
      setDataHeros(dheros);
      setDataSource([...dheros, ...gheros]);
      setDataGroups(groupsToData(dataGroup));
      setCurrentGHeros(gheros);
      setCurrentGroup(dataGroup[0]?.id || null);

      let keys = [];
      gheros.map((e) => {
        keys.push(e.key);
      });
      setTargetKeys(keys);
    }
  };

  const onChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
  };
  const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const changeGroup = (e) => {
    setCurrentGroup(e);

    let group = dataGroups.filter((g) => g.value == e)[0];
    let gheros = herosToData(group.integrantes);

    setCurrentGHeros(gheros);

    let keys = [];
    gheros.map((e) => {
      keys.push(e.key);
    });
    setTargetKeys(keys);

    setDataSource([...dataHeros, ...gheros]);
  };

  const finish = async () => {
    let group = dataGroups.filter((e) => e.value == currentGroup);

    let data = {
      name: group[0].label,
      description: group[0].description,
      integrantes: targetKeys,
    };

    const resp = await api.patch_grupo(data, currentGroup);
    console.log("Resp em ", resp);
    if (resp?.status == 200) {
      alert("Grupo Atualizado!");
    }
    loadHeros();
  };

  const showDrawGroup = () => {
    setOpenModalGroup(true);
  };
  const onCancelModalGroup = () => {
    setOpenModalGroup(false);
    loadHeros();
  };

  useEffect(() => {
    loadHeros();
  }, []);

  return (
    <div className={styles.container}>
      <ModalGroup open={openModalGroup} onClose={onCancelModalGroup} />

      <h1>Gestão de Grupos de Heróis</h1>

      <Row style={{ alignItems: "end" }}>
        <Col offset={18} span={3}>
          <Button type="link" className={styles.btn} onClick={showDrawGroup}>
            + Adicionar grupo
          </Button>
        </Col>
      </Row>
      <Row>
        <Col offset={2}>
          <Transfer
            titles={[
              "Heros",
              <Select
                value={currentGroup}
                options={dataGroups}
                onChange={changeGroup}
                style={{ backgroundColor: "white" }}
              />,
            ]}
            type="primary"
            dataSource={dataSource}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={onChange}
            onSelectChange={onSelectChange}
            pagination={true}
            listStyle={{ color: "white" }}
            render={(item) => (
              <Tooltip title={item.description}>{item.title}</Tooltip>
            )}
          />
          <Button className={styles.submitButton} onClick={finish}>
            Salvar
          </Button>
        </Col>
      </Row>
    </div>
  );
}
