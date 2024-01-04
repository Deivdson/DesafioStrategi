  export const formData = (data, formData = null) => {

    if (formData === null) {
      formData = new FormData();
    }
  
    for (const key in data) {
      formData.set(key, data[key]);
    }
    return formData;
  };
  
  export const formInvalid = (form, data) => {
  for (const key in data) {
    form.setFields([
      {
        name: key,
        errors: data[key]
      }
    ]);
  }
};

export const herosToData = (data) => {
  let list = []
  
  data.map((obj) => {    
    list.push({
      key: obj.id,
      title: obj.name,
      description: obj.description
    })
  })

  return list
}

export const groupsToData = (data) => {
  let list = []
  data.map((obj) => {
    list.push({
      value:obj.id,
      label: obj.name,
      description: obj.description,
      integrantes: obj.integrantes
    })
  })
  return list
}