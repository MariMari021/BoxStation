// Index.js
import { View, Button, StyleSheet, TextInput, Alert, FlatList, Pressable } from 'react-native';
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
                <Button title="Salvar" onPress={create} />
                <Button title="Atualizar" onPress={update} disabled={!selectedId} />
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
        backgroundColor: '#F9F9F9',
    },
    header: {
        paddingTop: 80,
        padding: 32,
        height: 350,
        gap: 15,
        borderBottomEndRadius: 25,
        borderBottomStartRadius: 25,
        backgroundColor: '#fff',
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 2

    },
    flatList: {
        paddingStart: 32,
        paddingEnd: 32,
    },
    texto: {
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingHorizontal: 16,
    },
    pesquisa:{
        height: 54,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: "#999",
        paddingStart: 32,
        paddingEnd: 32,
    },
    selectedInput: {
        borderColor: '#4CAF50',
        borderWidth: 2,
    },
    listContent: {
        gap: 16,
    },
});
