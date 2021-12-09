export const TEXTS = {
    ENGLISH : {
        GENERAL : {
          PORTUGUESE : "Portuguese",
          ENGLISH : "English",
          LOGOUT : "Logout",
            ACTIONS : {
                ACTIONS : "Actions",
                SAVE : "Save",
                DELETE : "Delete",
                UPDATE : "Update",
                MORE_INFO : "More Information",
                ADD : "Add New",
                BACK_PAGE : "Back Page",
                SELECT : "Select",
                DELETE_SELECTED : "Delete Selected",
                EXPORT : "Export",
                SEARCH : "Search",
                CANCEL : "Cancel"
            },
            LABELS : {
              ACTIVE : "Active",
              INACTIVE : "Inactive",
              NONE : "-"
            }
          },
          MODELS : {
            ID : "Id",
            CUSTOMER : {
              COMPANY_NAME : "Company Name",
              COMMERCIAL_NAME : "Commercial Name",
              CPF : "CPF",
              CNPJ : "CNPJ/CPF",
              STREET : "Street",
              CEP : "CEP",
              NUMBER : "Number",
              CITY : "City",
              PHONE_NUMBER : "Phone Number",
              MOBILE_PHONE_NUMBER : "Mobile Phone Number",
              EMAIL : "Email",
              ACTIVE : "Active",
              NEIGHBORHOOD : "Neighborhood"
            },
            PRODUCT_MODEL : {
              NAME : "Name",
              TYPE : "Type",
              POWER : "Power",
              BRAND : "Brand",
              MODEL : "Model",
              STANDARD_RENTAL_VALUE : "Standard Value",
              REPOSITION_VALUE : "Reposition Value",
              IMAGE : "Image"
            },
            SUPPLIER : {
              COMPANY_NAME : "Company Name",
              COMMERCIAL_NAME : "Commercial Name",
              CPF : "CPF",
              CNPJ : "CNPJ/CPF",
              STREET : "Street",
              CEP : "CEP",
              NUMBER : "Number",
              CITY : "City",
              PHONE_NUMBER : "Phone Number",
              EMAIL : "Email",
              NEIGHBORHOOD : "Neighborhood",
              ACTIVE : "Active"
            },
            RENTAL : {
              CUSTOMER : "Customer",
              START_DATE : "Start Date",
              END_DATE : "End Date",
              INVOICE_NUMBER : "Invoice Number",
              INVOICE_STATUS : "Invoice Status",
              INVOICE : "Invoice",
              TOTAL_VALUE : "Value",
              TOTAL_VALUE_WITH_ADDITIVE : "Total Value with Additives",
              STATUS : "Status",
              APPROVED_DATE : "Approved Date",
              PAYMENT_DUE_DATE : "Payment Due Date",
              PAYMENT_TYPE : "Payment Type",
              STOCK_ITEMS : "Stock Items",
              PERIOD : "Period",
              PROGRESS : "Progress",
              INSTALLMENTS : "Installments",
              WORKING_HOURS : "Working Hours",
              ACTIVE : "Active",
              CONTRACT : "Contract",
              ADDITIVE_NUMBER : "Additive Number"
            },
            ADDITIVE : {
              CUSTOMER : "Customer",
              START_DATE : "Start Date",
              END_DATE : "End Date",
              INVOICE : "Invoice",
              INVOICE_STATUS : "Invoice Status",
              INVOICE_NUMBER : "Invoice Number",
              TOTAL_VALUE : "Value",
              PAYMENT_DUE_DATE : "Payment Due Date",
              PAYMENT_TYPE : "Payment Type",
              STOCK_ITEMS : "Stock Items",
              PERIOD : "Period",
              PROGRESS : "Progress",
              INSTALLMENTS : "Installments",
              WORKING_HOURS : "Working Hours",
              ADDITIVE_NUMBER : "Number"
            },
            STOCK_ITEM : {
              NAME : "Name",
              TYPE : "Type",
              POWER : "Power",
              BRAND : "Brand",
              MODEL : "Model",
              PRESSURE : "Pressure",
              THROUGHPUT : "Throughput",
              VOLTAGE : "Voltage",
              SERIAL_NUMBER : "Serial Number",
              STANDARD_RENTAL_VALUE : "Standard Value",
              REPOSITION_VALUE : "Reposition Value",
              IMAGE : "Image",
              VALUE : "Value",
              CODE : "Code",
              SUPPLIER : "Supplier",
              SUPPLIER_NAME : "Supplier Name",
              ACTIVE : "Active",
              STATUS : "Status",
              NUMBER_OF_USES : "Number of Uses"
            },
            STOCK_ITEM_EVENT : {
              STOCK_ITEM_NAME : "Item",
              STATUS : "Status",
              COMMENT : "Comment",
              DATE : "Date"
            },
            FORMS : {
              CUSTOMER : {
                COMPANY_NAME_REQUIRED : "Company name is required.",
                CNPJ_REQUIRED : "CNPJ or CPF is required.",
                CEP_REQUIRED : "CEP is required.",
                CITY_REQUIRED : "City is required.",
                STREET_REQUIRED : "Street is required.",
                NEIGHBORHOOD_REQUIRED : "Neighborhood is required.",
                NUMBER_REQUIRED : "Number is required.",
                EMAIL_INVALID : "This email is invalid.",
                PHONE_NUMBER_INVALID : "This phone number is invalid."
              },
              PRODUCT_MODEL : {
                NAME_REQUIRED : "Name is required.",
                TYPE_REQUIRED : "Type is required.",
                POWER_REQUIRED : "Power is required."
              },
              SUPPLIER : {
                COMPANY_NAME_REQUIRED : "Company name is required.",
                CNPJ_REQUIRED : "CNPJ is required.",
                CEP_REQUIRED : "CEP is required.",
                CITY_REQUIRED : "City is required.",
                STREET_REQUIRED : "Street is required.",
                NUMBER_REQUIRED : "Number is required.",
                NEIGHBORHOOD_REQUIRED : "Neighborhood is required."
              },
              RENTAL : {
                CUSTOMER_REQUIRED : "Customer is required.",
                STOCK_ITEMS_REQUIRED : "Stock Items are required.",
                START_DATE_REQUIRED : "Start Date is required.",
                END_DATE_REQUIRED : "End Date is required.",
                TOTAL_VALUE_REQUIRED : "Total value is required."
              },
              ADDITIVE : {
                CUSTOMER_REQUIRED : "Customer is required.",
                STOCK_ITEMS_REQUIRED : "Stock Items are required.",
                START_DATE_REQUIRED : "Start Date is required.",
                END_DATE_REQUIRED : "End Date is required.",
                TOTAL_VALUE_REQUIRED : "Total value is required."
              },
              STOCK_ITEM : {
                NAME_REQUIRED : "Name is required.",
                TYPE_REQUIRED : "Type is required.",
                POWER_REQUIRED : "Power is required.",
                CODE_REQUIRED : "Code is required."
              },
              INVOICE : {
                PAYMENT_DUE_DATE : "Payment Due Date",
                PAYMENT_DUE_DATE_REQUIRED : "Payment due date is required."
              },
              LOGIN : {
                USERNAME_REQUIRED : "Username is required.",
                PASSWORD_REQUIRED : "Password is required."
              }
            }
          },
          LEFT_MENU : {
            DASHBOARD : "Dashboard",
            CUSTOMERS : "Customers",
            ADD_CUSTOMER : "Add Customer",
            LIST_CUSTOMERS : "List Customers",
            PRODUCT_MODELS : "Products",
            ADD_PRODUCT_MODEL : "Add Product",
            LIST_PRODUCT_MODELS : "List Products",
            SUPPLIERS : "Suppliers",
            ADD_SUPPLIER : "Add Supplier",
            LIST_SUPPLIERS : "List Suppliers",
            RENTALS : "Rentals",
            ADD_RENTAL : "Add Rental",
            LIST_RENTALS : "List Rentals",
            STOCK_ITEMS : "Products",
            ADD_STOCK_ITEM : "Add Product",
            LIST_STOCK_ITEMS : "List Products",
            EVENTS : "Events",
            INVENTORY : "Inventory",
            INVOICES : "Invoices"
          },
          LOGOUT : {
            READY_TO_LEAVE_MESSAGE : "Ready to leave?",
            SELECT_LOGOUT_MESSAGE : "Select 'Logout' below if you are ready to end your current session.",
            LOGOUT : "Logout",
            CANCEL : "Cancel"
          },
          PAGES : {
            DASHBOARD : {
              CUSTOMERS : "Customers",
              PRODUCT_MODELS : "Products",
              SUPPLIERS : "Suppliers",
              RENTALS : "Rentals",
              STOCK_ITEMS : "Products",
              REVENUE : "Revenue",
              RENTED_MACHINES : "Rented Machines",
              ACTIVE_CUSTOMERS : "Active Customers",
              ACTIVE_RENTS : "Active Rents"
            },
            LIST : {
              CUSTOMERS : "Customers",
              PRODUCT_MODELS : "Products",
              SUPPLIERS : "Suppliers",
              RENTALS : "Rentals",
              STOCK_ITEMS : "Products",
              TOP_CUSTOMERS : "Top Customers",
              TOP_STOCK_ITEMS : "Top Products",
              ADDITIVES : "Additives"
            },
            CREATE : {
              CUSTOMER : "Create Customer",
              PRODUCT_MODEL : "Create Product",
              SUPPLIER : "Create Supplier",
              RENTAL : "Create Rental",
              RENTAL_2 : "Rental",
              OVERVIEW : "Overview",
              ADDITIVES : "Additives",
              ADDITIVE : "Create Additive",
              ADDITIVE_2 : "Additive",
              STOCK_ITEM : "Create Product",
            },
            UPDATE : {
              RENTAL : "Rental",
              CUSTOMER : "Customer",
              STOCK_ITEM : "Product",
              SUPPLIER : "Supplier",
            },
            INVOICE : {
              INVOICE : "Invoice"
            },
            EVENTS : {
              EVENTS : "Events"
            },
            INVENTORY : {
              INVENTORY : "Inventory"
            },
            INVOICES : {
              INVOICES : "Invoices"
            },
            LOGIN : {
              USERNAME : "Username",
              PASSWORD : "Password",
              LOGIN : "Login"
            }
          },
          REAL_CUSTOMER : {
            COMPANY_NAME : "GMA Compressores e Geradores"
          }
    },
    PORTUGUESE : {
      GENERAL : {
        PORTUGUESE : "Português",
        ENGLISH : "Inglês",
        LOGOUT : "Sair",
          ACTIONS : {
              ACTIONS : "Ações",
              SAVE : "Salvar",
              DELETE : "Deletar",
              UPDATE : "Atualizar",
              MORE_INFO : "Mais informações",
              ADD : "Adicionar",
              BACK_PAGE : "Voltar",
              SELECT : "Selecionar",
              DELETE_SELECTED : "Deletar Selecionados",
              EXPORT : "Exportar",
              SEARCH : "Pesquisar",
              CANCEL : "Cancelar"
          },
          LABELS : {
            ACTIVE : "Ativo",
            INACTIVE : "Inativo",
            NONE : "-"
          }
        },
        MODELS : {
          ID : "Id",
          CUSTOMER : {
            COMPANY_NAME : "Nome da Empresa",
            COMMERCIAL_NAME : "Nome Fantasia",
            CPF : "CPF",
            CNPJ : "CNPJ/CPF",
            STREET : "Rua",
            CEP : "CEP",
            NUMBER : "Número",
            CITY : "Cidade",
            PHONE_NUMBER : "Telefone",
            MOBILE_PHONE_NUMBER : "Telefone",
            EMAIL : "Email",
            ACTIVE : "Ativo",
            NEIGHBORHOOD : "Bairro"
          },
          PRODUCT_MODEL : {
            NAME : "Name",
            TYPE : "Tipo",
            POWER : "Potência",
            BRAND : "Marca",
            MODEL : "Modelo",
            STANDARD_RENTAL_VALUE : "Valor Padrão",
            REPOSITION_VALUE : "Valor de Reposição",
            IMAGE : "Imagem"
          },
          SUPPLIER : {
            COMPANY_NAME : "Nome da Empresa",
            COMMERCIAL_NAME : "Nome Fantasia",
            CPF : "CPF",
            CNPJ : "CNPJ/CPF",
            STREET : "Rua",
            CEP : "CEP",
            NUMBER : "Número",
            CITY : "Cidade",
            PHONE_NUMBER : "Telefone",
            EMAIL : "Email",
            NEIGHBORHOOD : "Bairro",
            ACTIVE : "Ativo"
          },
          RENTAL : {
            CUSTOMER : "Cliente",
            START_DATE : "Data de Início",
            END_DATE : "Data de Término",
            INVOICE_NUMBER : "Número da Fatura",
            INVOICE_STATUS : "Status da Fatura",
            INVOICE : "Fatura",
            TOTAL_VALUE : "Valor Total",
            TOTAL_VALUE_WITH_ADDITIVE : "Valor Total com os Aditivos",
            STATUS : "Status",
            APPROVED_DATE : "Data de Aprovação",
            PAYMENT_DUE_DATE : "Vencimento",
            PAYMENT_TYPE : "Método de Pagamento",
            STOCK_ITEMS : "Produtos",
            PERIOD : "Período",
            PROGRESS : "Progresso",
            INSTALLMENTS : "Parcelas",
            WORKING_HOURS : "Horas de trabalho",
            ACTIVE : "Ativo",
            CONTRACT : "Contrato",
            ADDITIVE_NUMBER : "Número do Aditivo"
          },
          ADDITIVE : {
            CUSTOMER : "Cliente",
            START_DATE : "Data de Início",
            END_DATE : "Data de Término",
            INVOICE : "Fatura",
            INVOICE_STATUS : "Status da Fatura",
            INVOICE_NUMBER : "Número da Fatura",
            TOTAL_VALUE : "Valor",
            PAYMENT_DUE_DATE : "Vencimento",
            PAYMENT_TYPE : "Método de Pagamento",
            STOCK_ITEMS : "Produtos",
            PERIOD : "Período",
            PROGRESS : "Progresso",
            INSTALLMENTS : "Parcelas",
            WORKING_HOURS : "Horas de trabalho",
            ADDITIVE_NUMBER : "Número"
          },
          STOCK_ITEM : {
            NAME : "Nome",
            TYPE : "Tipo",
            POWER : "Potência",
            BRAND : "Marca",
            MODEL : "Modelo",
            PRESSURE : "Pressão",
            THROUGHPUT : "Vazão",
            VOLTAGE : "Voltagem",
            SERIAL_NUMBER : "Número de Série",
            STANDARD_RENTAL_VALUE : "Valor Padrão",
            REPOSITION_VALUE : "Valor de Reposição",
            IMAGE : "Imagem",
            VALUE : "Valor",
            CODE : "Código",
            SUPPLIER : "Fornecedor",
            SUPPLIER_NAME : "Nome do Fornecedor",
            ACTIVE : "Ativo",
            STATUS : "Status",
            NUMBER_OF_USES : "Número de Usos"
          },
          STOCK_ITEM_EVENT : {
            STOCK_ITEM_NAME : "Item",
            STATUS : "Status",
            COMMENT : "Comentário",
            DATE : "Data"
          },
          FORMS : {
            CUSTOMER : {
              COMPANY_NAME_REQUIRED : "É necessário inserir o nome da empresa.",
              CNPJ_REQUIRED : "É necessário inserir CNPJ ou CPF.",
              CEP_REQUIRED : "É necessário inserir o CEP.",
              CITY_REQUIRED : "É necessário inserir a cidade.",
              STREET_REQUIRED : "É necessário inserir a rua.",
              NEIGHBORHOOD_REQUIRED : "É necessário inserir o bairro.",
              NUMBER_REQUIRED : "É necessário inserir o número.",
              EMAIL_INVALID : "O email é inválido.",
              PHONE_NUMBER_INVALID : "O telefone é inválido."
            },
            PRODUCT_MODEL : {
              NAME_REQUIRED : "É necessário inserir o nome.",
              TYPE_REQUIRED : "É necessário inserir o tipo.",
              POWER_REQUIRED : "É necessário inserir a potência."
            },
            SUPPLIER : {
              COMPANY_NAME_REQUIRED : "É necessário inserir o nome da empresa.",
              CNPJ_REQUIRED : "É necessário inserir CNPJ ou CPF.",
              CEP_REQUIRED : "É necessário inserir o CEP.",
              CITY_REQUIRED : "É necessário inserir a cidade.",
              STREET_REQUIRED : "É necessário inserir a rua.",
              NUMBER_REQUIRED : "É necessário inserir o número.",
              NEIGHBORHOOD_REQUIRED : "É necessário inserir o bairro."
            },
            RENTAL : {
              CUSTOMER_REQUIRED : "É necessário inserir o cliente.",
              STOCK_ITEMS_REQUIRED : "É necessário escolher produtos.",
              START_DATE_REQUIRED : "É necessário inserir a data de início.",
              END_DATE_REQUIRED : "É necessário inserir a data de término.",
              TOTAL_VALUE_REQUIRED : "É necessário inserir o valor total."
            },
            ADDITIVE : {
              CUSTOMER_REQUIRED : "É necessário inserir o cliente.",
              STOCK_ITEMS_REQUIRED : "É necessário escolher produtos.",
              START_DATE_REQUIRED : "É necessário inserir a data de início.",
              END_DATE_REQUIRED : "É necessário inserir a data de término.",
              TOTAL_VALUE_REQUIRED : "É necessário inserir o valor total."
            },
            STOCK_ITEM : {
              NAME_REQUIRED : "É necessário inserir o nome.",
              TYPE_REQUIRED : "É necessário inserir o tipo.",
              POWER_REQUIRED : "É necessário inserir a potência.",
              CODE_REQUIRED : "É necessário inserir o código."
            },
            INVOICE : {
              PAYMENT_DUE_DATE : "Vencimento",
              PAYMENT_DUE_DATE_REQUIRED : "É necessário inserir o vencimento."
            },
            LOGIN : {
              USERNAME_REQUIRED : "É necessário inserir o nome de usuário.",
              PASSWORD_REQUIRED : "É necessário inserir a senha."
            }
          }
        },
        LEFT_MENU : {
          DASHBOARD : "Painel",
          CUSTOMERS : "Clientes",
          ADD_CUSTOMER : "Criar Cliente",
          LIST_CUSTOMERS : "Lista de Clientes",
          PRODUCT_MODELS : "Produtos",
          ADD_PRODUCT_MODEL : "Criar Produto",
          LIST_PRODUCT_MODELS : "Lista de Produtos",
          SUPPLIERS : "Fornecedores",
          ADD_SUPPLIER : "Criar Fornecedor",
          LIST_SUPPLIERS : "Lista de Fornecedores",
          RENTALS : "Locações",
          ADD_RENTAL : "Criar Locação",
          LIST_RENTALS : "Lista de Locações",
          STOCK_ITEMS : "Produtos",
          ADD_STOCK_ITEM : "Criar Produto",
          LIST_STOCK_ITEMS : "Lista de Produtos",
          EVENTS : "Eventos",
          INVENTORY : "Inventário",
          INVOICES : "Faturamento"
        },
        LOGOUT : {
          READY_TO_LEAVE_MESSAGE : "Pronto para sair?",
          SELECT_LOGOUT_MESSAGE : "Selecione 'Sair' para terminar a sua sessão.",
          LOGOUT : "Sair",
          CANCEL : "Cancelar"
        },
        PAGES : {
          DASHBOARD : {
            CUSTOMERS : "Clientes",
            PRODUCT_MODELS : "Produtos",
            SUPPLIERS : "Fornecedores",
            RENTALS : "Locações",
            STOCK_ITEMS : "Produtos",
            REVENUE : "Receita",
            RENTED_MACHINES : "Máquinas Alugadas",
            ACTIVE_CUSTOMERS : "Clientes Ativos",
            ACTIVE_RENTS : "Aluguéis Ativos"
          },
          LIST : {
            CUSTOMERS : "Clientes",
            PRODUCT_MODELS : "Produtos",
            SUPPLIERS : "Fornecedores",
            RENTALS : "Locações",
            STOCK_ITEMS : "Produtos",
            TOP_CUSTOMERS : "Top Clientes",
            TOP_STOCK_ITEMS : "Top Produtos",
            ADDITIVES : "Aditivos"
          },
          CREATE : {
            CUSTOMER : "Criar Cliente",
            PRODUCT_MODEL : "Criar Produto",
            SUPPLIER : "Criar Fornecedor",
            RENTAL : "Criar Locação",
            RENTAL_2 : "Locação",
            OVERVIEW : "Visão Geral",
            ADDITIVES : "Aditivos",
            ADDITIVE : "Criar Aditivo",
            ADDITIVE_2 : "Aditivo",
            STOCK_ITEM : "Criar Produto",
          },
          UPDATE : {
            RENTAL : "Locação",
            CUSTOMER : "Cliente",
            STOCK_ITEM : "Produto",
            SUPPLIER : "Fornecedor",
          },
          INVOICE : {
            INVOICE : "Faturamento"
          },
          EVENTS : {
            EVENTS : "Eventos"
          },
          INVENTORY : {
            INVENTORY : "Inventário"
          },
          INVOICES : {
            INVOICES : "Faturamento"
          },
          LOGIN : {
            USERNAME : "Nome de Usuário",
            PASSWORD : "Senha",
            LOGIN : "Login"
          }
        },
        REAL_CUSTOMER : {
          COMPANY_NAME : "GMA Compressores e Geradores"
        }
  }
}