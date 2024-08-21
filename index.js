// Index.js
import { View, StyleSheet, TextInput, Alert, FlatList, Pressable, TouchableOpacity, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { usarBD } from './hooks/usarDB';
import { Produto } from './components/produto';

export function Index() {
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [pesquisa, setPesquisa] = useState('');
    const [produtos, setProdutos] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const produtosBD = usarBD();

    async function create() {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            const item = await produtosBD.create({
                nome,
                quantidade,
            });
            Alert.alert('Produto cadastrado com o ID: ' + item.idProduto);
            setId(item.idProduto);
            listar();
        } catch (error) {
            console.log(error);
        }
    };

    async function listar() {
        try {
            const captura = await produtosBD.read(pesquisa)
            setProdutos(captura)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        listar();
    }, [pesquisa]);

    const handleSelect = (item) => {
        setId(item.id);
        setNome(item.nome);
        setQuantidade(item.quantidade.toString());
        setSelectedId(item.id);
    };

    const remove = async (id) => {
        try {
            await produtosBD.remove(id);
            await listar();
        } catch (error) {
            console.log(error);
        }
    };

    const update = async () => {
        if (isNaN(quantidade)) {
            return Alert.alert('Quantidade', 'A quantidade precisa ser um número!');
        }
        try {
            await produtosBD.update(id, {
                nome,
                quantidade,
            });
            Alert.alert('Produto atualizado com sucesso!');
            listar();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.inventario}>Inventário de Produtos</Text>
                <TextInput
                    style={[styles.texto, selectedId ? styles.selectedInput : null]}
                    placeholder="Nome"
                    onChangeText={setNome}
                    value={nome}
                />
                <TextInput
                    style={[styles.texto, selectedId ? styles.selectedInput : null]}
                    placeholder="Quantidade"
                    onChangeText={setQuantidade}
                    value={quantidade}
                />
                <View style={styles.botao}>
                    <TouchableOpacity style={styles.salvar} onPress={create}>
                        <Text style={styles.textoSalvar}>Salvar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.salvar} onPress={update} disabled={!selectedId}>
                        <Text style={styles.textoSalvar}>Atualizar</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <TextInput
                style={styles.pesquisa}
                placeholder="Pesquisar"
                onChangeText={setPesquisa}
            />
            <FlatList
                style={styles.flatList}
                contentContainerStyle={styles.listContent}
                data={produtos}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => (
                    <Produto
                        data={item}
                        onDelete={() => remove(item.id)}
                        onSelect={() => handleSelect(item)}
                        selectedId={selectedId}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 16,
        backgroundColor: '#Fff',
    },
    header: {
        paddingTop: 80,
        padding: 32,
        height: 350,
        gap: 15,
        borderBottomEndRadius: 25,
        borderBottomStartRadius: 25,
        backgroundColor: '#649160',
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 2

    },
    flatList: {
        paddingStart: 32,
        paddingEnd: 32,
        marginBottom:42
    },
    texto: {
        height: 54,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#999",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },
    pesquisa: {
        paddingVertical:10,
        paddingHorizontal:15,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        marginStart: 32,
        marginEnd: 32,
    },
    selectedInput: {
        borderColor: '#4CAF50',
        borderWidth: 2,
    },
    listContent: {
        gap: 16,
    },
    salvar:{
        backgroundColor:'#fff',
        paddingHorizontal:50,
        paddingVertical:10,
        borderRadius:10
    },
    botao:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    textoSalvar:{
        color:'#649160',
        fontWeight:'900',
        fontSize:17
    },
    inventario:{
        fontSize:25,
        color:"#fff",
        fontWeight:'900'
    }
});
