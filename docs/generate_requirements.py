import pkg_resources

# Lista todas as bibliotecas instaladas no ambiente virtual
installed_packages = pkg_resources.working_set

# Formata como "nome==versão"
packages_list = sorted([f"{i.key}=={i.version}" for i in installed_packages])

# Salva no arquivo requirements.txt
with open("requirements.txt", "w") as f:
    for package in packages_list:
        f.write(f"{package}\n")

print("Arquivo requirements.txt gerado com sucesso!")
