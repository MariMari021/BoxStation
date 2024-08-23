import { Pressable, Text, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

export function Produto({ data, onDelete, onSelect, selectedId }) {
    const isSelected = data.id === selectedId;

    const [fontsLoaded] = useFonts({
        'Fractul-Regular': require('../assets/fonts/Fractul-Regular.ttf'),
        'Fractul-Bold': require('../assets/fonts/Fractul-Bold.ttf'),
        'Fractul-SemiBold': require('../assets/fonts/Fractul-SemiBold.ttf'),
        'Fractul-Light': require('../assets/fonts/Fractul-Light.ttf'),
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
        <Pressable
            style={[styles.container, isSelected ? styles.selectedContainer : null]}
            onPress={onSelect}
        >
            <View stytle={styles.containerDados} onLayout={onLayoutRootView}>
                <View style={styles.alinhar}>
                    <View style={styles.tudo}>
                        <View style={styles.comeco}>
                            <Image
                                style={styles.detalhe}
                                source={require('../assets/detalhe.png')}
                            />
                            <View style={styles.dados}>
                                <View style={styles.infosContainer}>
                                    <View style={styles.icone}>
                                        <Image
                                            style={styles.iconeLapis}
                                            source={require('../assets/iconeLapis.png')}
                                        />
                                    </View>
                                    <Text style={styles.nome}>
                                        {data.nome}
                                    </Text>
                                </View>
                                <View style={styles.infosContainer}>
                                    <View style={styles.icone}>
                                        <Image
                                            style={styles.iconeNumber}
                                            source={require('../assets/iconeNumber.png')}
                                        />
                                    </View>
                                    <Text style={styles.nome}>
                                        {data.quantidade}
                                    </Text>
                                </View>
                            </View>
                        </View>

                    </View>
                    <View style={styles.containerFinal}>
                        <View style={styles.indice}>
                            <Text style={styles.textoId}>{data.id}</Text>
                        </View>
                        <TouchableOpacity style={styles.botaoApagar} onPress={onDelete}>
                            <Text style={styles.textoApagar}>Apagar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2E394D',
        borderRadius: 20

    },

    selectedContainer: {
        borderWidth:5,
        borderColor:'#8FB0EF',
        shadowColor: '#000',  // Cor da sombra
        shadowOffset: { width: 0, height: 2 },  // Deslocamento da sombra
        shadowOpacity: 0.3,  // Opacidade da sombra
        shadowRadius: 4,  // Raio da sombra (suavidade)
        elevation: 5,  // Propriedade usada no Android para gerar sombra
    },
    alinhar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    tudo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        paddingEnd: 20,
        paddingStart: 20,

    },
    comeco: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detalhe: {
        width: 6.59,
        height: 84,
    },
    dados: {
        paddingStart: 10,
        gap: 7
    },
    infosContainer: {
        flexDirection: "row",
        alignItems: 'center'
    },
    icone: {
        backgroundColor: '#8FB0EF',
        padding: 7,
        borderRadius: 13,
        marginEnd: 8
    },
    iconeLapis: {
        width: 20,
        height: 20
    },
    iconeNumber: {
        width: 20,
        height: 20
    },
    nome: {
        fontFamily: 'Fractul-Light',
        color: 'white',
        fontSize: 17
    },
    containerFinal: {
        alignItems: 'flex-end',
        gap: 53

    },
    indice: {
        padding: 3,
        height: 29,
        width: 28,
        backgroundColor: '#8FB0EF',
        alignItems: 'center',
        justifyContent: 'center',
        borderTopRightRadius: 15,
    },
    textoId: {
        fontFamily: "Fractul-Bold",
        color: "white",
        fontSize: 17
    },
    botaoApagar: {
        backgroundColor: '#8FB0EF',
        padding: 5,
        height: 33,
        alignItems: 'center',
        justifyContent: 'center',
        width: 74,
        borderBottomRightRadius: 15
    },
    textoApagar: {
        fontFamily: "Fractul-SemiBold",
        color: 'white',

    }

});
