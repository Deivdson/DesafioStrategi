"use client";
import { Transfer, Row, Col, Button, Select, Tooltip, List, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { herosToData, groupsToData } from '@/forms/utils';
import ModalGroup from '../../modals/group';
import { api } from '@/api';
import styles from './index.module.css'
import nookies from "nookies";

export default function Home() {
    const [dataHeros, setDataHeros] = useState(null)
    const [dataGroups, setDataGroups] = useState(null)
    const [dataSource, setDataSource] = useState([])
    
    const [currentGroup, setCurrentGroup] = useState(null)
    const [currentGHeros, setCurrentGHeros] = useState([])    
     
    const [targetKeys, setTargetKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    
    const [openModalGroup, setOpenModalGroup] = useState(false);
    

    const loadHeros = async () =>{
        const dataGroup = await api.grupos();
        const data = await api.heros();

        if(data && dataGroup){            
            
            let dheros = herosToData(data)            
            let gheros = herosToData(dataGroup[0].integrantes)
            
            setDataHeros(dheros);                                    
            setDataSource([...dheros,...gheros])
            setDataGroups(groupsToData(dataGroup));
            setCurrentGHeros(gheros);
            setCurrentGroup(dataGroup[0].id) 
            
            let keys = []
            gheros.map((e) => {keys.push(e.key)})            
            setTargetKeys(keys)
        }
    }    
    
    const onChange = (nextTargetKeys, direction, moveKeys) => {        
        setTargetKeys(nextTargetKeys);
    };
    const onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {        
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const changeGroup = (e) => {        
        setCurrentGroup(e)

        console.log(currentGHeros, currentGroup, dataGroups[0].integrantes, "GROOOUSP")
        let group = dataGroups.filter((g) => g.value == e)[0]
        let gheros = herosToData(group.integrantes)        

        setCurrentGHeros(gheros);

        let keys = []
        gheros.map((e) => {keys.push(e.key)})                   
        setTargetKeys(keys)

        setDataSource([...dataHeros, ...gheros])
    }    

    const finish = async () => {    

        let group = dataGroups.filter((e) => e.value==currentGroup)

        let data = {
            name: group[0].label,
            description: group[0].description,
            heros: targetKeys
        }
        const resp = await api.put_grupo(data, currentGroup)
        console.log("Resp em",resp)
        if (resp.status==200){
            alert("Grupo Atualizado!")
        }
        loadHeros();
    }

    const showDrawGroup = () => {
        setOpenModalGroup(true)
    }
    const onCancelModalGroup = () => {
        setOpenModalGroup(false)
    }

    useEffect(() => {  
        console.log("headers  ",api.defaults.headers, 'nookies ',nookies.get().token)
        loadHeros()     
    }, [])


    return(
    <div className={styles.container}>        
        <ModalGroup open={openModalGroup} onClose={onCancelModalGroup} />        
        
        <h1>Gestão de Grupos de Heróis</h1>

        <Row style={{alignItems:'end'}}>            
            <Col offset={15} span={3}>
                <Button type='link' onClick={showDrawGroup}>
                    + Adicionar grupo
                </Button>                
            </Col>
        </Row>
        <Row>
            <Col offset={2}>
            <Transfer
                titles={
                    ['Heros',
                    <Select 
                        style={{width:"100%"}} 
                        value={currentGroup}                  
                        options={dataGroups} 
                        onChange={changeGroup} 
                    />]}

                dataSource={dataSource}
                targetKeys={targetKeys}
                selectedKeys={selectedKeys}
                onChange={onChange}
                onSelectChange={onSelectChange}
                pagination={true}                             
                listStyle={{color:'white',}}
                style={{color:'white'}}
                render={(item) => 
                    <Tooltip title={item.description}>{item.title}</Tooltip>
                }
            />
                <Button className={styles.submitButton} onClick={finish}>
                    Salvar
                </Button>
            </Col>
        </Row>

        

    </div>
    )
}