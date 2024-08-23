// Index.js
import { View, StyleSheet, TextInput, Alert, FlatList, Pressable, TouchableOpacity, Text, Image, StatusBar } from 'react-native';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
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
            Alert.alert('Produto cadastrado com o Id: ' + item.idProduto);
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

    const [fontsLoaded] = useFonts({
        'Fractul-Regular': require('./assets/fonts/Fractul-Regular.ttf'),
        'Fractul-Bold': require('./assets/fonts/Fractul-Bold.ttf'),
        'Fractul-SemiBold': require('./assets/fonts/Fractul-SemiBold.ttf'),
        'Fractul-Light': require('./assets/fonts/Fractul-Light.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <StatusBar barStyle="light-content" backgroundColor="#8FB0EF" />
            <View style={styles.logoContainer}>
                <View style={styles.logo}>
                    <Image
                        style={styles.iconeLogo}
                        source={require('./assets/logo.png')}
                    />
                    <Text style={styles.nomeEmpresa}>Box<Text style={styles.highlight}>Station</Text></Text>

                </View>
                <Text style={styles.tema}>Inventário</Text>
            </View>
            <View style={styles.marginbox}>
                <View style={styles.box}>
                    <Text style={styles.textoApresentacao}>Organize suas entregas de <Text style={styles.destaque}>E-commerce</Text>, aqui!.</Text>
                    <View style={styles.inputContainer}>
                        <View style={styles.icone}>
                            <Image
                                style={styles.iconeLapis}
                                source={require('./assets/iconeLapis.png')}
                            />
                        </View>
                        <TextInput
                            style={[styles.input, selectedId ? styles.selectedInput : null]}
                            placeholder="Nome da Mercadoria"
                            onChangeText={setNome}
                            value={nome}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <View style={styles.icone}>
                            <Image
                                style={styles.iconeNumber}
                                source={require('./assets/iconeNumber.png')}
                            />
                        </View>
                        <TextInput
                            style={[styles.input, selectedId ? styles.selectedInput : null]}
                            placeholder="Quantidade"
                            onChangeText={setQuantidade}
                            value={quantidade}
                        />
                    </View>
                    <View style={styles.botao}>
                        <TouchableOpacity style={styles.salvar} onPress={create}>
                            <Text style={styles.textoSalvar}>Salvar!</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.atualizar} onPress={update} disabled={!selectedId}>
                            <Text style={styles.textoAtualizar}>Atualizar</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            <View style={styles.main}>
                <View style={styles.search}>
                    <TextInput
                        style={styles.pesquisa}
                        placeholder="Pesquisar"
                        onChangeText={setPesquisa}
                    />
                    <TouchableOpacity style={styles.buscar}>
                        <Text style={styles.textoBuscar}>Buscar</Text>
                        <Image
                            style={styles.iconeBuscar}
                            source={require('./assets/iconeBuscar.png')}
                        />
                    </TouchableOpacity>
                </View>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: '4%',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#8FB0EF',
    },
    logoContainer: {
        flexDirection: "row",
        paddingStart: '8%',
        paddingEnd: '8%',
        alignItems: 'center',
        justifyContent: "space-between",
    },
    logo: {
        flexDirection: "row",
        alignItems: 'center'
    },
    iconeLogo: {
        width: 47,
        height: 47
    },
    nomeEmpresa: {
        fontFamily: 'Fractul-SemiBold',
        color: "#fff",
        fontSize: 21.7
    },
    highlight: {
        color: "rgba(0, 0, 0, 0.68)"
    },
    tema: {
        fontFamily: 'Fractul-Regular',
        color: "white",
        fontSize: 21
    },
    main: {
        flex: 1,
        backgroundColor: 'white',
        borderTopEndRadius: 36,
        borderTopStartRadius: 36,
        paddingTop:65,
        paddingStart:'8%',
        paddingEnd:'8%'
    },
    marginbox: {
        paddingStart: '8%',
        paddingEnd: '8%',
        position: 'relative',
        top: 30,
        zIndex: 1,
    },
    box: {
        backgroundColor: '#2E394D',
        paddingEnd: '10%',
        paddingStart: '10%',
        paddingTop: 27,
        paddingBottom: 27,
        borderRadius: 15,
        gap: 15,

    },
    textoApresentacao: {
        fontFamily: 'Fractul-Regular',
        color: "#fff",
        fontSize: 17
    },
    destaque: {
        fontFamily: 'Fractul-Bold'
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    icone: {
        backgroundColor: '#8FB0EF',
        padding: 10,
        borderRadius: 20
    },
    iconeLapis: {
        width: 24,
        height: 24
    },
    iconeNumber: {
        width: 24,
        height: 24
    },
    input: {
        height: 40,
        backgroundColor: 'white',
        width: 195,
        paddingHorizontal: 18,
        borderRadius: 7,
    },
    botao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    salvar: {
        backgroundColor: '#8FB0EF',
        paddingVertical: 10,
        width: 118,
        alignItems: "center",
        borderRadius: 18
    },
    textoSalvar: {
        color: '#fff',
        fontFamily: "Fractul-Bold",
        fontSize: 15.7
    },
    atualizar: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        width: 118,
        alignItems: "center",
        borderRadius: 18
    },
    textoAtualizar: {
        color: '#8FB0EF',
        fontFamily: "Fractul-Bold",
        fontSize: 15.7
    },
    search:{
        backgroundColor:'rgba(217, 217, 217, 0.74)',
        borderWidth:0.7,
        borderColor:'rgba(46, 57, 77, 0.04)',
        flexDirection:'row', 
        justifyContent:"space-between",
        paddingStart:35,
        paddingEnd:7,
        alignItems:"center",
        height:45,
        borderRadius:25,
        marginBottom:32
    },
    buscar:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:'#Fff',
        height:35,
        borderRadius:18,
        paddingStart:20,
        paddingEnd:13,
        justifyContent:'space-between'
    },
    iconeBuscar:{
        width:27,
        height:27

    },
    textoBuscar:{
        fontFamily:'Fractul-SemiBold',
        color:"#8FB0EF",
        fontSize:16
    },
    flatList: {
        paddingBottom: 52,
        marginBottom:35,
    },
    texto: {
        height: 54,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#999",
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },
    selectedInput: {
        borderColor: '#8FB0EF',
        borderWidth: 3,
    },
    listContent: {
        gap: 16,
    },

});
