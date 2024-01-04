def get_OL(list, offset=0, limit=None):
    return list[offset:(limit + offset if limit is not None else None)]