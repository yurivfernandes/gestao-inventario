# Módulo Inventário

## Visão Geral
O módulo `inventario` é responsável pelo gerenciamento do inventário físico e digital.

## Estrutura do Módulo
```
inventario/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── item.py
│   └── movimento.py
├── views.py
├── urls.py
└── serializers.py
```

## Componentes Principais

### Modelos
1. **Item**
   - Código
   - Descrição
   - Categoria
   - Status
   - Localização
   
2. **Movimento**
   - Item
   - Tipo (entrada/saída)
   - Data/Hora
   - Responsável
   - Motivo

### Views
- CRUD de itens
- Gestão de movimentações
- Relatórios de inventário

### API Endpoints
- GET/POST `/api/inventario/itens/`
- GET/PUT/DELETE `/api/inventario/itens/<id>/`
- GET/POST `/api/inventario/movimentos/`
- GET `/api/inventario/relatorios/`

## Funcionalidades
- Cadastro de itens
- Controle de movimentações
- Histórico de alterações
- Relatórios de inventário
- Busca e filtros avançados
