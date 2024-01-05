from api.utils.execute import heros

def validate_heros(heros_list=[], group_heros=[], user_id=None):    
    com_grupo = [objeto.get('id') for objeto in heros.get_heros_with_group(user_id)]
    for cg in com_grupo:
        if cg in group_heros:
            com_grupo.remove(cg)
    for h in heros_list:
        if h in com_grupo:
            return True        
    return False